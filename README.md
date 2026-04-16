<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel_AI_SDK-6-000?logo=vercel" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3_70B-f55036?logo=meta" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
</p>

# ✨ AI HR Assistant

> **Drop a resume. Paste a job description. Get a senior-level hiring analysis in seconds — streamed in real-time, powered by Groq's lightning-fast inference.**

An AI-powered recruitment screening tool that evaluates candidates with clinical precision, balancing empathy with strict business logic. Built for HR teams, recruiters, and hiring managers who need fast, structured, and language-aware candidate assessments.

---

## 🎬 How It Works

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Browser UI  │────▶│  Next.js API  │────▶│  Groq (LLaMA 3) │────▶│  Streamed MD │
│              │     │   Route       │     │   70B · 8192ctx  │     │   Response   │
│ Job Desc +   │     │              │     │                  │     │              │
│ Resume File  │     │ PDF/DOCX     │     │ System Prompt    │     │ Real-time    │
│ + Language   │     │ → Raw Text   │     │ + Language Dir.  │     │ Markdown     │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────┘
```

1. **User inputs** — paste a job description and drag-and-drop a resume (PDF or DOCX)
2. **Server-side parsing** — the file is parsed into raw text (`pdf-parse` / `mammoth`) before hitting the LLM
3. **AI streaming** — Vercel AI SDK `streamText()` sends the request to Groq and pipes tokens back in real-time
4. **Structured output** — the response renders as formatted Markdown with match scores, recommendations, and deep analysis

---

## 🧠 AI Analysis Structure

The AI acts as an **elite HR Tech Recruiter with 10 years of experience** and returns a structured report:

| Section | What It Covers |
|---|---|
| **Match Percentage** | A specific % alignment score between the candidate and the role |
| **Hiring Recommendation** | `Hire` / `Do Not Hire` / `Hold for Interview` — backed by hard facts |
| **Deep Resume Analysis** | Strengths (3-4 key alignments) + Weaknesses/Red Flags |
| **Candidate Prognosis** | Trainability, cultural fit, work style, and 3-month expectations |
| **HR Notes** | Interview question suggestions, warning signs, professional insights |

---

## 🌍 Bilingual Interface

Full **English ↔ Polish** toggle in the header. When you switch languages:

- All UI text (buttons, labels, placeholders, headings) switches instantly via a client-side locale dictionary
- The selected language is passed to the API and injected into the system prompt as a **critical directive**
- The AI generates its **entire response** in the requested language — headings, body text, analysis, everything

---

## 🏗 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server components, API routes, file-based routing |
| **Styling** | Tailwind CSS 4 | Utility-first dark theme UI |
| **AI Inference** | Groq (`llama3-70b-8192`) | Ultra-fast LLM inference (~500 tok/s) |
| **AI SDK** | Vercel AI SDK + `@ai-sdk/openai` | Streaming abstraction over OpenAI-compatible APIs |
| **PDF Parsing** | `pdf-parse` | Server-side PDF → text extraction |
| **DOCX Parsing** | `mammoth` | Server-side DOCX → text extraction |
| **Icons** | `lucide-react` | Lightweight icon set |
| **Markdown** | `react-markdown` | Render streamed AI output as formatted HTML |

---

## 🚀 Quick Start

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

## 📁 Project Structure

```
├── app/
│   ├── api/chat/
│   │   └── route.ts        # POST handler: file parsing → Groq streaming
│   ├── globals.css          # Tailwind CSS entry point
│   ├── layout.tsx           # Root layout (Inter font, dark theme)
│   └── page.tsx             # Main UI: inputs, upload zone, results
├── lib/
│   └── locale.ts            # EN/PL translation dictionary
├── .env.local               # API keys (git-ignored)
├── next.config.ts           # Next.js config (pdf-parse external pkg)
├── postcss.config.mjs       # PostCSS + Tailwind
└── tsconfig.json            # TypeScript config
```

---

## ⚡ Why Streaming Matters

Without streaming, a complex AI analysis can take 10-30 seconds — easily exceeding Vercel's serverless function timeout (10s on Hobby). **Streaming solves this:**

- The connection opens immediately → no timeout
- Tokens render on screen as they're generated → perceived latency drops to ~200ms
- The user sees the analysis being "written" in real-time → better UX

---

## 🛠 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shurinbergo3/HR_AI&env=GROQ_API_KEY)

1. Click the button above or import the repo manually on [vercel.com](https://vercel.com)
2. Add the `GROQ_API_KEY` environment variable in the Vercel dashboard
3. Deploy — that's it

---

## 📜 License

MIT
