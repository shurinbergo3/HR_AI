import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rateLimit";

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) throw new Error("GROQ_API_KEY is not set in environment variables.");

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey,
});

interface Message {
  role: "user" | "assistant";
  content: string;
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
        JSON.stringify({ error: `Too many requests. Please wait ${retryAfterSec} seconds.` }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfterSec),
          },
        },
      );
    }

    const body = await req.json() as {
      messages: Message[];
      candidateAnalysis: string;
      candidateName: string;
      language: string;
    };

    const { messages, candidateAnalysis, candidateName, language } = body;

    if (!messages || !candidateAnalysis) {
      return new Response("Missing required fields.", { status: 400 });
    }

    const systemPrompt = `You are a senior HR consultant and talent acquisition specialist with 15+ years of experience. You have just completed a detailed analysis of a candidate named "${candidateName}".

Here is the full analysis you produced:

---
${candidateAnalysis}
---

Your role now is to answer follow-up questions about this candidate from the recruiter or hiring manager. You have deep knowledge of this specific candidate based on the analysis above.

BEHAVIOR RULES:
1. Default response language: ${language}. However, if the user writes in a different language, IMMEDIATELY switch to that language and continue in it for the rest of the conversation.
2. Be concise, direct, and professional. No filler phrases.
3. Reference specific details from the analysis when answering — quote numbers, skills, or observations where relevant.
4. If asked something not covered by the analysis, say so clearly and offer your professional opinion based on what IS known.
5. Never fabricate information about the candidate that is not in the analysis or resume.
6. You may suggest interview questions, flag risks, compare to role requirements, or give hiring advice — all grounded in the analysis above.`;

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (err: unknown) {
    console.error("HR chat route error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(message, { status: 500 });
  }
}
