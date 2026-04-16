<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel_AI_SDK-6-000?logo=vercel" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3.3_70B-f55036?logo=meta" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
</p>

# AI HR Assistant

> **Upload resumes. Paste a job description. Get a senior-level hiring analysis in seconds — streamed in real-time, powered by Groq's lightning-fast inference.**

An AI-powered recruitment screening tool that evaluates candidates with clinical precision. Designed for HR teams, recruiters, and hiring managers who need fast, structured, and language-aware candidate assessments — without sacrificing depth.

---

## Candidate Selection Philosophy

The assistant is built around a deliberate, **optimistic-by-design** scoring philosophy grounded in three principles:

**1. Intent over Keywords**
The AI is explicitly instructed to understand the *purpose* behind each job requirement — not to keyword-match. A candidate who has deployed production LLM pipelines understands the domain well enough to learn scikit-learn; that is treated as a minor skill gap, not a disqualifying miss.

**2. Tiered Gap Assessment**
Skill gaps are classified into three levels, each with a proportional score impact:

| Gap Level | Definition | Score Impact |
|---|---|---|
| **Critical** | Core hard skill with no adjacent proof of competence | −20–30% |
| **Coachable** | Missing a specific tool, but strong in the domain | −5–10% |
| **Optional** | Nice-to-have requirement not met | −2–5% |

**3. Hiring Thresholds (enforced, non-negotiable)**

| Match Score | Decision |
|---|---|
| ≥ 80% | **Hire** |
| 65–79% | **Invite to Interview** |
| < 65% | **Do Not Hire** |

The model is instructed to treat a false negative (overlooking a promising candidate) as more costly than a false positive (interviewing someone who falls short). Strong learning trajectory, cross-domain experience, and evidence of rapid self-education actively increase the match score.

---

## How It Works

```
┌──────────────┐    ┌──────────────────┐    ┌──────────────────────┐    ┌──────────────┐
│   Browser UI  │───▶│  Next.js API      │───▶│  Groq                │───▶│  Streamed MD │
│               │    │  Route            │    │  LLaMA 3.3 · 70B     │    │  Response    │
│ Job Desc +    │    │                  │    │                      │    │              │
│ Resume Files  │    │  PDF/DOCX        │    │  System Prompt +     │    │  Real-time   │
│ + Extra Info  │    │  → Raw Text      │    │  Candidate Context   │    │  Markdown    │
└──────────────┘    └──────────────────┘    └──────────────────────┘    └──────────────┘
```

1. **User inputs** — paste a job description, upload one or more resumes (PDF or DOCX), and optionally add notes per candidate
2. **Server-side parsing** — files are parsed into raw text (`pdf-parse` / `mammoth`) server-side before hitting the LLM
3. **AI streaming** — Vercel AI SDK `streamText()` sends the request to Groq and pipes tokens back in real-time
4. **Structured output** — the response renders as formatted Markdown with match scores, recommendations, and deep analysis
5. **HR Chat** — once analysis is complete, a per-candidate chat panel opens where the AI answers follow-up questions with full context of the analysis

---

## AI Analysis Structure

The AI acts as a **senior HR consultant with 15+ years of experience** and returns a structured report for each candidate:

| Section | What It Covers |
|---|---|
| **Match Percentage** | A specific % alignment score between the candidate and the role |
| **Hiring Recommendation** | `Hire` / `Invite to Interview` / `Do Not Hire` — threshold-enforced |
| **Deep Resume Analysis** | Strengths (3–4 key alignments) + Weaknesses / Red Flags |
| **Candidate Prognosis** | Trainability, cultural fit, work style, and 3-month expectations |
| **HR Notes** | Advanced technical or behavioral interview questions targeting exact skill gaps |
| **Final Verdict** | 2–3 sentence synthesis with one clear, actionable next step |

---

## Features

- **Multi-candidate batch analysis** — upload multiple resumes and analyze them in parallel; each is assigned a numbered candidate slot
- **Additional context per candidate** — attach notes, interview feedback, or referral information alongside each resume
- **Per-candidate HR chat** — after analysis, ask follow-up questions in a streaming chat panel; the AI has full context of the candidate's resume and analysis
- **Bilingual interface** — full EN / PL toggle; all UI text, AI output, and terminology switch to the selected language
- **Language-adaptive chat** — the AI responds in the selected language by default but automatically switches if the user writes in any other language
- **Liquid Glass UI** — frosted glass design with animated gradient backgrounds inspired by Apple's design language
- **Rate limiting** — in-memory sliding window rate limiter (10 req/min per IP, 2-minute cooldown) to protect against abuse
- **Security headers** — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and no-cache on API routes

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server components, API routes, streaming |
| **Styling** | Tailwind CSS 4 + `@tailwindcss/typography` | Utility-first UI with prose rendering |
| **AI Inference** | Groq (`llama-3.3-70b-versatile`) | Ultra-fast LLM inference (~500 tok/s) |
| **AI SDK** | Vercel AI SDK + `@ai-sdk/openai` | Streaming abstraction over OpenAI-compatible APIs |
| **PDF Parsing** | `pdf-parse` | Server-side PDF → text extraction |
| **DOCX Parsing** | `mammoth` | Server-side DOCX → text extraction |
| **Icons** | `lucide-react` | Consistent SVG icon set |
| **Markdown** | `react-markdown` | Render streamed AI output as formatted HTML |

---

## Quick Start

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com/)

### 1. Clone & Install

```bash
git clone https://github.com/shurinbergo3/HR_AI.git
cd HR_AI
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start analyzing candidates.

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts        # Resume analysis: file parsing → Groq streaming
│   │   └── chat-hr/
│   │       └── route.ts        # HR chat: candidate Q&A with full analysis context
│   ├── components/
│   │   └── Logo.tsx             # SVG logo — liquid glass icon + gradient wordmark
│   ├── globals.css              # Tailwind entry + liquid glass utility classes
│   ├── layout.tsx               # Root layout (Inter font, light theme)
│   └── page.tsx                 # Main UI: inputs, upload, results, chat panels
├── lib/
│   ├── locale.ts                # EN/PL translation dictionary
│   └── rateLimit.ts             # In-memory sliding window rate limiter
├── .env.local                   # API keys (git-ignored)
├── next.config.ts               # Next.js config + security headers
├── postcss.config.mjs           # PostCSS + Tailwind
└── tsconfig.json                # TypeScript config
```

---

## Why Streaming Matters

Without streaming, a complex AI analysis can take 10–30 seconds — easily exceeding Vercel's serverless function timeout. Streaming solves this:

- The connection opens immediately → no timeout
- Tokens render on screen as they are generated → perceived latency drops to ~200ms
- The user sees the analysis being written in real-time → significantly better UX

---

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shurinbergo3/HR_AI&env=GROQ_API_KEY)

1. Click the button above or import the repo manually on [vercel.com](https://vercel.com)
2. Add the `GROQ_API_KEY` environment variable in the Vercel dashboard
3. Deploy

---

## License

MIT
