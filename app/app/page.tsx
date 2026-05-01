"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type DragEvent,
  type ChangeEvent,
} from "react";
import {
  Upload,
  FileText,
  Loader2,
  Globe,
  Sparkles,
  Trash2,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Users,
  MessageSquare,
  X,
  Send,
  Info,
  Copy,
  Check,
  Shield,
  History,
  Plus,
  Menu,
  Briefcase,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { dict, quickQuestions, type Locale } from "@/lib/locale";
import { LogoFull } from "../components/Logo";
import { CookieConsent } from "../components/CookieConsent";
import { PrivacyPolicy } from "../components/PrivacyPolicy";

const RODO_STORAGE_KEY = "hr-ai-rodo-consent-v1";

interface CandidateFile {
  file: File;
  additionalInfo: string;
}

interface CandidateResult {
  id: string;
  fileName: string;
  candidateNumber: number;
  content: string;
  status: "streaming" | "done" | "error";
  expanded: boolean;
  matchPercent: string | null;
  recommendation: string | null;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface TestSession {
  id: string;
  createdAt: number;
  jobDesc: string;
  results: CandidateResult[];
  chatHistories: Record<string, ChatMessage[]>;
}

const SESSIONS_STORAGE_KEY = "hr-ai-test-sessions-v1";
const MAX_SESSIONS = 25;

function extractSummary(md: string) {
  const matchRe = /(\d{1,3}\s*%)/;
  const matchMatch = md.match(matchRe);

  let recommendation: string | null = null;
  const recPatterns = [
    /\b(Hire)\b/i,
    /\b(Do Not Hire)\b/i,
    /\b(Hold for Interview)\b/i,
    /\b(Zatrudnij)\b/i,
    /\b(Nie zatrudniaj)\b/i,
    /\b(Wstrzymaj.*rozmow[ęy])\b/i,
  ];
  for (const p of recPatterns) {
    const m = md.match(p);
    if (m) { recommendation = m[1]; break; }
  }

  return { matchPercent: matchMatch?.[1] ?? null, recommendation };
}

function recBadgeColor(rec: string | null): string {
  if (!rec) return "bg-gray-200/60 text-gray-600";
  const lower = rec.toLowerCase();
  if (lower.includes("not") || lower.includes("nie") || lower.includes("отказ") || lower.includes("odrzuć"))
    return "bg-red-100/70 text-red-700 border border-red-200/60";
  if (lower.includes("hold") || lower.includes("wstrzymaj") || lower.includes("резерв") || lower.includes("zapas"))
    return "bg-amber-100/70 text-amber-700 border border-amber-200/60";
  return "bg-emerald-100/70 text-emerald-700 border border-emerald-200/60";
}

function recBadgeLabel(rec: string): string {
  const lower = rec.toLowerCase();
  if (lower.includes("not hire") || lower.includes("nie zatrudniaj") || lower.includes("отказ") || lower.includes("odrzuć"))
    return "Do Not Hire";
  if (lower.includes("hold") || lower.includes("wstrzymaj") || lower.includes("резерв") || lower.includes("zapas"))
    return "Invite to Interview";
  if (lower.includes("hire") || lower.includes("zatrudnij"))
    return "Hire";
  return rec;
}

function isValidFile(f: File): boolean {
  const ext = f.name.split(".").pop()?.toLowerCase();
  return ext === "pdf" || ext === "docx";
}

function relativeTime(ts: number, t: Record<string, string>): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return t.justNow;
  if (m < 60) return `${m} ${t.minAgo}`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ${t.hourAgo}`;
  const d = Math.floor(h / 24);
  return `${d} ${t.dayAgo}`;
}

function sessionTitle(s: TestSession, t: Record<string, string>): string {
  const firstLine = s.jobDesc.trim().split(/\n/)[0]?.trim() ?? "";
  if (!firstLine) return t.untitledRole;
  return firstLine.length > 60 ? firstLine.slice(0, 60).trimEnd() + "…" : firstLine;
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [jobDesc, setJobDesc] = useState("");
  const [candidates, setCandidates] = useState<CandidateFile[]>([]);
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [groqLimitUntil, setGroqLimitUntil] = useState<number | null>(null);
  const [groqCountdown, setGroqCountdown] = useState<string | null>(null);
  const [rodoConsent, setRodoConsent] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Chat state
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // History (persisted in sessionStorage — cleared when the user closes the site)
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);

  const t = dict[locale];

  // Restore RODO consent from prior session
  useEffect(() => {
    try {
      if (localStorage.getItem(RODO_STORAGE_KEY) === "1") setRodoConsent(true);
    } catch {}
  }, []);

  // Restore session history from sessionStorage (cleared when the tab closes)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSIONS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TestSession[];
        if (Array.isArray(parsed)) setSessions(parsed);
      }
    } catch {}
    setSessionsLoaded(true);
  }, []);

  // Persist sessions to sessionStorage whenever they change (after initial load)
  useEffect(() => {
    if (!sessionsLoaded) return;
    try {
      sessionStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch {}
  }, [sessions, sessionsLoaded]);

  useEffect(() => {
    try {
      if (rodoConsent) localStorage.setItem(RODO_STORAGE_KEY, "1");
    } catch {}
  }, [rodoConsent]);

  // Live countdown for Groq rate limit
  useEffect(() => {
    if (!groqLimitUntil) { setGroqCountdown(null); return; }
    const tick = () => {
      const remaining = Math.max(0, groqLimitUntil - Date.now());
      if (remaining === 0) { setGroqCountdown(null); setGroqLimitUntil(null); return; }
      const m = Math.floor(remaining / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      setGroqCountdown(m > 0 ? `${m}m ${s}s` : `${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [groqLimitUntil]);

  useEffect(() => {
    if (chatEndRef.current) {
      const container = chatEndRef.current.parentElement;
      if (container) container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [chatHistories, activeChatId]);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const valid = Array.from(incoming).filter(isValidFile);
    setCandidates((prev) => {
      const existingNames = new Set(prev.map((c) => c.file.name));
      const fresh = valid
        .filter((f) => !existingNames.has(f.name))
        .map((f) => ({ file: f, additionalInfo: "" }));
      return [...prev, ...fresh];
    });
    setError("");
  }, []);

  const removeCandidate = (name: string) => {
    setCandidates((prev) => prev.filter((c) => c.file.name !== name));
  };

  const updateAdditionalInfo = (name: string, info: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.file.name === name ? { ...c, additionalInfo: info } : c)),
    );
  };

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    if (fileRef.current) fileRef.current.value = "";
  };

  const updateResult = (id: string, patch: Partial<CandidateResult>) => {
    setResults((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const analyzeOne = async (candidate: CandidateFile, candidateNumber: number, jobDescription: string, language: string) => {
    const id = `${candidate.file.name}-${Date.now()}`;
    setResults((prev) => [...prev, { id, fileName: candidate.file.name, candidateNumber, content: "", status: "streaming", expanded: true, matchPercent: null, recommendation: null }]);

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      formData.append("resume", candidate.file);
      formData.append("language", language);
      if (candidate.additionalInfo.trim()) formData.append("additionalInfo", candidate.additionalInfo.trim());

      const res = await fetch("/api/chat", { method: "POST", body: formData });
      if (!res.ok) throw new Error(t.errorGeneric);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error(t.errorGeneric);

      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        // Detect error marker injected by server mid-stream
        if (buf.startsWith("__ERROR__:")) break;

        const summary = extractSummary(buf);
        updateResult(id, { content: buf, ...summary });
      }
      buf += decoder.decode();

      // Handle encoded server errors
      if (buf.startsWith("__ERROR__:")) {
        const errCode = buf.slice("__ERROR__:".length);
        if (errCode.startsWith("GROQ_TOKEN_DAY_LIMIT:")) {
          const sec = parseFloat(errCode.split(":")[1]) || 1800;
          setGroqLimitUntil(Date.now() + Math.ceil(sec) * 1000);
          throw new Error("Groq daily token limit reached. Please wait for the timer and try again.");
        }
        if (errCode.startsWith("GROQ_TOKEN_MIN_LIMIT:")) {
          const sec = parseFloat(errCode.split(":")[1]) || 60;
          setGroqLimitUntil(Date.now() + Math.ceil(sec) * 1000);
          throw new Error("Groq per-minute token limit reached. Please wait a moment.");
        }
        if (errCode.startsWith("GROQ_RATE_LIMIT:")) {
          const sec = parseFloat(errCode.split(":")[1]) || 60;
          setGroqLimitUntil(Date.now() + Math.ceil(sec) * 1000);
          throw new Error("Rate limit reached. Please wait a moment.");
        }
        throw new Error(errCode || t.errorGeneric);
      }

      const finalSummary = extractSummary(buf);
      updateResult(id, { status: "done", content: buf, ...finalSummary });
    } catch (err: unknown) {
      updateResult(id, { status: "error", content: err instanceof Error ? err.message : t.errorGeneric });
    }
  };

  const analyze = async () => {
    if (!jobDesc.trim()) return setError(t.errorNoJob);
    if (candidates.length === 0) return setError(t.errorNoResume);
    if (!rodoConsent) return setError(t.rodoRequired);
    setError("");
    setGroqLimitUntil(null);
    setResults([]);
    setChatHistories({});
    setActiveChatId(null);
    setLoading(true);
    // Register a new session so it shows up in the sidebar immediately
    const sessionId = `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setActiveSessionId(sessionId);
    setSessions((prev) =>
      [
        {
          id: sessionId,
          createdAt: Date.now(),
          jobDesc,
          results: [],
          chatHistories: {},
        },
        ...prev,
      ].slice(0, MAX_SESSIONS),
    );
    const language = locale === "en" ? "English" : "Polish";
    await Promise.all(candidates.map((c, i) => analyzeOne(c, i + 1, jobDesc, language)));
    setLoading(false);
  };

  // Mirror live results & chat into the active session entry
  useEffect(() => {
    if (!activeSessionId) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, results, chatHistories, jobDesc } : s)),
    );
    // intentionally not depending on `jobDesc` — only mirror when results/chat actually change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, chatHistories, activeSessionId]);

  const startNewAnalysis = () => {
    setActiveSessionId(null);
    setResults([]);
    setChatHistories({});
    setActiveChatId(null);
    setJobDesc("");
    setCandidates([]);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
    setSidebarOpen(false);
  };

  const loadSession = (id: string) => {
    const s = sessions.find((x) => x.id === id);
    if (!s) return;
    setActiveSessionId(s.id);
    setJobDesc(s.jobDesc);
    setResults(s.results);
    setChatHistories(s.chatHistories);
    setActiveChatId(null);
    setError("");
    setSidebarOpen(false);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
      setResults([]);
      setChatHistories({});
    }
  };

  const toggleExpand = (id: string) => {
    setResults((prev) => prev.map((r) => r.id === id ? { ...r, expanded: !r.expanded } : r));
  };

  const allExpanded = results.length > 0 && results.every((r) => r.expanded);
  const toggleAll = () => {
    const next = !allExpanded;
    setResults((prev) => prev.map((r) => ({ ...r, expanded: next })));
  };

  // --- Chat ---
  const sendChatMessage = async (overrideMsg?: string, overrideId?: string) => {
    const targetId = overrideId ?? activeChatId;
    const message = overrideMsg ?? chatInput.trim();
    if (!message || !targetId || chatLoading) return;
    const result = results.find((r) => r.id === targetId);
    if (!result) return;

    setActiveChatId(targetId);
    const userMsg: ChatMessage = { role: "user", content: message };
    if (!overrideMsg) setChatInput("");

    const currentHistory = chatHistories[targetId] ?? [];
    const updatedHistory = [...currentHistory, userMsg];
    setChatHistories((prev) => ({ ...prev, [targetId]: updatedHistory }));
    setChatLoading(true);

    const placeholderMsg: ChatMessage = { role: "assistant", content: "" };
    setChatHistories((prev) => ({ ...prev, [targetId]: [...updatedHistory, placeholderMsg] }));

    try {
      const res = await fetch("/api/chat-hr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory,
          candidateAnalysis: result.content,
          candidateName: result.fileName.replace(/\.(pdf|docx)$/i, ""),
          language: locale === "en" ? "English" : "Polish",
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error();

      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        if (buf.startsWith("__ERROR__:")) break;
        setChatHistories((prev) => {
          const msgs = [...(prev[targetId] ?? [])];
          msgs[msgs.length - 1] = { role: "assistant", content: buf };
          return { ...prev, [targetId]: msgs };
        });
      }
      buf += decoder.decode();

      if (buf.startsWith("__ERROR__:")) {
        const errCode = buf.slice("__ERROR__:".length);
        let errMsg = "Error getting response. Please try again.";
        if (errCode.startsWith("GROQ_TOKEN_DAY_LIMIT:")) {
          const sec = parseFloat(errCode.split(":")[1]) || 1800;
          setGroqLimitUntil(Date.now() + Math.ceil(sec) * 1000);
          errMsg = "Groq daily token limit reached. Please wait for the countdown and try again.";
        } else if (errCode.startsWith("GROQ_TOKEN_MIN_LIMIT:") || errCode.startsWith("GROQ_RATE_LIMIT:")) {
          const sec = parseFloat(errCode.split(":")[1]) || 60;
          setGroqLimitUntil(Date.now() + Math.ceil(sec) * 1000);
          errMsg = "Rate limit reached. Please wait a moment.";
        }
        setChatHistories((prev) => {
          const msgs = [...(prev[targetId] ?? [])];
          msgs[msgs.length - 1] = { role: "assistant", content: errMsg };
          return { ...prev, [targetId]: msgs };
        });
        return;
      }
    } catch {
      setChatHistories((prev) => {
        const msgs = [...(prev[targetId] ?? [])];
        msgs[msgs.length - 1] = { role: "assistant", content: "Error getting response. Please try again." };
        return { ...prev, [targetId]: msgs };
      });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Groq token limit error banner */}
      {groqLimitUntil && (
        <div className="bg-orange-50/90 backdrop-blur-sm border-b border-orange-200/70 px-4 py-3">
          <div className="mx-auto max-w-5xl flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-orange-800 mb-0.5">
                Groq Daily Token Limit Reached
                {groqCountdown && (
                  <span className="ml-2 font-mono bg-orange-100 text-orange-900 rounded px-1.5 py-0.5">
                    {groqCountdown}
                  </span>
                )}
              </p>
              <p className="text-xs text-orange-700">
                Free tier limit: 100,000 tokens/day.
                {groqCountdown
                  ? ` Retry available in ${groqCountdown}.`
                  : " Limit has reset — you can try again."}
                {" "}Upgrade at{" "}
                <a href="https://console.groq.com/settings/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-900">
                  console.groq.com
                </a>.
              </p>
            </div>
            <button
              onClick={() => { setGroqLimitUntil(null); setGroqCountdown(null); }}
              className="shrink-0 text-orange-500 hover:text-orange-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="glass-heavy sticky top-0 z-50 rounded-b-2xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-5 py-3.5 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="lg:hidden glass flex items-center justify-center w-9 h-9 rounded-xl text-gray-600 hover:text-gray-800 transition-colors shrink-0"
              aria-label={t.toggleHistory}
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link href={locale === "pl" ? "/pl" : "/"} aria-label="Home" className="rounded-xl hover:opacity-80 transition-opacity">
              <LogoFull iconSize={36} />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={startNewAnalysis}
              className="hidden sm:inline-flex glass items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              title={t.newAnalysis}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">{t.newAnalysis}</span>
            </button>
            <button
              onClick={() => setLocale((l) => (l === "en" ? "pl" : "en"))}
              className="glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Globe className="h-4 w-4" />
              {locale === "en" ? "EN → PL" : "PL → EN"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-fade-up"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <div className="flex flex-1 min-h-0">
        {/* History sidebar */}
        <aside
          className={`${
            sidebarOpen
              ? "fixed inset-y-0 left-0 z-50 w-80 translate-x-0"
              : "fixed inset-y-0 left-0 z-50 w-80 -translate-x-full"
          } lg:relative lg:translate-x-0 lg:w-72 lg:shrink-0 transition-transform duration-300 ease-out`}
        >
          <div className="glass-heavy h-full lg:rounded-r-3xl lg:m-3 lg:mr-0 lg:h-[calc(100vh-104px)] lg:sticky lg:top-[88px] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-500" />
                <h2 className="text-sm font-semibold text-gray-800">{t.history}</h2>
                {sessions.length > 0 && (
                  <span className="text-xs text-gray-400">({sessions.length})</span>
                )}
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-gray-700 transition-colors"
                aria-label={t.toggleHistory}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-3 pb-3">
              <button
                onClick={startNewAnalysis}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-semibold px-4 py-2.5 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                {t.newAnalysis}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
              {sessions.length === 0 ? (
                <div className="px-2 py-8 text-center">
                  <div className="mx-auto w-10 h-10 rounded-2xl bg-indigo-100/60 flex items-center justify-center mb-3">
                    <History className="h-4 w-4 text-indigo-400" />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.noHistoryYet}</p>
                </div>
              ) : (
                sessions.map((s) => {
                  const isActive = s.id === activeSessionId;
                  const candCount = s.results.length;
                  return (
                    <div
                      key={s.id}
                      className={`group relative rounded-xl border transition-all ${
                        isActive
                          ? "bg-white/70 border-indigo-200/70 shadow-sm"
                          : "bg-white/30 border-white/50 hover:bg-white/55"
                      }`}
                    >
                      <button
                        onClick={() => loadSession(s.id)}
                        className="w-full text-left px-3 py-3 cursor-pointer"
                      >
                        <div className="flex items-start gap-2">
                          <Briefcase
                            className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
                              isActive ? "text-indigo-500" : "text-gray-400"
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <div
                              className={`text-xs font-semibold leading-snug ${
                                isActive ? "text-indigo-800" : "text-gray-700"
                              } pr-6`}
                            >
                              <span className="line-clamp-2 break-words">{sessionTitle(s, t)}</span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-gray-500">
                              <span>{relativeTime(s.createdAt, t)}</span>
                              <span aria-hidden>·</span>
                              <span>
                                {candCount} {candCount === 1 ? t.candidateShort : t.candidatesShort}
                              </span>
                              {isActive && (
                                <>
                                  <span aria-hidden>·</span>
                                  <span className="text-indigo-500 font-semibold">{t.activeSession}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(s.id);
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-gray-400 hover:text-red-500 cursor-pointer"
                        aria-label={t.deleteSession}
                        title={t.deleteSession}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-4 py-3 border-t border-white/40 text-[10px] text-gray-500 leading-relaxed flex items-start gap-1.5">
              <Info className="h-3 w-3 mt-0.5 shrink-0 text-gray-400" />
              <span>{t.historyHint}</span>
            </div>
          </div>
        </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 mx-auto w-full max-w-5xl px-4 py-10 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-gray-500">{t.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          {/* Job Description */}
          <div className="flex flex-col gap-2 h-full">
            <label className="text-sm font-medium text-gray-600 ml-1">{t.jobDescLabel}</label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder={t.jobDescPlaceholder}
              className="glass-input w-full flex-1 min-h-[280px] rounded-2xl px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 resize-none transition-shadow"
            />
          </div>

          {/* File Upload */}
          <div className="flex flex-col gap-2 h-full">
            <label className="text-sm font-medium text-gray-600 ml-1">{t.uploadLabel}</label>
            <div className="flex flex-col flex-1 gap-3">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`glass flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 transition-all duration-300 cursor-pointer ${
                  candidates.length > 0 ? "py-5" : "py-10 flex-1"
                } ${dragOver ? "border-blue-400 !bg-blue-50/40 scale-[1.01]" : "border-white/40 hover:border-blue-300/60 hover:scale-[1.005]"}`}
              >
                <div className={`flex items-center justify-center rounded-2xl bg-blue-100/60 backdrop-blur-sm transition-all duration-300 ${
                  candidates.length > 0 ? "w-9 h-9" : "w-12 h-12"
                }`}>
                  <Upload className={`text-blue-500 transition-all duration-300 ${candidates.length > 0 ? "h-4 w-4" : "h-6 w-6"}`} />
                </div>
                <span className="text-sm text-gray-500 text-center">{t.uploadHint}</span>
                <input ref={fileRef} type="file" accept=".pdf,.docx" multiple onChange={onFileChange} className="hidden" />
              </div>

              {candidates.length > 0 && (
                <div className="flex flex-col flex-1 gap-2 animate-fade-up">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-gray-500">{candidates.length} {t.uploadedFiles}</span>
                    <button
                      onClick={() => { setCandidates([]); if (fileRef.current) fileRef.current.value = ""; }}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 inline mr-1" />
                      {locale === "en" ? "Clear all" : "Wyczyść"}
                    </button>
                  </div>
                  <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
                    {candidates.map((c, index) => (
                      <div key={c.file.name} className="glass rounded-xl overflow-hidden animate-slide-in">
                        <div className="flex items-center gap-2 px-3 py-2.5 text-sm group">
                          <span className="shrink-0 text-xs font-bold text-blue-600 bg-blue-100/60 rounded-full px-1.5 py-0.5 leading-none">#{index + 1}</span>
                          <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                          <span className="text-gray-700 truncate flex-1">{c.file.name}</span>
                          <span className="text-xs text-gray-400">{(c.file.size / 1024).toFixed(0)} KB</span>
                          <button onClick={() => removeCandidate(c.file.name)} className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="px-3 pb-2.5">
                          <textarea
                            value={c.additionalInfo}
                            onChange={(e) => updateAdditionalInfo(c.file.name, e.target.value)}
                            placeholder="Additional information about this candidate (optional)..."
                            rows={2}
                            className="w-full rounded-xl border border-white/50 bg-white/30 px-3 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400/40 resize-none transition-shadow"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200/60 bg-red-50/50 backdrop-blur-sm px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {/* RODO / GDPR consent */}
        <div className="glass rounded-2xl p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 rounded-xl bg-indigo-100/70 flex items-center justify-center">
              <Shield className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800">{t.rodoLabel}</div>
              <label className="mt-2 flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rodoConsent}
                  onChange={(e) => {
                    setRodoConsent(e.target.checked);
                    try {
                      if (!e.target.checked) localStorage.removeItem(RODO_STORAGE_KEY);
                    } catch {}
                    if (e.target.checked && error === t.rodoRequired) setError("");
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400 cursor-pointer"
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  {t.rodoConsentText}{" "}
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(true)}
                    className="underline text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {t.privacyPolicy}
                  </button>
                  .
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={analyze}
            disabled={loading || !rodoConsent}
            className="glass-btn inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />{t.analyzingBtn}</> : <><Sparkles className="h-4 w-4" />{t.analyzeBtn}</>}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Users className="h-5 w-5 text-blue-500" />
                {t.resultHeading}
                <span className="text-sm font-normal text-gray-400">({results.length})</span>
              </h2>
              {results.some((r) => r.status === "done") && (
                <button onClick={toggleAll} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  {allExpanded ? t.collapseAll : t.expandAll}
                </button>
              )}
            </div>

            <div className="space-y-3">
              {results.map((r) => (
                <div key={r.id} className="glass-heavy rounded-2xl overflow-hidden transition-all">
                  {/* Header */}
                  <div className="flex items-center gap-2 px-5 py-4">
                    <button onClick={() => toggleExpand(r.id)} className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity cursor-pointer min-w-0">
                      {r.expanded
                        ? <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                        : <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />}
                      <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                      <div className="flex items-baseline gap-2 truncate flex-1">
                        <span className="text-xs font-bold text-blue-600 bg-blue-100/60 rounded-full px-2 py-0.5 shrink-0">#{r.candidateNumber}</span>
                        <span className="font-medium text-gray-800 truncate">{r.fileName.replace(/\.(pdf|docx)$/i, "")}</span>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      {r.matchPercent && (
                        <span className="rounded-full bg-blue-100/60 border border-blue-200/50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                          {t.matchLabel}: {r.matchPercent}
                        </span>
                      )}
                      {r.recommendation && (
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${recBadgeColor(r.recommendation)}`}>
                          {recBadgeLabel(r.recommendation)}
                        </span>
                      )}
                      {r.status === "streaming" && (
                        <span className="flex items-center gap-1 text-xs text-amber-600">
                          <Loader2 className="h-3 w-3 animate-spin" />{t.statusStreaming}
                        </span>
                      )}
                      {r.status === "done" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                      {r.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}

                      {/* Copy + Chat buttons — only when analysis is done */}
                      {r.status === "done" && r.content && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(r.content).then(() => {
                              setCopiedId(r.id);
                              setTimeout(() => setCopiedId(null), 2000);
                            }).catch(() => {});
                          }}
                          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium glass transition-all cursor-pointer text-gray-500 hover:text-gray-700"
                          title="Copy report"
                        >
                          {copiedId === r.id ? (
                            <><Check className="h-3.5 w-3.5 text-emerald-500" /><span className="text-emerald-600">Copied</span></>
                          ) : (
                            <><Copy className="h-3.5 w-3.5" />Copy</>
                          )}
                        </button>
                      )}
                      {r.status === "done" && r.content && (
                        <button
                          onClick={() => {
                            if (!r.expanded) toggleExpand(r.id);
                            setTimeout(() => document.getElementById(`chat-${r.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
                          }}
                          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium glass text-indigo-600 hover:text-indigo-800 transition-all cursor-pointer"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          {t.chatBtn}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded analysis + inline chat */}
                  {r.expanded && (
                    <div className="border-t border-white/30">
                      {/* Analysis content */}
                      <div className="px-5 py-5">
                        {r.status === "error" ? (
                          <p className="text-sm text-red-600">{r.content}</p>
                        ) : r.status === "streaming" && !r.content ? (
                          <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>{t.statusStreaming}</span>
                          </div>
                        ) : r.status === "done" && !r.content ? (
                          <div className="flex items-center gap-2 text-sm text-amber-600 py-2">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>No content received. Please click Analyze Candidates again.</span>
                          </div>
                        ) : (
                          <article className="prose prose-sm max-w-none prose-headings:text-blue-700 prose-strong:text-gray-800 prose-li:text-gray-600 prose-p:text-gray-600">
                            <ReactMarkdown>{r.content}</ReactMarkdown>
                          </article>
                        )}
                      </div>

                      {/* Inline chat — always shown when analysis is done */}
                      {r.status === "done" && r.content && (
                        <div className="border-t border-white/30" id={`chat-${r.id}`}>
                          {/* Chat header */}
                          <div className="flex items-center justify-between px-5 py-3 bg-indigo-50/40">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-indigo-500" />
                              <div>
                                <span className="text-sm font-semibold text-indigo-800">{t.chatTitle}</span>
                                <p className="text-xs text-indigo-500">{t.chatSubtitle}</p>
                              </div>
                            </div>
                            <span className="text-xs text-indigo-400 italic hidden sm:block">{t.chatContextNote}</span>
                          </div>

                          {/* Quick question tiles — shown when no messages yet */}
                          {!(chatHistories[r.id]?.length) && (
                            <div className="flex flex-wrap gap-2 px-5 pt-4 pb-1">
                              {quickQuestions[locale].map((q) => (
                                <button
                                  key={q}
                                  onClick={() => sendChatMessage(q, r.id)}
                                  disabled={chatLoading}
                                  className="text-xs px-3 py-1.5 rounded-xl glass border border-indigo-200/50 text-indigo-600 hover:text-indigo-800 hover:border-indigo-400/50 transition-all cursor-pointer disabled:opacity-40"
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Messages */}
                          <div className="flex flex-col gap-3 px-5 py-4 max-h-96 overflow-y-auto">
                            {(chatHistories[r.id] ?? []).map((msg, i) => (
                              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                                  msg.role === "user"
                                    ? "bg-indigo-500 text-white rounded-br-sm"
                                    : "bg-white/60 border border-white/50 text-gray-800 rounded-bl-sm"
                                }`}>
                                  {msg.role === "assistant" && msg.content === "" ? (
                                    <span className="flex items-center gap-1 text-gray-400 text-xs">
                                      <Loader2 className="h-3 w-3 animate-spin" />{t.chatAnalyzing}
                                    </span>
                                  ) : (
                                    <div className="prose prose-xs max-w-none prose-p:my-0 prose-headings:text-current prose-strong:text-current prose-li:text-current prose-p:text-current">
                                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            {activeChatId === r.id && <div ref={chatEndRef} />}
                          </div>

                          {/* Input */}
                          <div className="flex items-end gap-2 px-5 pb-4">
                            <textarea
                              value={activeChatId === r.id ? chatInput : ""}
                              onChange={(e) => { setActiveChatId(r.id); setChatInput(e.target.value); }}
                              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(undefined, r.id); } }}
                              onFocus={() => setActiveChatId(r.id)}
                              placeholder={t.chatPlaceholder}
                              rows={1}
                              disabled={chatLoading && activeChatId === r.id}
                              className="flex-1 rounded-xl border border-white/50 bg-white/40 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 resize-none transition-shadow disabled:opacity-50"
                            />
                            <button
                              onClick={() => sendChatMessage(undefined, r.id)}
                              disabled={(chatLoading && activeChatId === r.id) || !(activeChatId === r.id ? chatInput.trim() : false)}
                              className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                            >
                              {chatLoading && activeChatId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      </div>

      <footer className="py-4 text-center text-xs text-gray-400 space-y-1">
        <p>AI HR Assistant &middot; Powered by Groq &amp; Vercel AI SDK</p>
        <p className="text-gray-400">{t.footerRights}</p>
        <p className="flex items-center justify-center gap-2 flex-wrap">
          <a href="mailto:sumotry@gmail.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            sumotry@gmail.com
          </a>
          <span aria-hidden>&middot;</span>
          <button
            onClick={() => setPrivacyOpen(true)}
            className="text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-2 hover:underline"
          >
            {t.privacyPolicyLong}
          </button>
        </p>
      </footer>

      <CookieConsent locale={locale} onOpenPolicy={() => setPrivacyOpen(true)} />
      <PrivacyPolicy open={privacyOpen} onClose={() => setPrivacyOpen(false)} locale={locale} />
    </div>
  );
}
