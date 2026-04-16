import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import mammoth from "mammoth";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rateLimit";

// pdf-parse v1 only has CJS export
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse/lib/pdf-parse");

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) throw new Error("GROQ_API_KEY is not set in environment variables.");

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey,
});

// Models tried in order — each has its own daily quota
const FALLBACK_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"] as const;

function isDayLimit(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("tokens per day") || msg.includes("TPD");
}

function buildSystemPrompt(language: string) {
  return `You are a senior HR consultant (15yr exp). Respond entirely in ${language}. You can read any language but always output in ${language}.

SCORING (mandatory thresholds):
- <65% → "Do Not Hire"
- 65-79% → "Hold for Interview"
- ≥80% → "Hire"

GAP WEIGHTING:
- Critical (no adjacent skill): -20-30%
- Coachable (wrong tool, right domain): -5-10%
- Optional (nice-to-have): -2-5%
- Reward: fast-learner signals, production deployments, cross-domain XP → +5-10%
- Default bias: optimistic. False negative > false positive in cost.

TONE: Analytical, concise, zero filler. Interview questions must be advanced/technical targeting exact gaps.

OUTPUT FORMAT (translate headings to ${language}):

## 1. Match Percentage
[X%]

## 2. Hiring Recommendation
["Hire" / "Do Not Hire" / "Hold for Interview" + 1-sentence justification]

## 3. Deep Resume Analysis
* **Strengths:** [3-4 points]
* **Weaknesses/Red Flags:** [gaps, missing skills]

## 4. Candidate Prognosis
[Trainability, cultural fit, 3-month outlook]

## 5. HR Notes
[Advanced interview questions targeting specific gaps]

## 6. Final Verdict
[2-3 sentences. One actionable next step.]`;
}

/** Extracts a human-readable error + retry seconds from Groq/AI SDK errors. */
function parseGroqError(err: unknown): { message: string; retrySec: number | null } {
  const raw = err instanceof Error ? err.message : String(err);

  const isTokenDay = raw.includes("tokens per day") || raw.includes("TPD");
  const isTokenMin = raw.includes("tokens per minute") || raw.includes("TPM");
  const isRateLimit = raw.includes("rate_limit_exceeded") || raw.includes("Rate limit");

  // Extract "try again in Xm Y.Zs" or "try again in Y.Zs"
  const retryFull = raw.match(/try again in (\d+)m([\d.]+)s/i);
  const retryShort = raw.match(/try again in ([\d.]+)s/i);
  let retrySec: number | null = null;
  if (retryFull) {
    retrySec = parseInt(retryFull[1]) * 60 + parseFloat(retryFull[2]);
  } else if (retryShort) {
    retrySec = parseFloat(retryShort[1]);
  }

  if (isTokenDay) {
    const wait = retrySec ? ` Retry in ${Math.ceil(retrySec / 60)}m ${Math.ceil(retrySec % 60)}s.` : "";
    return { message: `GROQ_TOKEN_DAY_LIMIT:${retrySec ?? 1800}`, retrySec };
  }
  if (isTokenMin) return { message: `GROQ_TOKEN_MIN_LIMIT:${retrySec ?? 60}`, retrySec };
  if (isRateLimit) return { message: `GROQ_RATE_LIMIT:${retrySec ?? 60}`, retrySec };

  return { message: raw || "Internal server error", retrySec: null };
}

async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }
  if (ext === "docx") {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }
  throw new Error("Unsupported file type. Please upload PDF or DOCX.");
}

export async function POST(req: Request) {
  // Rate limiting
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const { allowed, retryAfterSec } = checkRateLimit(ip);
  if (!allowed) {
    return new Response(`__ERROR__:RATE_LIMIT:${retryAfterSec}`, { status: 200 });
  }

  try {
    const formData = await req.formData();
    const jobDescription = formData.get("jobDescription") as string;
    const resumeFile = formData.get("resume") as File;
    const language = (formData.get("language") as string) || "English";
    const additionalInfo = (formData.get("additionalInfo") as string | null) || "";

    if (!jobDescription || !resumeFile) {
      return new Response("__ERROR__:Missing job description or resume file.", { status: 200 });
    }

    const resumeText = await extractText(resumeFile);

    const additionalSection = additionalInfo.trim()
      ? `\n\n## Additional Information\n\n${additionalInfo.trim()}`
      : "";

    const messages = [
      {
        role: "user" as const,
        content: `## Job Description\n\n${jobDescription}\n\n## Resume\n\n${resumeText}${additionalSection}`,
      },
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let lastErr: unknown = null;

        for (const model of FALLBACK_MODELS) {
          let dayLimitHit = false;

          const result = streamText({
            model: groq(model),
            system: buildSystemPrompt(language),
            messages,
            maxRetries: 0,
          });

          try {
            for await (const event of result.fullStream) {
              if (event.type === "text-delta") {
                controller.enqueue(encoder.encode(event.textDelta));
              } else if (event.type === "error") {
                if (isDayLimit(event.error)) { dayLimitHit = true; lastErr = event.error; break; }
                const { message } = parseGroqError(event.error);
                controller.enqueue(encoder.encode(`__ERROR__:${message}`));
                controller.close();
                return;
              }
            }
          } catch (err) {
            if (isDayLimit(err)) { dayLimitHit = true; lastErr = err; }
            else {
              const { message } = parseGroqError(err);
              controller.enqueue(encoder.encode(`__ERROR__:${message}`));
              controller.close();
              return;
            }
          }

          if (!dayLimitHit) { controller.close(); return; }
          // else try next model
        }

        // All models exhausted
        const { message } = parseGroqError(lastErr);
        controller.enqueue(encoder.encode(`__ERROR__:${message}`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: unknown) {
    console.error("API route error:", err);
    const { message } = parseGroqError(err);
    return new Response(`__ERROR__:${message}`, { status: 200 });
  }
}
