import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Zap,
  Target,
  Users,
  MessageSquare,
  Globe,
  ShieldCheck,
  FileText,
  BarChart3,
  Sparkles,
  Rocket,
} from "lucide-react";

export type LandingLocale = "en" | "pl";

export type LandingContent = {
  meta: {
    title: string;
    description: string;
    ogLocale: string;
    ogAlternateLocale: string;
  };
  nav: {
    features: string;
    howItWorks: string;
    useCases: string;
    faq: string;
    openApp: string;
    homeAria: string;
    primaryAria: string;
  };
  hero: {
    badge: string;
    h1Line1: string;
    h1Line2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustChips: string[];
    mockCandidates: { name: string; score: string; verdict: string; color: "emerald" | "amber" | "red" }[];
    mockBrowserBar: string;
    mockCandidateLabel: string;
  };
  stats: { value: string; label: string }[];
  features: {
    label: string;
    h2: string;
    subtitle: string;
    items: { icon: LucideIcon; title: string; body: string }[];
  };
  how: {
    label: string;
    h2: string;
    subtitle: string;
    steps: { n: string; title: string; body: string; icon: LucideIcon }[];
  };
  scoring: {
    label: string;
    h2Line1: string;
    h2Line2: string;
    p1: string;
    p2: string;
    cardTitle: string;
    rows: { level: string; def: string; impact: string; color: "red" | "amber" | "emerald" }[];
    thresholdsTitle: string;
    thresholds: { range: string; label: string; color: "emerald" | "amber" | "red" }[];
  };
  useCases: {
    label: string;
    h2: string;
    items: { icon: LucideIcon; title: string; body: string }[];
  };
  privacy: {
    h2: string;
    body: string;
    chips: string[];
  };
  faq: {
    label: string;
    h2: string;
    items: { q: string; a: string }[];
  };
  finalCta: {
    h2Line1: string;
    h2Line2: string;
    body: string;
    cta: string;
    secondaryCta: string;
    starsLabel: string;
    socialProof: string;
  };
  footer: {
    tagline: string;
    appLink: string;
    featuresLink: string;
    faqLink: string;
    copyright: (year: number) => string;
  };
  langSwitch: {
    label: string;
    href: string;
    code: string;
  };
};

/* =========================================================================
 * ENGLISH
 * ========================================================================= */
export const landingEN: LandingContent = {
  meta: {
    title: "HR AI Assistant — AI Resume Screening & Candidate Analysis in Seconds",
    description:
      "Upload resumes, paste a job description, and get a senior-level hiring analysis in seconds. AI-powered candidate screening with match scores, recommendations, and interview questions. Free, bilingual (EN/PL), GDPR/RODO compliant.",
    ogLocale: "en_US",
    ogAlternateLocale: "pl_PL",
  },
  nav: {
    features: "Features",
    howItWorks: "How it works",
    useCases: "Use cases",
    faq: "FAQ",
    openApp: "Open app",
    homeAria: "HR AI Assistant home",
    primaryAria: "Primary",
  },
  hero: {
    badge: "Powered by LLaMA 3.3 70B on Groq · Free to use",
    h1Line1: "AI resume screening",
    h1Line2: "that thinks like a senior recruiter",
    subtitle:
      "Upload resumes, paste a job description, and get a structured candidate analysis in seconds — match score, hire / interview / reject verdict, red flags, and tailored interview questions, streamed live.",
    ctaPrimary: "Try it free",
    ctaSecondary: "See how it works",
    trustChips: ["No signup", "GDPR / RODO compliant", "No data stored", "EN + PL"],
    mockBrowserBar: "hr-ai-assistant.app",
    mockCandidateLabel: "Candidate",
    mockCandidates: [
      { name: "Anna K.", score: "92%", verdict: "Hire", color: "emerald" },
      { name: "Michał P.", score: "74%", verdict: "Interview", color: "amber" },
      { name: "Tomasz W.", score: "58%", verdict: "Pass", color: "red" },
    ],
  },
  stats: [
    { value: "< 200 ms", label: "First token latency" },
    { value: "~500 tok/s", label: "Groq inference speed" },
    { value: "20+", label: "Resumes per batch" },
    { value: "2 langs", label: "EN + PL native" },
  ],
  features: {
    label: "Features",
    h2: "Everything a senior recruiter does, in seconds",
    subtitle:
      "Match scoring, deep analysis, follow-up chat, multi-candidate batches, and rigorous GDPR compliance — built into a single, fast, glass-clean interface.",
    items: [
      {
        icon: Brain,
        title: "Senior-level analysis, every time",
        body:
          "The AI is prompted to act as a senior HR consultant with 15+ years of experience. It reasons about intent behind requirements — not just keyword matches — so coachable gaps don't disqualify strong candidates.",
      },
      {
        icon: Zap,
        title: "Real-time streaming with Groq",
        body:
          "Powered by LLaMA 3.3 70B on Groq inference (~500 tok/s). First token in under 200 ms, full analysis in seconds — not the 30-second wait you'd expect from a deep review.",
      },
      {
        icon: Target,
        title: "Threshold-enforced recommendations",
        body:
          "Every candidate gets a precise match percentage and a binding decision: Hire (≥80%), Invite to Interview (65–79%), or Do Not Hire (<65%). No ambiguous fence-sitting.",
      },
      {
        icon: Users,
        title: "Multi-candidate batch screening",
        body:
          "Drop in 5, 10, or 20 resumes. Each is parsed in parallel, scored against the same job description, and surfaced with sortable summary cards — pick your shortlist in minutes.",
      },
      {
        icon: MessageSquare,
        title: "Per-candidate follow-up chat",
        body:
          "After analysis, every candidate gets a dedicated chat. Ask why a score was given, request tailored interview questions, or probe a specific gap — the AI remembers full resume context.",
      },
      {
        icon: Globe,
        title: "Bilingual interface, any-language CVs",
        body:
          "Full English / Polish UI toggle. The AI replies in your selected language by default but adapts on the fly if you write in another — perfect for cross-border hiring.",
      },
      {
        icon: ShieldCheck,
        title: "GDPR & RODO compliant by design",
        body:
          "Resumes are parsed in memory, sent to the LLM, and discarded. Nothing is stored, logged, or used for training. Explicit consent flow and full Polish / English privacy policy.",
      },
      {
        icon: FileText,
        title: "PDF & DOCX, parsed server-side",
        body:
          "Drag-and-drop PDF or DOCX. Files are extracted to plain text on the server before reaching the model — your candidate's raw file never touches a third party.",
      },
      {
        icon: BarChart3,
        title: "Structured, actionable reports",
        body:
          "Match score, strengths, red flags, trainability prognosis, cultural fit, 3-month expectations, and a 2–3 sentence final verdict with the next concrete action. Skim or deep-dive.",
      },
    ],
  },
  how: {
    label: "How it works",
    h2: "Four steps. Under a minute.",
    subtitle:
      "No setup, no integrations, no learning curve. The whole tool is a single page — the only thing between you and a shortlist is the upload button.",
    steps: [
      { n: "01", title: "Paste the job description", body: "Drop in the role spec — anything from a one-paragraph brief to a full requisition.", icon: FileText },
      { n: "02", title: "Upload resumes", body: "PDF or DOCX, single or batch. Add optional notes per candidate (referrals, interview feedback, anything relevant).", icon: Users },
      { n: "03", title: "Read streaming analysis", body: "Match percentages, hiring recommendations, strengths, red flags, and tailored interview questions appear in real-time.", icon: Sparkles },
      { n: "04", title: "Chat with each candidate's report", body: "Drill into any analysis with a per-candidate chat panel. The AI keeps full resume context and answers follow-ups instantly.", icon: MessageSquare },
    ],
  },
  scoring: {
    label: "Scoring philosophy",
    h2Line1: "Optimistic-by-design.",
    h2Line2: "No keyword theatre.",
    p1:
      "Most ATS tools penalize candidates for missing exact keywords — a senior data scientist who \"doesn't have scikit-learn\" because their CV says \"production LLM pipelines\" gets dropped. We built the opposite.",
    p2:
      "The model is instructed to treat false negatives — overlooking a promising candidate — as more costly than false positives. It reasons about intent behind requirements, classifies skill gaps as critical / coachable / optional, and rewards strong learning trajectory.",
    cardTitle: "Tiered gap assessment",
    rows: [
      { level: "Critical", def: "Core hard skill with no adjacent proof of competence", impact: "−20 to −30%", color: "red" },
      { level: "Coachable", def: "Missing a specific tool, but strong in the domain", impact: "−5 to −10%", color: "amber" },
      { level: "Optional", def: "Nice-to-have requirement not met", impact: "−2 to −5%", color: "emerald" },
    ],
    thresholdsTitle: "Hiring thresholds",
    thresholds: [
      { range: "≥ 80%", label: "Hire", color: "emerald" },
      { range: "65–79%", label: "Interview", color: "amber" },
      { range: "< 65%", label: "Pass", color: "red" },
    ],
  },
  useCases: {
    label: "Built for",
    h2: "Anyone who reads resumes for a living",
    items: [
      { icon: Users, title: "In-house recruiters", body: "Screen 50 inbound resumes for a single role in the time it used to take to read three. Surface your shortlist, then go deep with the per-candidate chat." },
      { icon: Target, title: "Hiring managers", body: "Get a senior HR opinion on a candidate before your first call. Pull tailored technical questions for exact skill gaps, ready to use in the interview." },
      { icon: Rocket, title: "Recruitment agencies", body: "Triage candidate pipelines across multiple client roles in parallel. Ship structured shortlists to clients with reasoning they can audit." },
      { icon: Sparkles, title: "Startup founders", body: "Hire without a recruiter. Get a structured opinion on every applicant, in plain language, without paying $300/seat for an enterprise ATS." },
    ],
  },
  privacy: {
    h2: "Resumes parsed in memory. Nothing stored.",
    body:
      "CV files are converted to text on our server, sent to the LLM for analysis, and immediately discarded. No database writes, no logs of resume content, no training on your data. GDPR & RODO compliant by design — with a published privacy policy and explicit consent flow in both English and Polish.",
    chips: ["GDPR ready", "RODO ready", "No data retention", "Server-side parsing", "Rate-limited", "Strict CSP headers"],
  },
  faq: {
    label: "FAQ",
    h2: "Frequently asked questions",
    items: [
      { q: "How does the AI resume screening work?", a: "Paste a job description and upload one or more resumes (PDF or DOCX). The tool parses each file server-side, sends the text plus the job spec to a large language model, and streams back a structured analysis: match percentage, hiring recommendation, strengths, red flags, prognosis, and interview questions. Results begin appearing in under a second." },
      { q: "Is HR AI Assistant free to use?", a: "Yes. The core analysis tool is free to use. There is a sliding-window rate limit (10 requests per minute per IP) to protect against abuse, but no signup, paywall, or trial restriction." },
      { q: "Is it GDPR / RODO compliant?", a: "Yes. Resume content is processed server-side only for the duration of the analysis and is not stored, logged, or used to train models. The interface is fully translated to Polish (RODO) and English (GDPR), with explicit consent and a published privacy policy." },
      { q: "What file formats are supported?", a: "PDF and DOCX. Files are parsed server-side using pdf-parse and mammoth before any AI processing — the LLM only ever sees plain text, never the raw file." },
      { q: "Can I analyze multiple candidates at once?", a: "Yes. Batch upload as many resumes as you need; each candidate is assigned a numbered slot and analyzed in parallel against the same job description. After analysis, each candidate gets a private chat panel for follow-up questions with full context." },
      { q: "What languages are supported?", a: "The interface is bilingual — English and Polish — and the AI adapts to whichever language you write in, including resume content in any language. Switch the UI language with one click." },
      { q: "Will this replace our ATS?", a: "It complements your ATS rather than replacing it. Use HR AI Assistant for the screening and shortlisting layer — the part where most teams spend the most time — and keep your ATS for pipeline, scheduling, and offers." },
      { q: "How accurate is the match score?", a: "The model is tuned with an optimistic-by-design philosophy: it treats false negatives (overlooking a promising candidate) as more costly than false positives. Skill gaps are tiered — critical, coachable, optional — with proportional score impact, so a strong learning trajectory isn't penalized for missing a specific tool." },
    ],
  },
  finalCta: {
    h2Line1: "Stop reading resumes.",
    h2Line2: "Start interviewing.",
    body:
      "The whole tool is one page. No signup, no credit card, no setup. Open it, upload, and you'll have a shortlist before your coffee cools.",
    cta: "Open HR AI Assistant",
    secondaryCta: "Or explore features again",
    starsLabel: "Rated 4.9 out of 5",
    socialProof: "Loved by 100+ early users",
  },
  footer: {
    tagline:
      "AI-powered resume screening that thinks like a senior recruiter. Free, bilingual, GDPR/RODO compliant.",
    appLink: "App",
    featuresLink: "Features",
    faqLink: "FAQ",
    copyright: (y) => `© ${y} HR AI Assistant · Built with Next.js & Groq`,
  },
  langSwitch: {
    label: "Polski",
    href: "/pl",
    code: "PL",
  },
};

/* =========================================================================
 * POLISH
 * ========================================================================= */
export const landingPL: LandingContent = {
  meta: {
    title:
      "HR AI Assistant — Skanowanie CV i analiza kandydatów w sekundach (AI)",
    description:
      "Automatyczna analiza CV oparta na AI dla rekruterów i zespołów HR. Wgraj CV, wklej opis stanowiska i otrzymaj analizę kandydata na poziomie seniora — z dopasowaniem procentowym, rekomendacją zatrudnienia i pytaniami rekrutacyjnymi w czasie rzeczywistym. Bezpłatne, dwujęzyczne (EN/PL), zgodne z RODO/GDPR.",
    ogLocale: "pl_PL",
    ogAlternateLocale: "en_US",
  },
  nav: {
    features: "Funkcje",
    howItWorks: "Jak to działa",
    useCases: "Zastosowania",
    faq: "FAQ",
    openApp: "Otwórz aplikację",
    homeAria: "Strona główna HR AI Assistant",
    primaryAria: "Główna nawigacja",
  },
  hero: {
    badge: "Napędzane LLaMA 3.3 70B na Groq · Bezpłatnie",
    h1Line1: "Skanowanie CV przez AI",
    h1Line2: "które myśli jak doświadczony rekruter",
    subtitle:
      "Wgraj CV, wklej opis stanowiska i w kilka sekund otrzymaj uporządkowaną analizę kandydata — dopasowanie procentowe, werdykt zatrudnij / rozmowa / odrzuć, czerwone flagi i dopasowane pytania rekrutacyjne, na żywo.",
    ctaPrimary: "Wypróbuj za darmo",
    ctaSecondary: "Zobacz, jak to działa",
    trustChips: ["Bez rejestracji", "Zgodność z RODO / GDPR", "Brak przechowywania danych", "EN + PL"],
    mockBrowserBar: "hr-ai-assistant.app",
    mockCandidateLabel: "Kandydat",
    mockCandidates: [
      { name: "Anna K.", score: "92%", verdict: "Zatrudnij", color: "emerald" },
      { name: "Michał P.", score: "74%", verdict: "Rozmowa", color: "amber" },
      { name: "Tomasz W.", score: "58%", verdict: "Odrzuć", color: "red" },
    ],
  },
  stats: [
    { value: "< 200 ms", label: "Czas pierwszego tokenu" },
    { value: "~500 tok/s", label: "Prędkość Groq" },
    { value: "20+", label: "CV w jednej partii" },
    { value: "2 języki", label: "EN + PL natywnie" },
  ],
  features: {
    label: "Funkcje",
    h2: "Wszystko, co robi senior rekruter — w sekundach",
    subtitle:
      "Ocena dopasowania, dogłębna analiza, czat uzupełniający, analiza wielu kandydatów na raz oraz pełna zgodność z RODO — w jednym, szybkim, eleganckim interfejsie.",
    items: [
      {
        icon: Brain,
        title: "Analiza na poziomie seniora",
        body:
          "AI działa jak senior konsultant HR z ponad 15-letnim doświadczeniem. Rozumie intencję wymagań — nie szuka tylko słów kluczowych — więc luki, których można się szybko douczyć, nie skreślają mocnych kandydatów.",
      },
      {
        icon: Zap,
        title: "Streaming w czasie rzeczywistym (Groq)",
        body:
          "Napędzane LLaMA 3.3 70B na Groq (~500 tok/s). Pierwszy token w mniej niż 200 ms, pełna analiza w sekundy — zamiast 30-sekundowego oczekiwania, jakie znasz z innych narzędzi.",
      },
      {
        icon: Target,
        title: "Rekomendacje z jasnymi progami",
        body:
          "Każdy kandydat dostaje konkretny procent dopasowania i wiążącą decyzję: Zatrudnij (≥80%), Zaproś na rozmowę (65–79%) lub Nie zatrudniaj (<65%). Bez owijania w bawełnę.",
      },
      {
        icon: Users,
        title: "Analiza wielu kandydatów na raz",
        body:
          "Wgraj 5, 10 lub 20 CV. Każde jest parsowane równolegle, oceniane wobec tego samego opisu stanowiska i pokazane na sortowanej karcie podsumowania — krótka lista w kilka minut.",
      },
      {
        icon: MessageSquare,
        title: "Czat uzupełniający dla każdego kandydata",
        body:
          "Po analizie dla każdego kandydata otwiera się prywatny czat. Zapytaj, dlaczego jest taka ocena, poproś o pytania pod konkretną lukę kompetencyjną — AI pamięta cały kontekst CV.",
      },
      {
        icon: Globe,
        title: "Interfejs PL/EN, CV w dowolnym języku",
        body:
          "Pełny przełącznik języka EN / PL. AI odpowiada w wybranym języku, ale przełącza się automatycznie, jeśli napiszesz w innym — idealne do rekrutacji międzynarodowych.",
      },
      {
        icon: ShieldCheck,
        title: "Zgodność z RODO i GDPR od podstaw",
        body:
          "CV są parsowane w pamięci, wysyłane do LLM i natychmiast usuwane. Nic nie jest zapisywane, logowane ani używane do trenowania modeli. Wyraźna zgoda i pełna polityka prywatności po polsku i angielsku.",
      },
      {
        icon: FileText,
        title: "PDF i DOCX, parsowanie po stronie serwera",
        body:
          "Przeciągnij PDF lub DOCX. Pliki są zamieniane na tekst na serwerze, zanim trafią do modelu — surowy plik kandydata nigdy nie trafia do firm trzecich.",
      },
      {
        icon: BarChart3,
        title: "Uporządkowane, konkretne raporty",
        body:
          "Procent dopasowania, mocne strony, czerwone flagi, prognoza wyszkolenia, dopasowanie kulturowe, oczekiwania na 3 miesiące oraz 2–3 zdaniowy werdykt z konkretnym następnym krokiem. Przejrzyj lub zagłęb się.",
      },
    ],
  },
  how: {
    label: "Jak to działa",
    h2: "Cztery kroki. Mniej niż minuta.",
    subtitle:
      "Brak konfiguracji, brak integracji, brak nauki. Całe narzędzie to jedna strona — między tobą a krótką listą jest tylko przycisk wgrania pliku.",
    steps: [
      { n: "01", title: "Wklej opis stanowiska", body: "Wrzuć specyfikację roli — od jednego akapitu po pełen opis wymagań.", icon: FileText },
      { n: "02", title: "Wgraj CV", body: "PDF lub DOCX, pojedynczo lub partią. Dodaj opcjonalne notatki dla każdego kandydata (referencje, feedback z rozmowy itd.).", icon: Users },
      { n: "03", title: "Czytaj analizę na żywo", body: "Procenty dopasowania, rekomendacje, mocne strony, czerwone flagi i pytania rekrutacyjne pojawiają się w czasie rzeczywistym.", icon: Sparkles },
      { n: "04", title: "Pogłęb rozmowę o każdym CV", body: "Otwórz czat dla dowolnego kandydata i dopytaj o szczegóły — AI pamięta cały kontekst raportu.", icon: MessageSquare },
    ],
  },
  scoring: {
    label: "Filozofia oceny",
    h2Line1: "Optymistyczna z założenia.",
    h2Line2: "Bez teatru słów kluczowych.",
    p1:
      `Większość ATS karze kandydatów za brak konkretnych słów kluczowych — senior data scientist, który „nie ma scikit-learn", bo w CV ma „produkcyjne pipeline'y LLM", wypada z procesu. My zbudowaliśmy coś odwrotnego.`,
    p2:
      "Model jest instruowany, by traktować pominięcie obiecującego kandydata jako kosztowniejsze niż zaproszenie kogoś, kto nie pasuje. Rozumie intencję wymagań, klasyfikuje luki kompetencyjne jako krytyczne / do douczenia / opcjonalne i nagradza dynamikę uczenia się.",
    cardTitle: "Trzy poziomy luk",
    rows: [
      { level: "Krytyczna", def: "Kluczowa kompetencja bez żadnego dowodu kompetencji pokrewnej", impact: "−20 do −30%", color: "red" },
      { level: "Do douczenia", def: "Brak konkretnego narzędzia, ale silna kompetencja w domenie", impact: "−5 do −10%", color: "amber" },
      { level: "Opcjonalna", def: `Wymaganie typu „mile widziane", którego brakuje`, impact: "−2 do −5%", color: "emerald" },
    ],
    thresholdsTitle: "Progi decyzji rekrutacyjnej",
    thresholds: [
      { range: "≥ 80%", label: "Zatrudnij", color: "emerald" },
      { range: "65–79%", label: "Rozmowa", color: "amber" },
      { range: "< 65%", label: "Odrzuć", color: "red" },
    ],
  },
  useCases: {
    label: "Dla kogo",
    h2: "Dla każdego, kto żyje z czytania CV",
    items: [
      { icon: Users, title: "Rekruterzy in-house", body: "Przejrzyj 50 CV na jedno stanowisko w czasie, w którym wcześniej czytałeś trzy. Wybierz krótką listę, a potem pogłęb rozmowę przez czat dla każdego kandydata." },
      { icon: Target, title: "Hiring managerowie", body: "Otrzymaj opinię senior HR o kandydacie zanim zadzwonisz. Wyciągnij dopasowane pytania techniczne pod konkretne luki — gotowe do użycia w rozmowie." },
      { icon: Rocket, title: "Agencje rekrutacyjne", body: "Triażuj pipeline'y kandydatów dla wielu klientów równolegle. Dostarczaj klientom uporządkowane krótkie listy z uzasadnieniem, które można zweryfikować." },
      { icon: Sparkles, title: "Założyciele startupów", body: "Rekrutuj bez agencji. Otrzymaj uporządkowaną opinię o każdym aplikującym, prostym językiem, bez płacenia 300 $/użytkownika za korporacyjny ATS." },
    ],
  },
  privacy: {
    h2: "CV parsowane w pamięci. Nic nie jest przechowywane.",
    body:
      "Pliki CV są zamieniane na tekst na naszym serwerze, wysyłane do LLM do analizy i natychmiast odrzucane. Brak zapisu w bazie, brak logów treści CV, brak trenowania modeli na twoich danych. Zgodność z RODO i GDPR od podstaw — z opublikowaną polityką prywatności i wyraźną zgodą po polsku i angielsku.",
    chips: ["Gotowe pod RODO", "Gotowe pod GDPR", "Brak retencji danych", "Parsowanie po stronie serwera", "Limity zapytań", "Surowe nagłówki CSP"],
  },
  faq: {
    label: "FAQ",
    h2: "Najczęściej zadawane pytania",
    items: [
      { q: "Jak działa skanowanie CV przez AI?", a: "Wklej opis stanowiska i wgraj jedno lub więcej CV (PDF lub DOCX). Narzędzie parsuje każdy plik po stronie serwera, wysyła tekst wraz z opisem stanowiska do dużego modelu językowego i streamuje uporządkowaną analizę: dopasowanie procentowe, rekomendację zatrudnienia, mocne strony, czerwone flagi, prognozę i pytania rekrutacyjne. Wyniki zaczynają się pojawiać w mniej niż sekundę." },
      { q: "Czy HR AI Assistant jest darmowy?", a: "Tak. Główne narzędzie analizy jest bezpłatne. Obowiązuje limit zapytań (10 na minutę z jednego IP), żeby chronić przed nadużyciami, ale nie ma rejestracji, paywalla ani okresu próbnego." },
      { q: "Czy narzędzie jest zgodne z RODO / GDPR?", a: "Tak. Treść CV jest przetwarzana po stronie serwera tylko na czas analizy i nie jest przechowywana, logowana ani używana do trenowania modeli. Interfejs jest w pełni przetłumaczony na polski (RODO) i angielski (GDPR), z wyraźną zgodą i opublikowaną polityką prywatności." },
      { q: "Jakie formaty plików są obsługiwane?", a: "PDF i DOCX. Pliki są parsowane po stronie serwera za pomocą pdf-parse i mammoth, zanim trafią do AI — model widzi tylko zwykły tekst, nigdy surowego pliku." },
      { q: "Czy mogę analizować wielu kandydatów na raz?", a: "Tak. Wgraj partią dowolną liczbę CV — każdy kandydat dostaje numerowane miejsce i jest analizowany równolegle wobec tego samego opisu stanowiska. Po analizie każdy kandydat ma prywatny panel czatu z pełnym kontekstem." },
      { q: "Jakie języki są obsługiwane?", a: "Interfejs jest dwujęzyczny — angielski i polski — a AI dostosowuje się do języka, w którym piszesz, w tym do treści CV w dowolnym języku. Zmiana języka interfejsu jednym kliknięciem." },
      { q: "Czy to zastąpi mój ATS?", a: "Uzupełnia ATS, a nie zastępuje. Używaj HR AI Assistant do warstwy skanowania i tworzenia krótkiej listy — to tu zespoły spędzają najwięcej czasu — a ATS zostaw do pipeline'u, scheduling'u i ofert." },
      { q: "Jak dokładny jest wynik dopasowania?", a: `Model jest zestrojony pod filozofię „optymizm z założenia": pominięcie obiecującego kandydata jest droższe niż zaproszenie kogoś, kto nie pasuje. Luki są dzielone na krytyczne, do douczenia i opcjonalne — z proporcjonalnym wpływem na wynik, więc dynamika uczenia się nie jest karana za brak konkretnego narzędzia.` },
    ],
  },
  finalCta: {
    h2Line1: "Przestań czytać CV.",
    h2Line2: "Zacznij rozmawiać.",
    body:
      "Całe narzędzie to jedna strona. Bez rejestracji, bez karty kredytowej, bez konfiguracji. Otwórz, wgraj — krótką listę będziesz mieć, zanim wystygnie kawa.",
    cta: "Otwórz HR AI Assistant",
    secondaryCta: "Albo wróć do funkcji",
    starsLabel: "Ocena 4,9 na 5",
    socialProof: "Pokochało nas 100+ pierwszych użytkowników",
  },
  footer: {
    tagline:
      "Skanowanie CV przez AI, które myśli jak senior rekruter. Bezpłatne, dwujęzyczne, zgodne z RODO/GDPR.",
    appLink: "Aplikacja",
    featuresLink: "Funkcje",
    faqLink: "FAQ",
    copyright: (y) => `© ${y} HR AI Assistant · Zbudowane z Next.js i Groq`,
  },
  langSwitch: {
    label: "English",
    href: "/",
    code: "EN",
  },
};
