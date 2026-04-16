import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import mammoth from "mammoth";

// pdf-parse v1 only has CJS export
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse/lib/pdf-parse");

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

function buildSystemPrompt(language: string) {
  return `You are an elite, professional HR Tech Recruiter with 10 years of experience hiring for IT, Marketing, and C-level roles. You evaluate candidates with clinical precision, balancing empathy with strict business logic.

CRITICAL DIRECTIVE: You must generate your ENTIRE response (including all headings and body text) in ${language}. Do not use any other language.

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
[Any additional professional insights, e.g., suggested interview questions or warning signs to double-check].`;
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
    const formData = await req.formData();
    const jobDescription = formData.get("jobDescription") as string;
    const resumeFile = formData.get("resume") as File;
    const language = (formData.get("language") as string) || "English";

    if (!jobDescription || !resumeFile) {
      return new Response("Missing job description or resume file.", { status: 400 });
    }

    const resumeText = await extractText(resumeFile);

    const result = streamText({
      model: groq("llama3-70b-8192"),
      system: buildSystemPrompt(language),
      messages: [
        {
          role: "user",
          content: `## Job Description\n\n${jobDescription}\n\n## Candidate Resume\n\n${resumeText}`,
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
