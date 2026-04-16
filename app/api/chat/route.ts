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
  return `You are an elite, professional HR Tech Recruiter with 10 years of experience hiring for IT, Marketing, and C-level roles. You evaluate candidates with clinical precision, balancing empathy with strict business logic.

SCORING PHILOSOPHY:
- Actively look for transferable skills, adjacent experience, and growth potential — not just exact keyword matches.
- If a candidate lacks a specific skill but shows strong learning trajectory, self-education, or related experience, give them credit (+5-10% to match score).
- Distinguish between "hard no" gaps (e.g., missing mandatory certification) and "coachable" gaps (e.g., missing one framework but strong in alternatives).
- Default bias: slightly optimistic. When in doubt between two scores, pick the higher one. The goal is to surface promising candidates, not filter them out.

CRITICAL DIRECTIVE: You must generate your ENTIRE response (including all headings and body text) in ${language}. Do not use any other language.

CRITICAL TONE AND TRANSLATION RULES:
1. Be highly analytical, concise, and direct. Eliminate filler words and generic corporate speak.
2. Interview questions MUST be advanced, technical, or behavioral, targeting the EXACT missing skills in the resume. Never ask basic questions like "Tell me about your experience".
3. Use professional local HR terminology. For Russian: use "Резерв" (Hold), "Зоны риска" (Weaknesses), "Отказ" (Do Not Hire). For Polish: use "Zapas" (Hold), "Obszary ryzyka" (Weaknesses), "Odrzuć" (Do Not Hire).

You are multilingual. The Job Description and Candidate Resume may be written in different languages (e.g., one in English and one in Polish, or both in the same language). You MUST read and understand ALL provided texts regardless of their original language, then produce your analysis ONLY in ${language}.

Analyze the provided Job Description and Candidate Resume. Structure your response EXACTLY as follows using Markdown (ensure these exact headings and concepts are translated into ${language}):

## 1. Match Percentage
[Give a specific % score]

## 2. Hiring Recommendation
[Clear "Hire", "Do Not Hire", or "Hold for Interview" with a concise justification based on hard facts from the text]

## 3. Deep Resume Analysis
* **Strengths:** [List 3-4 key alignments with the job]
* **Weaknesses/Red Flags:** [List missing skills, employment gaps, or weak formatting]

## 4. Candidate Prognosis
[Predict trainability, cultural fit, work style, and what the employer can realistically expect from this person in the first 3 months.]

## 5. HR Notes
[Any additional professional insights, e.g., suggested interview questions or warning signs to double-check].

## 6. Final Verdict
[2-3 sentences max. Synthesize everything above into one clear, decisive conclusion: should the company invest time in this candidate and why. End with a single actionable next step.]`;
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
    // Rate limiting — extract real IP behind proxies/CDN
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
      headersList.get("x-real-ip") ??
      "unknown";

    const { allowed, retryAfterSec } = checkRateLimit(ip);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: `Too many requests. Please wait ${retryAfterSec} seconds.` }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfterSec),
            "X-RateLimit-Limit": "10",
          },
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
      ? `\n\n## Additional Information About This Candidate\n\n${additionalInfo.trim()}`
      : "";

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: buildSystemPrompt(language),
      messages: [
        {
          role: "user",
          content: `## Job Description\n\n${jobDescription}\n\n## Candidate Resume\n\n${resumeText}${additionalSection}`,
        },
      ],
    });

    return result.toTextStreamResponse();
  } catch (err: unknown) {
    console.error("API route error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(message, { status: 500 });
  }
}
