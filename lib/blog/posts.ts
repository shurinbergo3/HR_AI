import type { Locale } from "@/lib/locale";

export interface BlogPost {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  author: string;
  hero: {
    eyebrow: string;
    h1: string;
    intro: string;
  };
  body: string;
  faq: { q: string; a: string }[];
  cta: {
    title: string;
    body: string;
    button: string;
  };
}

const AUTHOR = "HR AI Assistant Team";

const enAiResumeScreening: BlogPost = {
  slug: "ai-resume-screening",
  locale: "en",
  title: "AI Resume Screening in 2026: How It Works (and Why It Saves Hours)",
  description:
    "A practical guide to AI resume screening: what it is, how the scoring works, where it beats keyword filters, and how to roll it out without breaking GDPR.",
  keywords: [
    "ai resume screening",
    "ai cv screening",
    "ai resume screening tool",
    "resume scoring software",
    "ai recruitment 2026",
    "automated resume screening",
  ],
  publishedAt: "2026-04-12",
  updatedAt: "2026-04-28",
  readingMinutes: 8,
  author: AUTHOR,
  hero: {
    eyebrow: "Recruiting · Guide",
    h1: "AI Resume Screening in 2026: How It Works (and Why It Saves Hours)",
    intro:
      "Most recruiters still spend 30 to 45 seconds skimming each CV — and miss strong candidates because of it. Modern AI resume screening tools change the math: they read every line, score against the actual job description, and surface the people worth a real conversation. Here is how the technology works, where it beats keyword filters, and how to introduce it without breaking GDPR or your hiring brand.",
  },
  body: `
## What is AI resume screening?

AI resume screening is the use of large language models (LLMs) to read a CV the way a senior recruiter would: extracting experience, mapping it against a specific job description, and producing a structured verdict — match score, strengths, gaps, and a recommendation.

It is not the same as the keyword-based filters built into older ATS platforms. Those tools count occurrences of "Python" or "B2B sales" and rank CVs accordingly. AI screening reads context. A candidate who writes "led the migration of three internal services to a new runtime" is recognized as a strong backend engineer even if the CV never uses the exact phrase from the job ad.

Three things separate AI screening from keyword search:

- **Semantic understanding.** The model recognizes that "managed a portfolio of 40 enterprise accounts" matches "B2B account management experience," even with no shared keywords.
- **Calibrated scoring.** Instead of a binary pass/fail, you get a percentage match with a written rationale, which makes hiring decisions auditable.
- **Job-specific evaluation.** The same CV is scored differently for two different roles, because the model re-reads the job description each time.

## How the scoring actually works

Under the hood, an AI resume screener typically does four things in sequence:

1. **Parses the document.** PDF and DOCX get converted into clean text. Tables and multi-column layouts that confuse traditional ATS parsers are usually handled correctly.
2. **Extracts structured signals.** Years of experience, titles, technologies, industries, education, and (where relevant) seniority indicators like team size or budget owned.
3. **Compares against the job description.** The model holds the job description and the parsed CV in context simultaneously and reasons about fit — not just keyword overlap.
4. **Outputs a structured verdict.** A match percentage, a short summary, a list of strengths, a list of gaps, and a recommendation (e.g. *Hire*, *Hold for Interview*, *Do Not Hire*).

The match percentage is the part recruiters care about most, but the *rationale* is what makes the score useful. If the model says "82% — strong backend match, weak on the listed observability stack," you know exactly what to ask in the first call.

## Where AI screening beats keyword search

Three concrete scenarios where AI wins by a wide margin:

### 1. Career changers and unconventional CVs

A logistics coordinator applying for a junior data analyst role will fail almost any keyword filter — they have not used the word "SQL" in the last five years. An AI screener can recognize that "tracked weekly KPIs across 12 distribution centers and built reporting dashboards in Excel" is a credible foundation for an analyst role, and will say so in plain language.

### 2. Cross-language hiring

For Polish recruiters hiring from across the EU, CVs come in English, Polish, German, and Ukrainian. Keyword filters in one language miss everything in the others. Modern LLMs handle this transparently — the same job description will score CVs in any language that the model understands.

### 3. Senior or specialist roles

For a Head of Engineering, what matters is leadership scope, organizational complexity, and outcomes — none of which appear as keywords. AI can read a CV and conclude "this person has scaled engineering teams from 10 to 60 across two acquisitions," which is the actual signal you need.

## A realistic recruiter workflow

The fastest workflow we see at [HR AI Assistant](/app) looks like this:

1. **Paste the job description.** Full job ad — responsibilities, must-haves, nice-to-haves.
2. **Upload a batch of resumes.** PDF or DOCX, anywhere from 5 to 100 at a time.
3. **Read the structured output.** Each candidate gets a match percentage, a summary, and a hire / hold / pass recommendation.
4. **Open the chat for the strong candidates.** Ask follow-up questions like *"What are the main hiring risks?"* or *"Suggest three advanced interview questions."* The chat has full context of that specific candidate's CV and the job description.

A typical recruiter screening 60 CVs goes from 4 hours of skimming to 25 minutes of focused review on the top 12.

## What AI screening is *not* good at

Honest answer — three things to be aware of:

- **Cultural fit.** Models can read what a candidate has written, not how they will behave in a conversation. Cultural and team-fit signals still come from interviews.
- **Verifying claims.** If a CV says "led a team of 20," the model will treat that as a fact. Reference checks and structured interviews still matter.
- **Niche domain expertise.** For very specialized fields — patent law, certain regulated medical roles — domain experts will catch nuances the model misses. Use AI as a first pass, not the final word.

## GDPR and RODO compliance

If you are hiring in the EU, the legal piece is non-negotiable. A compliant AI screening setup needs:

- **A lawful basis for processing.** Usually consent for hiring purposes, recorded explicitly.
- **Data minimization.** Don't keep CVs longer than needed. Best-in-class tools process the file in memory and never write it to disk.
- **No cross-purpose use.** A CV uploaded for role A should not be silently retained and used to evaluate role B months later.
- **Transparency.** Candidates should know that AI is part of the screening process. This is not just polite — under the EU AI Act, automated decisions in employment are a high-risk category.

[HR AI Assistant](/app) is designed around these constraints: CVs are processed in the browser session, are not stored on our servers, and the final hire / no-hire decision always rests with a human recruiter.

## What to look for when picking a tool

If you are evaluating AI resume screening vendors, the questions worth asking:

- **Does it produce a written rationale, or just a score?** A score without a rationale is unauditable.
- **Can the same CV be evaluated against different job descriptions?** This is table stakes; a surprising number of products store one fixed embedding per CV.
- **What happens to my data?** Where is it stored, for how long, who can read it.
- **What is the per-candidate cost?** Many tools price per "seat" but bill compute against a hidden token budget. Ask for the unit economics.
- **Does it handle the languages you hire in?** Test with real CVs in your actual languages, not the demo data.

## The honest summary

AI resume screening is not magic, and it is not coming for recruiters' jobs. What it is, in 2026, is a 10x speed-up on the most boring part of the funnel — the first read of every CV — with audit-friendly written rationales that hold up under scrutiny.

If you screen more than 30 CVs a week, the math works. If you screen more than 100, you are leaving real money on the table by not using it.
`,
  faq: [
    {
      q: "Is AI resume screening accurate?",
      a: "For first-pass shortlisting, yes — modern LLM-based screeners agree with senior recruiters about 85–90% of the time on hire/no-hire decisions, and the disagreements are usually edge cases that benefit from a human read anyway. The accuracy gap that matters is between AI screening and old keyword filters, where AI is dramatically better.",
    },
    {
      q: "Will AI bias hiring decisions?",
      a: "Any screening method — human or machine — can encode bias. The advantage of AI is that decisions come with a written rationale, which makes bias auditable. Keep the final decision with a human recruiter, review the model's rationale on a sample of rejections, and you have a more defensible process than gut-feel screening.",
    },
    {
      q: "Is AI resume screening GDPR-compliant?",
      a: "It can be, but compliance is about the tool's data handling, not the AI itself. Look for tools that process CVs in-session without long-term storage, document a lawful basis for processing, and inform candidates that AI is part of the screening pipeline. HR AI Assistant is designed around these constraints.",
    },
    {
      q: "How long does AI take to screen one CV?",
      a: "Typically 8–20 seconds per CV, including document parsing and full job-description matching. A batch of 50 CVs is usually done in under five minutes — versus several hours of manual reading.",
    },
    {
      q: "Can I use AI screening for senior roles?",
      a: "Yes, and arguably it works better for senior roles than for entry-level ones, because senior CVs have more signal to extract — leadership scope, transformation outcomes, P&L responsibility. For very specialized domains, treat AI as a first pass and have a domain expert review the shortlist.",
    },
  ],
  cta: {
    title: "Try AI resume screening on your next role",
    body: "Paste a job description, upload up to 100 CVs, get structured scores and rationales in minutes. No installation, no data retention.",
    button: "Open HR AI Assistant",
  },
};

const enScreenResumesFast: BlogPost = {
  slug: "screen-resumes-fast",
  locale: "en",
  title: "How to Screen 100+ Resumes Fast: A Recruiter's Step-by-Step Playbook",
  description:
    "A field-tested workflow for screening hundreds of resumes without burning out. Includes a ranking framework, time budgets, and the AI tools that make it sustainable.",
  keywords: [
    "how to screen resumes fast",
    "resume screening checklist",
    "screen 100 resumes",
    "fast cv screening",
    "recruiter productivity",
    "shortlist candidates",
  ],
  publishedAt: "2026-04-18",
  updatedAt: "2026-04-30",
  readingMinutes: 7,
  author: AUTHOR,
  hero: {
    eyebrow: "Recruiting · Playbook",
    h1: "How to Screen 100+ Resumes Fast: A Recruiter's Step-by-Step Playbook",
    intro:
      "When a job ad goes live and 200 applications hit your inbox in 48 hours, the temptation is to grep for keywords and move on. That is also how you miss the best three candidates. Here is a workflow that handles volume without sacrificing signal — built around a clear ranking framework and an AI assist for the boring 80%.",
  },
  body: `
## Step 1: Define the must-haves before you read anything

Most screening pain comes from starting to read CVs without a clear definition of what "yes" looks like. Before you open the first application, write down — in three lines or fewer — the *non-negotiables* for the role. Examples:

- 4+ years building production backend services
- Currently authorized to work in Poland
- Comfortable in English (we run all design reviews in English)

Anything not on this list is a "nice-to-have," not a filter. This sounds obvious, but it is the single highest-leverage change you can make to screening speed: you stop re-arguing fit on every CV.

## Step 2: Sort the inbox into three buckets in one pass

For a 100-CV pile, do *not* read each CV carefully on the first pass. Spend 20 to 30 seconds per CV and put it into one of three buckets:

- **A — likely yes.** Hits all must-haves clearly, has at least one signal that they are above average for the role.
- **B — maybe.** Hits the must-haves but is unremarkable, or is interesting but missing one must-have.
- **C — no.** Clearly fails one or more must-haves with no compensating signal.

A 100-CV pile typically splits something like 12 / 35 / 53. Now you only have 12 CVs to read carefully, plus 35 to skim — and you've cut your reading time by half.

## Step 3: Rank the A bucket with a real rubric

For the A bucket, score each candidate against three or four weighted dimensions. A simple worked example for a senior backend role:

| Dimension | Weight | What "high" looks like |
| --- | --- | --- |
| Depth of relevant experience | 40% | 5+ years on production systems comparable to ours |
| Scope and outcomes | 30% | Owned a system end-to-end, shipped measurable improvements |
| Technical signal | 20% | Hands-on with the relevant stack, not just exposure |
| Communication / presentation | 10% | CV is structured and concrete, not vague |

Score each dimension out of 5, multiply by weight, and you get a single number per candidate that you can defend in a hiring committee. It also exposes when two candidates are actually quite different even though both look "good."

## Step 4: Use AI to do the first pass for you

This is where the recruiter playbook diverges from the 2010s version. A modern AI resume screener like [HR AI Assistant](/app) will do steps 2 and 3 in five minutes for a 100-CV pile.

Here is the realistic workflow:

1. Paste the full job description into the tool.
2. Upload all 100 CVs in one batch.
3. Wait three to five minutes. Each candidate comes back with a match percentage, a summary, identified strengths, identified gaps, and a hire / hold / pass recommendation.
4. Use the AI's bucketing as your *first draft* of the A/B/C split. Sort by match percentage, scan the rationales.
5. Manually review the AI's top 15 — those are your A bucket.

The AI is faster than you, but it is not always right. The win is not "AI replaces your judgment." The win is "AI does the first pass, you spend your judgment on the 15 that matter."

## Step 5: Disqualify out loud, not silently

For the C bucket, send a templated rejection within 48 hours. Two reasons:

- It is the right thing to do for the candidate.
- Your reply rate on future job ads is correlated with your candidate-side reputation. Ghosted candidates leave reviews.

A two-line rejection that names the role, thanks the candidate, and says you are moving forward with other applicants is enough. AI can draft 50 of these in a minute if you want to keep the tone consistent.

## Step 6: Make the shortlist call concrete

When you bring the A bucket to the hiring manager, do not say "here are seven good CVs." Say:

> "Here are seven candidates ranked by fit. Top three are 85+% match with strong scope and outcomes. Bottom four are 70–80%, each has one specific gap I want to ask about in the screening call."

Hiring managers respond to specificity. If you bring a number and a rationale, you get a fast decision. If you bring a stack of CVs and a feeling, you get "let me think about it" and the calendar slips a week.

## Time budget for a 100-CV role

Rough numbers for a recruiter using AI assist:

- **Setup (write must-haves, paste JD into tool):** 15 minutes
- **AI screening of 100 CVs:** 5 minutes
- **Manual review of top 20:** 40 minutes
- **Rubric scoring of top 10:** 25 minutes
- **Drafting rejections for the rest:** 10 minutes
- **Hiring-manager handoff:** 15 minutes

Total: about 1 hour 50 minutes for the full pipeline. Compare to the old workflow — manually reading 100 CVs at 90 seconds each is 2 hours 30 minutes *just for the read*, before any scoring or handoff.

## What to avoid

Two anti-patterns we see often:

- **Letting the AI score replace the rationale.** "She matched 91%" is not a hiring case. The rationale behind the 91% is the case.
- **Re-reading CVs you already rejected.** If your A bucket comes up short, do not reach back into B and C looking for hidden gems. Reopen sourcing instead. Re-reading rejected CVs almost always wastes time and rarely changes the outcome.

## The honest take

Screening 100 CVs in under two hours is not about speed-reading. It is about a clear definition of "yes," a rubric you can defend, and an AI assist that does the boring first pass so you can spend your attention on the candidates who deserve it. Build the workflow once, run it for every role.
`,
  faq: [
    {
      q: "How long should it take to screen one resume?",
      a: "On the first pass — 20 to 30 seconds, just to bucket it. On the deep read for the shortlist — three to five minutes per CV, scoring against a rubric. Anything more than that and you are over-investing in candidates you have not yet talked to.",
    },
    {
      q: "What should I look for first on a resume?",
      a: "The non-negotiables for the role: location, work authorization, the one or two skills the job genuinely cannot proceed without. Everything else is a tiebreaker. Most recruiters waste time evaluating nice-to-haves on candidates who fail a must-have.",
    },
    {
      q: "Should I read resumes from top to bottom?",
      a: "No — read the most recent role first. For senior candidates, scope and outcomes from the last two to three years are 80% of the signal. The first job out of university rarely changes a hiring decision.",
    },
    {
      q: "Is keyword search good enough for resume screening?",
      a: "For very junior roles with a narrow stack, keyword search can mostly get you there. For everything else — career changers, senior roles, cross-language hiring — keyword filters miss strong candidates and surface weak ones. AI-based screening reads context, not just word frequency.",
    },
    {
      q: "How do I screen resumes without bias?",
      a: "Two things help most: a written rubric that you score against consistently, and a written rationale for every accept/reject (your own, or the AI's). Bias survives in unexamined gut-feel decisions; it gets caught quickly when every rejection has a sentence behind it.",
    },
  ],
  cta: {
    title: "Cut your screening time in half on the next role",
    body: "Paste a job description, drop in a batch of CVs, get a ranked shortlist with written rationales. Built for recruiters who hire on volume.",
    button: "Try HR AI Assistant",
  },
};

const enGdprResume: BlogPost = {
  slug: "gdpr-cv-processing",
  locale: "en",
  title: "GDPR-Compliant CV Processing: What HR Teams Need to Know in 2026",
  description:
    "What GDPR (and the EU AI Act) actually require when you process candidate CVs — lawful basis, retention, AI screening, and the practical setup that keeps you out of trouble.",
  keywords: [
    "gdpr cv processing",
    "gdpr resume screening",
    "gdpr recruitment",
    "eu ai act recruitment",
    "candidate data retention",
    "ai hiring compliance",
  ],
  publishedAt: "2026-04-22",
  updatedAt: "2026-04-30",
  readingMinutes: 9,
  author: AUTHOR,
  hero: {
    eyebrow: "Compliance · Guide",
    h1: "GDPR-Compliant CV Processing: What HR Teams Need to Know in 2026",
    intro:
      "GDPR is six years old, the EU AI Act is now in force, and most HR teams are still running CV pipelines that would not survive a serious audit. This is a practical guide — not legal advice — to what compliant CV processing actually looks like in 2026, including the AI-screening question that is now the biggest exposure point for recruiters.",
  },
  body: `
## What GDPR actually requires for CV processing

A CV is personal data the moment it lands in your inbox. That triggers six core obligations under GDPR (Articles 5 and 6):

1. **Lawful basis.** You need a legal reason to process the CV — most commonly the candidate's consent, or "legitimate interest" in evaluating them for a role they applied to.
2. **Purpose limitation.** A CV submitted for role A cannot be silently used for role B six months later without a new consent or a clearly disclosed talent-pool basis.
3. **Data minimization.** Collect what you need for the hiring decision. Photos, dates of birth, marital status, and national ID numbers usually fail this test.
4. **Accuracy.** Candidates have the right to correct information you hold about them.
5. **Storage limitation.** A CV cannot live in your inbox forever. Define a retention period and stick to it.
6. **Integrity and confidentiality.** Encryption in transit and at rest, access controls, audit logs.

For HR specifically, the parts that get teams in trouble are *purpose limitation*, *retention*, and increasingly *AI involvement* — covered separately below.

## Lawful basis: consent vs. legitimate interest

There are two practical options for processing inbound CVs:

- **Consent.** The candidate ticks a box that explicitly says "I agree that my CV will be processed for the purpose of evaluating my application for [role]." This is the cleanest path, and the one that aligns with the EU's general direction.
- **Legitimate interest.** Arguably available when a candidate proactively submits a CV for a specific role — they have a clear expectation it will be read. This is more fragile and requires a documented Legitimate Interest Assessment (LIA).

Most modern HR teams use consent, because it is both clearer to candidates and easier to defend. The consent text needs to:

- Name the purpose (evaluating this specific role).
- Name the controller (your company).
- Reference the privacy notice with full detail.
- Be separable from other consents (no bundling with marketing).
- Be revocable as easily as it was given.

## Retention: the most common compliance failure

Most HR teams have a CV retention policy on paper and a practice that ignores it. The realistic baseline:

- **Active hiring process:** as long as the role is open + 30 to 90 days for ongoing evaluation.
- **Rejected candidates, no future-roles consent:** delete within 30 days of decision.
- **Rejected candidates with explicit talent-pool consent:** typically up to 12 months, with renewal.
- **Hired candidates:** the CV becomes part of the employment record under different rules.

If you cannot say with confidence what your retention policy is and that it is automatically enforced, that is the first thing to fix. Manual deletion never happens reliably.

## Data minimization in practice

A compliant European CV process collects: name, contact info, work history, education, skills, links the candidate chose to share. It does *not* require: photo, date of birth, marital status, national ID number, religion, political affiliation. If the CVs you receive include this data, that is largely outside your control — but the test is whether you *use* or *retain* it.

A clean rule of thumb: redact or ignore protected characteristics during screening. AI tools can help here — a good screener evaluates skills and experience, not photos and personal data.

## The EU AI Act and AI-driven screening

This is the big change in 2026. The EU AI Act classifies AI systems used to "evaluate, screen, or filter job applicants" as **high-risk**. That means:

- **Transparency obligations.** Candidates must be told that AI is part of the decision.
- **Human oversight.** A human, not the model, must make the final accept/reject call.
- **Documentation.** You need records of the system, its purpose, and how it is monitored.
- **Bias monitoring.** Demonstrable testing for adverse impact on protected groups.

Practically, this means:

- Add a sentence to your privacy notice and consent flow: "AI may be used to assist in evaluating your application. Final decisions are made by a human recruiter."
- Keep the recruiter — not the model — as the formal decision-maker. Do not auto-reject based on a score.
- Use tools that produce written rationales for their scores, so the human review is meaningful.

## Practical setup checklist

A compliant inbound-CV pipeline for a European HR team:

- **Application form** with explicit consent checkbox, separated from any marketing consent.
- **Privacy notice** linked from the form, naming the AI screening tool if used.
- **Storage** in a system with access controls (not a shared inbox or Google Drive folder).
- **Retention rules** enforced by automation — calendar reminders are not enforcement.
- **Right-to-access process.** When a candidate asks "what do you have on me," you can answer in 30 days.
- **Right-to-deletion process.** Same — 30-day SLA, automated where possible.
- **Vendor due diligence.** For every external tool that touches CVs (ATS, AI screener, video interview tool), a Data Processing Agreement (DPA) and a clear understanding of where the data is processed.

## What to ask an AI resume-screening vendor

If you are buying an AI screening tool, the GDPR-relevant questions:

- **Where is the data processed?** EU, US, somewhere else?
- **Is it stored, and for how long?** The strongest answer is "in-session only, never written to long-term storage."
- **Are CVs used for training?** This must be a clear "no" for any vendor you trust with candidate data.
- **What's in the DPA?** Sub-processor list, data location, breach notification SLA.
- **Does it document its scoring rationale?** Required for meaningful human oversight under the EU AI Act.

[HR AI Assistant](/app) is built around these answers: CVs are processed in the user's session, are not retained on our servers, are not used for training, and every score comes with a written rationale that makes human review substantive.

## Common mistakes worth fixing this week

If you are responsible for an HR pipeline, here are the highest-impact fixes:

- **Move CVs out of shared email inboxes.** No access controls, no audit log, no retention. This is the most common single failure mode.
- **Add the AI sentence to your privacy notice.** It takes a paragraph. It is required as of 2026.
- **Set a calendar to actually delete rejected CVs.** Or automate it. The "we'll get to it" plan does not survive an audit.
- **Document your lawful basis.** One paragraph per processing activity. Auditors ask for this first.

## The honest summary

Compliant CV processing is not particularly hard, but it does require explicit choices: a lawful basis you can name, a retention policy you actually enforce, and AI tooling that supports — not replaces — recruiter judgment. The teams that get this right also tend to have better candidate experience, because the disciplines that satisfy regulators (clarity, speed, professionalism) are the same ones candidates appreciate.

This article is a practical overview, not legal advice. For decisions with real exposure, talk to a lawyer or DPO who knows your jurisdiction.
`,
  faq: [
    {
      q: "Can I use AI to screen resumes under GDPR?",
      a: "Yes, but with conditions: candidates must be informed that AI is involved, a human must make the final hiring decision, and the tool's data handling must be compliant (lawful basis, no unauthorized retention, documented sub-processors). The EU AI Act adds documentation and bias-monitoring obligations on top of GDPR for AI systems used in hiring.",
    },
    {
      q: "How long can I keep a candidate's CV?",
      a: "As long as needed for the specific role, plus a short post-decision window — typically 30 to 90 days. To keep CVs longer for future roles (a 'talent pool'), you need explicit, separate consent and a defined retention period, usually no more than 12 months without renewal.",
    },
    {
      q: "Do I need consent to process a CV the candidate sent me?",
      a: "Most teams use explicit consent (a tick-box on the application form), because it is the cleanest legal basis. 'Legitimate interest' is defensible for unsolicited applications to a specific role, but requires a documented assessment. Whichever you choose, document it in your privacy notice.",
    },
    {
      q: "What happens if a candidate asks me to delete their CV?",
      a: "Under GDPR Article 17, you generally have to delete it within 30 days unless you have a strong legal basis to keep it (active employment, ongoing legal proceedings). Document the request and the deletion. If the CV is in multiple systems — ATS, email, Drive, an AI tool — you need to delete from all of them.",
    },
    {
      q: "Are AI resume screeners GDPR-compliant by default?",
      a: "No vendor is compliant by default — compliance is a property of how you use the tool plus the tool's own data handling. The minimum bar: in-session processing without long-term storage, no training on candidate data, an EU data processing location or proper transfer mechanism, and a Data Processing Agreement. HR AI Assistant is built around these constraints.",
    },
  ],
  cta: {
    title: "Run AI screening without the compliance headaches",
    body: "HR AI Assistant processes CVs in-session, never retains them on our servers, and produces written rationales — the kind of audit trail GDPR and the EU AI Act expect.",
    button: "See how it works",
  },
};

const plAiResumeScreening: BlogPost = {
  slug: "ai-resume-screening",
  locale: "pl",
  title: "AI do analizy CV w 2026: jak działa i ile naprawdę oszczędza czasu",
  description:
    "Praktyczny przewodnik po analizie CV przez AI — jak działa scoring, gdzie wygrywa z filtrami słów kluczowych i jak wdrożyć to zgodnie z RODO.",
  keywords: [
    "ai analiza cv",
    "ai do cv",
    "automatyczna analiza cv",
    "skanowanie cv ai",
    "narzędzie rekrutacyjne ai",
    "ai w rekrutacji 2026",
  ],
  publishedAt: "2026-04-12",
  updatedAt: "2026-04-28",
  readingMinutes: 8,
  author: AUTHOR,
  hero: {
    eyebrow: "Rekrutacja · Poradnik",
    h1: "AI do analizy CV w 2026: jak działa i ile naprawdę oszczędza czasu",
    intro:
      "Większość rekruterów wciąż poświęca 30–45 sekund na pobieżne czytanie każdego CV — i przez to traci najlepszych kandydatów. Współczesna analiza CV oparta na AI zmienia tę matematykę: czyta każdą linię, ocenia ją w kontekście konkretnego ogłoszenia i wyciąga na wierzch osoby warte rozmowy. Oto jak działa ta technologia, gdzie wygrywa z filtrami słów kluczowych i jak ją wdrożyć bez naruszania RODO.",
  },
  body: `
## Czym jest analiza CV przez AI?

Analiza CV przez AI to wykorzystanie dużych modeli językowych (LLM) do czytania CV w sposób, w jaki robi to doświadczony rekruter: wyciąganie doświadczenia, porównywanie go z konkretnym ogłoszeniem o pracę i tworzenie ustrukturyzowanego werdyktu — procentu dopasowania, mocnych stron, luk i rekomendacji.

To nie to samo, co stare filtry słów kluczowych w klasycznych systemach ATS. Tamte narzędzia liczą wystąpienia "Python" czy "sprzedaż B2B" i sortują CV według liczby trafień. AI rozumie kontekst. Kandydat, który napisał "kierował migracją trzech wewnętrznych usług na nową platformę", zostanie rozpoznany jako mocny backendowiec — nawet jeśli w CV nie ma dokładnego sformułowania z ogłoszenia.

Trzy rzeczy odróżniają analizę AI od wyszukiwania słów kluczowych:

- **Rozumienie semantyczne.** Model rozpoznaje, że "zarządzał portfelem 40 klientów korporacyjnych" pasuje do "doświadczenie w obsłudze klientów B2B", nawet bez wspólnych słów.
- **Wykalibrowany scoring.** Zamiast binarnego pass/fail dostajesz procent dopasowania z pisemnym uzasadnieniem — decyzje o zatrudnieniu są audytowalne.
- **Ocena specyficzna dla roli.** To samo CV jest oceniane inaczej dla dwóch różnych stanowisk, bo model za każdym razem czyta na nowo opis pracy.

## Jak naprawdę działa scoring

Pod maską narzędzie do analizy CV przez AI zwykle robi cztery rzeczy po kolei:

1. **Parsuje dokument.** PDF i DOCX są konwertowane na czysty tekst. Tabele i wielokolumnowe układy, które kładą tradycyjne ATS, są zwykle obsługiwane poprawnie.
2. **Wyciąga sygnały strukturalne.** Lata doświadczenia, stanowiska, technologie, branże, edukacja oraz — gdy istotne — wskaźniki seniority, takie jak rozmiar zespołu czy zarządzany budżet.
3. **Porównuje z opisem stanowiska.** Model trzyma jednocześnie w kontekście opis pracy i sparsowane CV i wnioskuje o dopasowaniu — nie tylko o pokrywaniu się słów.
4. **Zwraca ustrukturyzowany werdykt.** Procent dopasowania, krótkie podsumowanie, listę mocnych stron, listę luk i rekomendację (np. *Zatrudnij*, *Wstrzymaj na rozmowę*, *Nie zatrudniaj*).

Procent dopasowania to najczęściej ten element, który najbardziej obchodzi rekruterów, ale to *uzasadnienie* sprawia, że wynik jest użyteczny. Jeśli model mówi "82% — silne dopasowanie backendowe, słabe wskazane narzędzia obserwowalności", wiesz dokładnie, o co spytać na pierwszej rozmowie.

## Gdzie AI wygrywa z wyszukiwaniem słów kluczowych

Trzy konkretne scenariusze, w których AI wygrywa zdecydowanie:

### 1. Osoby zmieniające branżę i nietypowe CV

Koordynator logistyki aplikujący na junior data analyst przejdzie przez praktycznie żaden filtr słów kluczowych — nie używał słowa "SQL" przez ostatnie pięć lat. AI rozpozna, że "śledził tygodniowe KPI w 12 centrach dystrybucji i budował dashboardy w Excelu" to wiarygodna podstawa do roli analityka — i powie to w prostym języku.

### 2. Rekrutacja międzyjęzykowa

Polscy rekruterzy zatrudniający z całej UE dostają CV po angielsku, polsku, niemiecku i ukraińsku. Filtry słów kluczowych w jednym języku przegapiają wszystko w innych. Współczesne LLM-y radzą sobie z tym w sposób przezroczysty — to samo ogłoszenie ocenia CV w każdym języku, który model rozumie.

### 3. Stanowiska seniorskie i specjalistyczne

Dla Head of Engineering liczy się zakres przywództwa, złożoność organizacyjna i wyniki — żadnego z tych elementów nie da się wyrazić jako słowa kluczowego. AI potrafi przeczytać CV i zauważyć "osoba przeskalowała zespół z 10 do 60 inżynierów w trakcie dwóch akwizycji" — czyli prawdziwy sygnał, którego potrzebujesz.

## Realistyczny przepływ pracy rekrutera

Najszybszy workflow, jaki widzimy w [HR AI Assistant](/app), wygląda tak:

1. **Wklej opis stanowiska.** Pełne ogłoszenie — obowiązki, wymagania konieczne, mile widziane.
2. **Wgraj paczkę CV.** PDF lub DOCX, od 5 do 100 dokumentów naraz.
3. **Przeczytaj ustrukturyzowany wynik.** Każdy kandydat dostaje procent dopasowania, podsumowanie i rekomendację zatrudnij / wstrzymaj / odrzuć.
4. **Otwórz czat dla mocnych kandydatów.** Zadawaj pytania w stylu *"Jakie są główne ryzyka zatrudnienia?"* lub *"Zaproponuj trzy zaawansowane pytania rekrutacyjne"*. Czat ma pełny kontekst CV tego kandydata i opisu stanowiska.

Typowy rekruter analizujący 60 CV przechodzi z 4 godzin pobieżnego czytania do 25 minut skupionego przeglądu top 12 kandydatów.

## W czym AI nie jest dobre

Uczciwa odpowiedź — trzy rzeczy, o których warto pamiętać:

- **Dopasowanie kulturowe.** Modele potrafią czytać to, co kandydat napisał, a nie to, jak zachowa się w rozmowie. Sygnały kulturowe i fit zespołowy nadal wynikają z rozmów.
- **Weryfikacja deklaracji.** Jeśli w CV jest "kierował zespołem 20 osób", model przyjmie to jako fakt. Sprawdzanie referencji i ustrukturyzowane rozmowy nadal mają znaczenie.
- **Bardzo wąska wiedza dziedzinowa.** W bardzo specjalistycznych obszarach — prawo patentowe, niektóre regulowane zawody medyczne — eksperci dziedzinowi wyłapią niuanse, które model przeoczy. Traktuj AI jako pierwsze sito, a nie ostateczny werdykt.

## RODO i zgodność z AI Act

Jeśli rekrutujesz w UE, kwestia prawna jest niepodlegająca dyskusji. Zgodne z prawem wdrożenie AI do analizy CV potrzebuje:

- **Podstawy prawnej przetwarzania.** Najczęściej zgody do celów rekrutacji, udokumentowanej wprost.
- **Minimalizacji danych.** Nie trzymaj CV dłużej niż jest to potrzebne. Najlepsze narzędzia przetwarzają plik w pamięci i nigdy nie zapisują go na dysku.
- **Brak użycia w innych celach.** CV wysłane na rolę A nie powinno być po cichu zachowane i wykorzystane do oceny roli B kilka miesięcy później.
- **Przejrzystości.** Kandydaci powinni wiedzieć, że AI jest częścią procesu screeningu. To nie tylko grzeczność — w ramach unijnego AI Act decyzje zautomatyzowane w zatrudnieniu są kategorią wysokiego ryzyka.

[HR AI Assistant](/app) został zaprojektowany pod te ograniczenia: CV są przetwarzane w sesji przeglądarki, nie są przechowywane na naszych serwerach, a ostateczna decyzja o zatrudnieniu zawsze należy do człowieka.

## Na co zwracać uwagę przy wyborze narzędzia

Jeśli oceniasz dostawców AI do analizy CV, warte pytania:

- **Czy zwraca pisemne uzasadnienie, czy tylko wynik?** Wynik bez uzasadnienia jest nieaudytowalny.
- **Czy to samo CV można ocenić względem różnych ogłoszeń?** To podstawa; sporo produktów trzyma jeden stały embedding na CV.
- **Co dzieje się z moimi danymi?** Gdzie są przechowywane, jak długo, kto może je czytać.
- **Jaki jest koszt na kandydata?** Wiele narzędzi rozlicza per "stanowisko", ale nalicza obliczenia z ukrytego budżetu tokenów. Pytaj o jednostkową ekonomię.
- **Czy obsługuje języki, w których rekrutujesz?** Testuj na prawdziwych CV w realnych językach, nie na danych demo.

## Uczciwe podsumowanie

Analiza CV przez AI to nie magia i nie zabierze pracy rekruterom. Czym jest w 2026 — to dziesięciokrotne przyspieszenie najnudniejszej części lejka, czyli pierwszego czytania każdego CV, z audytowalnymi pisemnymi uzasadnieniami, które wytrzymują kontrolę.

Jeśli analizujesz więcej niż 30 CV tygodniowo, matematyka działa. Jeśli więcej niż 100 — tracisz realne pieniądze, nie korzystając z AI.
`,
  faq: [
    {
      q: "Czy analiza CV przez AI jest dokładna?",
      a: "Dla pierwszego sita — tak. Współczesne narzędzia oparte na LLM zgadzają się z doświadczonymi rekruterami w około 85–90% decyzji zatrudnij/odrzuć. Niezgodności to zwykle przypadki graniczne, które i tak warto zweryfikować ręcznie. Istotna różnica jest między AI a starymi filtrami słów kluczowych — tu AI wygrywa zdecydowanie.",
    },
    {
      q: "Czy AI wprowadza uprzedzenia w decyzjach rekrutacyjnych?",
      a: "Każda metoda screeningu — ludzka czy maszynowa — może utrwalać uprzedzenia. Przewaga AI: każda decyzja ma pisemne uzasadnienie, więc uprzedzenia są audytowalne. Trzymaj ostateczną decyzję u rekrutera, przejrzyj uzasadnienia AI na próbce odrzuceń — proces jest bardziej obroniony niż screening na wyczucie.",
    },
    {
      q: "Czy analiza CV przez AI jest zgodna z RODO?",
      a: "Może być, ale zgodność wynika z obsługi danych przez narzędzie, a nie z samego AI. Szukaj rozwiązań, które przetwarzają CV w sesji bez długoterminowego przechowywania, dokumentują podstawę prawną i informują kandydatów o udziale AI w screeningu. HR AI Assistant jest zbudowany pod te ograniczenia.",
    },
    {
      q: "Ile zajmuje AI analiza jednego CV?",
      a: "Zwykle 8–20 sekund na CV, łącznie z parsowaniem dokumentu i pełnym dopasowaniem do ogłoszenia. Paczka 50 CV jest gotowa zwykle w niecałe pięć minut — w porównaniu z kilkoma godzinami ręcznego czytania.",
    },
    {
      q: "Czy AI nadaje się do screeningu na stanowiska seniorskie?",
      a: "Tak, a wręcz działa lepiej niż na rolach juniorskich, bo CV seniorów ma więcej sygnału do wyciągnięcia — zakres przywództwa, wyniki transformacji, odpowiedzialność za P&L. Dla bardzo specjalistycznych dziedzin traktuj AI jako pierwsze sito i poproś eksperta o weryfikację shortlisty.",
    },
  ],
  cta: {
    title: "Wypróbuj analizę CV przez AI na kolejnej rekrutacji",
    body: "Wklej opis stanowiska, wgraj do 100 CV, otrzymaj ustrukturyzowane wyniki i uzasadnienia w kilka minut. Bez instalacji, bez przechowywania danych.",
    button: "Otwórz HR AI Assistant",
  },
};

const plScreenResumesFast: BlogPost = {
  slug: "screen-resumes-fast",
  locale: "pl",
  title: "Jak szybko przejrzeć 100+ CV: praktyczny poradnik dla rekruterów",
  description:
    "Sprawdzony w boju workflow do przeglądania setek CV bez wypalenia. Zawiera framework rankingowy, budżety czasowe i narzędzia AI, które utrzymują tempo.",
  keywords: [
    "jak szybko przeglądać cv",
    "jak czytać cv",
    "screening cv",
    "checklist rekrutera",
    "produktywność rekrutera",
    "shortlista kandydatów",
  ],
  publishedAt: "2026-04-18",
  updatedAt: "2026-04-30",
  readingMinutes: 7,
  author: AUTHOR,
  hero: {
    eyebrow: "Rekrutacja · Playbook",
    h1: "Jak szybko przejrzeć 100+ CV: praktyczny poradnik dla rekruterów",
    intro:
      "Kiedy ogłoszenie wchodzi na żywo i 200 aplikacji wpada w 48 godzin, kusi, żeby grepnąć po słowach kluczowych i lecieć dalej. Tak też przeoczysz najlepszych trzech kandydatów. Oto workflow, który radzi sobie z wolumenem bez utraty sygnału — zbudowany wokół jasnego frameworku rankingowego i AI-asystenta do nudnych 80% pracy.",
  },
  body: `
## Krok 1: Określ wymagania konieczne, zanim cokolwiek przeczytasz

Większość bólu screeningu bierze się z czytania CV bez jasnej definicji "tak". Zanim otworzysz pierwszą aplikację, zapisz — w trzech linijkach lub krócej — *warunki niepodlegające negocjacji*. Przykłady:

- 4+ lata budowania produkcyjnych usług backendowych
- Aktualne uprawnienia do pracy w Polsce
- Komunikatywny angielski (wszystkie design review prowadzimy po angielsku)

Wszystko poza tą listą to "mile widziane", nie filtr. Brzmi banalnie, ale to najwyższa dźwignia w prędkości screeningu: przestajesz toczyć od nowa dyskusję o dopasowaniu przy każdym CV.

## Krok 2: Posortuj inbox na trzy kubełki w jednym przebiegu

Dla stosu 100 CV *nie* czytaj każdego dokumentu uważnie w pierwszym przejściu. Daj sobie 20–30 sekund na CV i wrzucaj do jednego z trzech kubełków:

- **A — prawdopodobnie tak.** Spełnia wszystkie wymagania konieczne, ma co najmniej jeden sygnał, że jest powyżej średniej.
- **B — może.** Spełnia wymagania, ale nie wyróżnia się — albo jest interesujący, ale brakuje jednego must-have.
- **C — nie.** Wyraźnie nie spełnia jednego lub kilku wymagań i nie ma sygnału kompensującego.

Stos 100 CV dzieli się zwykle mniej więcej 12 / 35 / 53. Teraz masz tylko 12 CV do uważnego przeczytania i 35 do przejrzenia — czas czytania spadł o połowę.

## Krok 3: Uszereguj kubełek A z prawdziwym rubrykiem

Dla kubełka A oceń każdego kandydata względem trzech–czterech ważonych wymiarów. Prosty przykład dla seniorskiej roli backendowej:

| Wymiar | Waga | Co znaczy "wysoko" |
| --- | --- | --- |
| Głębokość doświadczenia | 40% | 5+ lat w systemach produkcyjnych porównywalnych z naszym |
| Zakres i wyniki | 30% | Posiadał system end-to-end, dowiózł mierzalne usprawnienia |
| Sygnał techniczny | 20% | Praktyka z relewantnym stackiem, nie sama ekspozycja |
| Komunikacja / prezentacja | 10% | CV jest ustrukturyzowane i konkretne, nie ogólnikowe |

Oceń każdy wymiar w skali 1–5, pomnóż przez wagę i dostaniesz jedną liczbę na kandydata, której obronisz przed komitetem. Pokazuje też, kiedy dwoje kandydatów "wygląda dobrze", ale są w rzeczywistości bardzo różni.

## Krok 4: Niech AI zrobi za ciebie pierwsze sito

W tym punkcie playbook rekrutera odbiega od wersji z lat 2010. Współczesne narzędzie typu [HR AI Assistant](/app) wykona kroki 2 i 3 dla 100 CV w pięć minut.

Realistyczny workflow:

1. Wklej pełny opis stanowiska do narzędzia.
2. Wgraj wszystkie 100 CV jedną paczką.
3. Poczekaj 3–5 minut. Każdy kandydat wraca z procentem dopasowania, podsumowaniem, listą mocnych stron, listą luk i rekomendacją zatrudnij / wstrzymaj / odrzuć.
4. Użyj kubełkowania AI jako *pierwszego szkicu* twojego podziału A/B/C. Posortuj po procencie dopasowania, przejrzyj uzasadnienia.
5. Ręcznie zweryfikuj top 15 z AI — to twój kubełek A.

AI jest szybsze niż ty, ale nie zawsze ma rację. Wygrana to nie "AI zastępuje twoją ocenę". Wygrana to "AI robi pierwsze sito, ty wydajesz osąd na 15, które mają znaczenie".

## Krok 5: Odrzucaj jawnie, nie po cichu

Dla kubełka C wyślij szablonową informację o odmowie w ciągu 48 godzin. Dwa powody:

- To uczciwe wobec kandydata.
- Twoja odpowiedź na przyszłe ogłoszenia koreluje z reputacją po stronie kandydatów. Zignorowani kandydaci zostawiają opinie.

Dwuzdaniowa odmowa, która nazywa stanowisko, dziękuje kandydatowi i mówi, że idziecie dalej z innymi aplikacjami, w pełni wystarcza. AI naszkicuje 50 takich w minutę, jeśli chcesz utrzymać ton.

## Krok 6: Postaw shortlistę konkretnie

Kiedy przynosisz kubełek A do hiring managera, nie mów "tu jest siedem dobrych CV". Powiedz:

> "Oto siedmioro kandydatów uszeregowanych po dopasowaniu. Top 3 to 85%+ dopasowania z mocnym zakresem i wynikami. Dolna czwórka to 70–80%, każde ma jedną konkretną lukę, o którą chcę spytać na rozmowie wstępnej."

Hiring managerowie reagują na konkrety. Jeśli przyniesiesz liczbę i uzasadnienie, dostajesz szybką decyzję. Jeśli przyniesiesz stos CV i przeczucie, dostajesz "daj mi się zastanowić" i kalendarz przesuwa się o tydzień.

## Budżet czasu na rolę z 100 CV

Przybliżone liczby dla rekrutera korzystającego z AI-asysty:

- **Setup (wymagania konieczne, wklejenie JD do narzędzia):** 15 minut
- **AI screening 100 CV:** 5 minut
- **Ręczny przegląd top 20:** 40 minut
- **Ocena rubrykiem top 10:** 25 minut
- **Drafty odmów dla reszty:** 10 minut
- **Handoff do hiring managera:** 15 minut

Łącznie: około 1 godziny 50 minut pełnego pipeline'u. Dla porównania — ręczne czytanie 100 CV po 90 sekund każde to 2 godziny 30 minut *samego czytania*, bez scoringu i przekazania.

## Czego unikać

Dwie antypatologie, które widzimy często:

- **Pozwolenie, by wynik AI zastąpił uzasadnienie.** "Ona miała 91%" to nie jest case rekrutacyjny. Uzasadnienie tych 91% to case.
- **Czytanie ponownie odrzuconych CV.** Jeśli kubełek A wyszedł cienki, nie sięgaj wstecz do B i C w poszukiwaniu ukrytych perełek. Otwórz na nowo sourcing. Powtórne czytanie odrzuconych prawie zawsze marnuje czas i rzadko zmienia wynik.

## Uczciwe podsumowanie

Przegląd 100 CV w niecałe dwie godziny nie jest kwestią szybkiego czytania. To jasna definicja "tak", rubryk, który obronisz, i AI-asysty, która robi nudne pierwsze sito, byś mógł poświęcić uwagę kandydatom, którzy na nią zasługują. Zbuduj workflow raz, uruchamiaj na każdej rekrutacji.
`,
  faq: [
    {
      q: "Ile czasu powinno zająć przejrzenie jednego CV?",
      a: "Pierwszy przebieg — 20 do 30 sekund, tylko żeby zakwalifikować do kubełka. Głęboki przegląd shortlisty — 3 do 5 minut na CV, ze scoringiem względem rubryku. Cokolwiek więcej i przeinwestowujesz w kandydatów, z którymi nawet nie rozmawiałeś.",
    },
    {
      q: "Na co patrzeć w CV w pierwszej kolejności?",
      a: "Na warunki niepodlegające negocjacji: lokalizacja, prawo do pracy, jedna lub dwie umiejętności, bez których rola fizycznie nie wystartuje. Reszta to tiebreaker. Większość rekruterów marnuje czas na ocenianie 'mile widziane' u kandydatów, którzy oblewają wymaganie konieczne.",
    },
    {
      q: "Czy czytać CV od góry do dołu?",
      a: "Nie — czytaj najpierw najnowsze stanowisko. Dla seniorów zakres i wyniki z ostatnich 2–3 lat to 80% sygnału. Pierwsza praca po studiach rzadko zmienia decyzję rekrutacyjną.",
    },
    {
      q: "Czy wyszukiwanie słów kluczowych wystarczy do screeningu CV?",
      a: "Dla bardzo juniorskich ról z wąskim stackiem może się sprawdzić. Dla wszystkiego innego — osób zmieniających branżę, ról seniorskich, rekrutacji wielojęzycznej — filtry słów kluczowych przegapiają mocnych kandydatów i wyciągają słabych. Screening AI czyta kontekst, nie tylko częstotliwość słów.",
    },
    {
      q: "Jak screenować CV bez uprzedzeń?",
      a: "Najbardziej pomagają dwie rzeczy: pisemny rubryk, według którego oceniasz konsekwentnie, oraz pisemne uzasadnienie każdej decyzji accept/reject (twoje lub AI). Uprzedzenia żyją w niezweryfikowanych decyzjach 'na czuja' — wyłapuje się je szybko, gdy każde odrzucenie ma za sobą zdanie uzasadnienia.",
    },
  ],
  cta: {
    title: "Skróć czas screeningu o połowę przy następnej rekrutacji",
    body: "Wklej opis stanowiska, dorzuć paczkę CV, dostań uszeregowaną shortlistę z pisemnymi uzasadnieniami. Stworzone dla rekruterów, którzy zatrudniają na wolumenie.",
    button: "Wypróbuj HR AI Assistant",
  },
};

const plGdprResume: BlogPost = {
  slug: "gdpr-cv-processing",
  locale: "pl",
  title: "RODO a przetwarzanie CV w 2026: praktyczny przewodnik dla działów HR",
  description:
    "Co RODO (i unijny AI Act) naprawdę wymagają przy przetwarzaniu CV — podstawa prawna, retencja, AI screening i praktyczna konfiguracja, która wyciąga z kłopotów.",
  keywords: [
    "rodo cv",
    "rodo rekrutacja",
    "przetwarzanie cv",
    "ai act rekrutacja",
    "retencja cv",
    "zgodność rekrutacji",
  ],
  publishedAt: "2026-04-22",
  updatedAt: "2026-04-30",
  readingMinutes: 9,
  author: AUTHOR,
  hero: {
    eyebrow: "Compliance · Poradnik",
    h1: "RODO a przetwarzanie CV w 2026: praktyczny przewodnik dla działów HR",
    intro:
      "RODO ma osiem lat, unijny AI Act już obowiązuje, a większość działów HR wciąż prowadzi pipeline'y CV, które nie przetrwałyby porządnego audytu. To praktyczny przewodnik — nie porada prawna — po tym, jak naprawdę wygląda zgodne przetwarzanie CV w 2026, łącznie z kwestią AI-screeningu, która jest dziś największym punktem ekspozycji dla rekruterów.",
  },
  body: `
## Co RODO faktycznie wymaga przy przetwarzaniu CV

CV staje się danymi osobowymi w momencie, gdy ląduje w twoim inboxie. To uruchamia sześć podstawowych obowiązków z RODO (art. 5 i 6):

1. **Podstawa prawna.** Potrzebujesz powodu prawnego — najczęściej zgody kandydata albo "uzasadnionego interesu" w ocenie pod konkretne stanowisko.
2. **Ograniczenie celu.** CV złożone na rolę A nie może być po cichu użyte do roli B sześć miesięcy później bez nowej zgody albo jasno zakomunikowanej podstawy "talent pool".
3. **Minimalizacja danych.** Zbieraj to, co potrzebne do decyzji rekrutacyjnej. Zdjęcia, daty urodzenia, stan cywilny i numery PESEL zwykle oblewają ten test.
4. **Prawidłowość.** Kandydaci mają prawo poprawić informacje, które o nich trzymasz.
5. **Ograniczenie przechowywania.** CV nie może żyć w skrzynce w nieskończoność. Zdefiniuj okres retencji i go pilnuj.
6. **Integralność i poufność.** Szyfrowanie w transporcie i spoczynku, kontrole dostępu, logi audytowe.

Dla HR konkretnie najczęstsze wpadki to *ograniczenie celu*, *retencja* i — coraz częściej — *udział AI*, omawiany osobno poniżej.

## Podstawa prawna: zgoda vs uzasadniony interes

Praktycznie są dwie opcje przy przychodzących CV:

- **Zgoda.** Kandydat zaznacza checkbox z wyraźnym tekstem "Zgadzam się, by moje CV było przetwarzane w celu oceny aplikacji na stanowisko [rola]". To najczystsza ścieżka i zgodna z ogólnym kierunkiem UE.
- **Uzasadniony interes.** Argumentowalny, gdy kandydat sam wysyła CV na konkretną rolę — ma jasne oczekiwanie, że zostanie ono przeczytane. Bardziej kruchy i wymaga udokumentowanej Oceny Uzasadnionego Interesu (LIA).

Większość nowoczesnych zespołów HR używa zgody, bo jest jaśniejsza dla kandydatów i łatwiejsza do obrony. Tekst zgody musi:

- Nazwać cel (ocena tej konkretnej roli).
- Nazwać administratora (twoją firmę).
- Linkować do polityki prywatności z pełnymi szczegółami.
- Być oddzielony od innych zgód (bez łączenia z marketingowymi).
- Być odwoływalny tak samo łatwo, jak udzielony.

## Retencja: najczęstsza wpadka compliance

Większość zespołów HR ma politykę retencji CV na papierze i praktykę, która ją ignoruje. Realistyczna baza:

- **Aktywny proces rekrutacyjny:** tak długo, jak rola jest otwarta + 30–90 dni na trwającą ocenę.
- **Odrzuceni kandydaci, brak zgody na przyszłe role:** usunięcie w ciągu 30 dni od decyzji.
- **Odrzuceni kandydaci z wyraźną zgodą na talent pool:** typowo do 12 miesięcy, z odnowieniem.
- **Zatrudnieni kandydaci:** CV staje się częścią dokumentacji pracowniczej pod innymi zasadami.

Jeśli nie potrafisz z pewnością powiedzieć, jaka jest twoja polityka retencji i że jest egzekwowana automatycznie — to pierwsza rzecz do naprawy. Ręczne usuwanie nigdy nie dzieje się niezawodnie.

## Minimalizacja danych w praktyce

Zgodny europejski proces CV zbiera: imię i nazwisko, dane kontaktowe, historię pracy, edukację, umiejętności, linki, które kandydat sam zdecydował się udostępnić. *Nie* wymaga: zdjęcia, daty urodzenia, stanu cywilnego, numeru PESEL, religii, poglądów politycznych. Jeśli CV, które dostajesz, to zawierają — to w dużej mierze poza twoją kontrolą — ale test polega na tym, czy *używasz* lub *przechowujesz* te dane.

Czysta zasada: zaczerniaj lub ignoruj cechy chronione podczas screeningu. Narzędzia AI mogą tu pomóc — dobry screener ocenia umiejętności i doświadczenie, nie zdjęcia i dane osobowe.

## Unijny AI Act i screening AI

To duża zmiana w 2026. Unijny AI Act klasyfikuje systemy AI wykorzystywane do "oceny, screeningu lub filtrowania kandydatów" jako **wysokiego ryzyka**. Co oznacza:

- **Obowiązki transparentności.** Kandydaci muszą być poinformowani, że AI bierze udział w decyzji.
- **Nadzór człowieka.** Człowiek, nie model, musi podejmować ostateczną decyzję accept/reject.
- **Dokumentacja.** Potrzebujesz zapisów systemu, jego celu i tego, jak jest monitorowany.
- **Monitoring uprzedzeń.** Wykazalne testowanie nieproporcjonalnego wpływu na grupy chronione.

Praktycznie oznacza to:

- Dodaj zdanie do polityki prywatności i flow zgody: "AI może być wykorzystywane do wsparcia oceny aplikacji. Ostateczne decyzje podejmuje rekruter."
- Trzymaj rekrutera — nie model — jako formalnego decydenta. Nie odrzucaj automatycznie na podstawie wyniku.
- Używaj narzędzi, które tworzą pisemne uzasadnienia wyników, by przegląd człowieka był substancjalny.

## Praktyczna checklista konfiguracji

Zgodny pipeline przychodzących CV dla europejskiego HR:

- **Formularz aplikacyjny** z wyraźnym checkboxem zgody, oddzielonym od jakiejkolwiek zgody marketingowej.
- **Polityka prywatności** linkowana z formularza, nazywająca narzędzie AI screeningowe, jeśli używane.
- **Przechowywanie** w systemie z kontrolą dostępu (nie współdzielona skrzynka albo folder na Drive).
- **Reguły retencji** egzekwowane automatycznie — przypomnienia w kalendarzu to nie egzekwowanie.
- **Proces prawa dostępu.** Gdy kandydat pyta "co o mnie macie", odpowiadasz w 30 dni.
- **Proces prawa do usunięcia.** To samo — SLA 30 dni, automatyzacja gdzie to możliwe.
- **Due diligence dostawców.** Dla każdego zewnętrznego narzędzia, które dotyka CV (ATS, AI screener, narzędzie do video-rozmów), DPA i jasne zrozumienie, gdzie dane są przetwarzane.

## O co pytać dostawcę AI do CV

Jeśli kupujesz narzędzie AI do screeningu, pytania istotne pod RODO:

- **Gdzie przetwarzane są dane?** UE, USA, gdzie indziej?
- **Czy są przechowywane i jak długo?** Najsilniejsza odpowiedź to "tylko w sesji, nigdy nie zapisywane długoterminowo".
- **Czy CV są wykorzystywane do trenowania?** To musi być jasne "nie" u każdego dostawcy, któremu ufasz dane kandydatów.
- **Co jest w DPA?** Lista subprocesorów, lokalizacja danych, SLA powiadomień o naruszeniach.
- **Czy dokumentuje uzasadnienie scoringu?** Wymagane dla sensownego nadzoru człowieka pod AI Act.

[HR AI Assistant](/app) jest zbudowany pod te odpowiedzi: CV są przetwarzane w sesji użytkownika, nie są przechowywane na naszych serwerach, nie są używane do treningu, a każdy wynik ma pisemne uzasadnienie, które czyni przegląd człowieka substancjalnym.

## Częste błędy do naprawienia w tym tygodniu

Jeśli odpowiadasz za pipeline HR — najwyższa dźwignia napraw:

- **Wyciągnij CV ze współdzielonych skrzynek mailowych.** Brak kontroli dostępu, brak audit logu, brak retencji. To najczęstszy pojedynczy punkt awarii.
- **Dodaj zdanie o AI do polityki prywatności.** To akapit. Wymagane od 2026.
- **Postaw kalendarz na faktyczne usuwanie odrzuconych CV.** Albo to zautomatyzuj. Plan "ogarniemy to" nie przeżyje audytu.
- **Udokumentuj swoją podstawę prawną.** Akapit na czynność przetwarzania. Audytorzy pytają o to pierwsze.

## Uczciwe podsumowanie

Zgodne przetwarzanie CV nie jest szczególnie trudne, ale wymaga jawnych decyzji: podstawa prawna, którą potrafisz nazwać, polityka retencji, którą faktycznie egzekwujesz, i narzędzie AI, które wspiera — a nie zastępuje — osąd rekrutera. Zespoły, które robią to dobrze, mają przy okazji lepszy candidate experience, bo dyscyplina, która zadowala regulatora (jasność, szybkość, profesjonalizm), to ta sama, którą doceniają kandydaci.

Ten artykuł to praktyczny przegląd, nie porada prawna. Dla decyzji z realną ekspozycją porozmawiaj z prawnikiem lub IOD w swojej jurysdykcji.
`,
  faq: [
    {
      q: "Czy mogę używać AI do screeningu CV pod RODO?",
      a: "Tak, pod warunkami: kandydaci muszą być poinformowani o udziale AI, człowiek musi podjąć ostateczną decyzję rekrutacyjną, a przetwarzanie danych przez narzędzie musi być zgodne (podstawa prawna, brak nieautoryzowanej retencji, udokumentowani subprocesorzy). Unijny AI Act dokłada do RODO obowiązki dokumentacyjne i monitoringu uprzedzeń dla systemów AI w rekrutacji.",
    },
    {
      q: "Jak długo można trzymać CV kandydata?",
      a: "Tak długo, jak potrzebne dla konkretnej roli, plus krótkie okno po decyzji — typowo 30 do 90 dni. Aby trzymać CV dłużej dla przyszłych ról ('talent pool'), potrzebujesz wyraźnej, oddzielnej zgody i zdefiniowanego okresu retencji, zwykle nie dłużej niż 12 miesięcy bez odnowienia.",
    },
    {
      q: "Czy potrzebuję zgody na przetwarzanie CV, które kandydat sam wysłał?",
      a: "Większość zespołów używa wyraźnej zgody (checkbox w formularzu aplikacyjnym), bo to najczystsza podstawa prawna. 'Uzasadniony interes' jest obroniony dla niesolicytowanych aplikacji na konkretną rolę, ale wymaga udokumentowanej oceny. Cokolwiek wybierzesz, udokumentuj to w polityce prywatności.",
    },
    {
      q: "Co się dzieje, gdy kandydat poprosi o usunięcie CV?",
      a: "Pod RODO art. 17 zwykle musisz usunąć w ciągu 30 dni, chyba że masz silną podstawę prawną do zachowania (czynne zatrudnienie, postępowanie sądowe). Udokumentuj prośbę i usunięcie. Jeśli CV jest w wielu systemach — ATS, mail, Drive, narzędzie AI — musisz usunąć ze wszystkich.",
    },
    {
      q: "Czy AI screenery są zgodne z RODO out of the box?",
      a: "Żaden dostawca nie jest zgodny domyślnie — zgodność to właściwość sposobu, w jaki używasz narzędzia plus jego obsługi danych. Minimalna poprzeczka: przetwarzanie w sesji bez długoterminowego storage, brak treningu na danych kandydatów, lokalizacja przetwarzania w UE lub właściwy mechanizm transferu i DPA. HR AI Assistant jest zbudowany pod te ograniczenia.",
    },
  ],
  cta: {
    title: "Uruchom AI screening bez bólu compliance",
    body: "HR AI Assistant przetwarza CV w sesji, nie przechowuje ich na naszych serwerach i tworzy pisemne uzasadnienia — taki ślad audytowy, jakiego oczekują RODO i AI Act.",
    button: "Zobacz, jak to działa",
  },
};

export const blogPosts: BlogPost[] = [
  enAiResumeScreening,
  enScreenResumesFast,
  enGdprResume,
  plAiResumeScreening,
  plScreenResumesFast,
  plGdprResume,
];

export function getPostsByLocale(locale: Locale): BlogPost[] {
  return blogPosts
    .filter((p) => p.locale === locale)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPost(slug: string, locale: Locale): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug && p.locale === locale);
}

export function blogIndexCopy(locale: Locale) {
  if (locale === "pl") {
    return {
      eyebrow: "Blog HR AI",
      h1: "Wiedza dla rekruterów: AI, screening CV i compliance",
      intro:
        "Praktyczne poradniki o tym, jak używać AI do szybszej i lepszej rekrutacji — bez przekraczania granic RODO i unijnego AI Act.",
      readMore: "Czytaj dalej",
      minutes: "min czytania",
      backHome: "Strona główna",
      blog: "Blog",
    };
  }
  return {
    eyebrow: "HR AI Blog",
    h1: "Recruiter knowledge: AI, resume screening, and compliance",
    intro:
      "Practical guides on using AI to hire faster and better — without crossing the line on GDPR or the EU AI Act.",
    readMore: "Read more",
    minutes: "min read",
    backHome: "Home",
    blog: "Blog",
  };
}

export function articleCopy(locale: Locale) {
  if (locale === "pl") {
    return {
      backToBlog: "Wszystkie artykuły",
      backHome: "Strona główna",
      blog: "Blog",
      tableOfContents: "Spis treści",
      faqHeading: "Najczęściej zadawane pytania",
      updated: "Zaktualizowano",
      published: "Opublikowano",
      minutes: "min czytania",
      author: "Autor",
      shareCta: "Udostępnij",
      relatedHeading: "Powiązane artykuły",
    };
  }
  return {
    backToBlog: "All articles",
    backHome: "Home",
    blog: "Blog",
    tableOfContents: "Table of contents",
    faqHeading: "Frequently asked questions",
    updated: "Updated",
    published: "Published",
    minutes: "min read",
    author: "Author",
    shareCta: "Share",
    relatedHeading: "Related articles",
  };
}
