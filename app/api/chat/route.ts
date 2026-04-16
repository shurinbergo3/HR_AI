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

function parseGroqError(err: unknown): { message: string; status: number } {
  if (!(err instanceof Error)) return { message: "Internal server error", status: 500 };

  const msg = err.message;

  // Daily token limit
  if (msg.includes("tokens per day") || msg.includes("TPD")) {
    const retryMatch = msg.match(/try again in ([\d]+m[\d.]+s|[\d.]+s)/i);
    const retryIn = retryMatch ? ` Please try again in ${retryMatch[1]}.` : "";
    return {
      message: `Groq daily token limit reached (100k/day on free tier).${retryIn} Upgrade at https://console.groq.com/settings/billing`,
      status: 429,
    };
  }

  // Per-minute token limit
  if (msg.includes("tokens per minute") || msg.includes("TPM")) {
    const retryMatch = msg.match(/try again in ([\d.]+s)/i);
    const retryIn = retryMatch ? ` Retry in ${retryMatch[1]}.` : " Please wait a moment.";
    return {
      message: `Rate limit: too many tokens per minute.${retryIn}`,
      status: 429,
    };
  }

  // Request rate limit
  if (msg.includes("rate_limit_exceeded") || msg.includes("Rate limit")) {
    return { message: "Rate limit reached. Please wait a moment and try again.", status: 429 };
  }

  return { message: msg || "Internal server error", status: 500 };
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
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
      headersList.get("x-real-ip") ??
      "unknown";

    const { allowed, retryAfterSec } = checkRateLimit(ip);
    if (!allowed) {
      return new Response(
        `Too many requests. Please wait ${retryAfterSec} seconds.`,
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        },
      );
    }

    const formData = await req.formData();
    const jobDescription = formData.get("jobDescription") as string;
    const resumeFile = formData.get("resume") as File;
    const language = (formData.get("language") as string) || "English";
    const additionalInfo = (formData.get("additionalInfo") as string | null) || "";

    if (!jobDescription || !resumeFile) {
      return new Response("Missing job description or resume file.", { status: 400 });
    }

    const resumeText = await extractText(resumeFile);

    const additionalSection = additionalInfo.trim()
      ? `\n\n## Additional Information\n\n${additionalInfo.trim()}`
      : "";

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: buildSystemPrompt(language),
      messages: [
        {
          role: "user",
          content: `## Job Description\n\n${jobDescription}\n\n## Resume\n\n${resumeText}${additionalSection}`,
        },
      ],
    });

    return result.toTextStreamResponse();
  } catch (err: unknown) {
    console.error("API route error:", err);
    const { message, status } = parseGroqError(err);
    return new Response(message, { status });
  }
}
