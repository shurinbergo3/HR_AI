"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type DragEvent,
  type ChangeEvent,
  type KeyboardEvent,
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
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { dict, type Locale } from "@/lib/locale";
import { LogoFull } from "./components/Logo";

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

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [jobDesc, setJobDesc] = useState("");
  const [candidates, setCandidates] = useState<CandidateFile[]>([]);
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [groqLimitUntil, setGroqLimitUntil] = useState<number | null>(null);
  const [groqCountdown, setGroqCountdown] = useState<string | null>(null);

  // Chat state
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const t = dict[locale];

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
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    setError("");
    setGroqLimitUntil(null);
    setResults([]);
    setChatHistories({});
    setActiveChatId(null);
    setLoading(true);
    const language = locale === "en" ? "English" : "Polish";
    await Promise.all(candidates.map((c, i) => analyzeOne(c, i + 1, jobDesc, language)));
    setLoading(false);
  };

  const toggleExpand = (id: string) => {
    updateResult(id, { expanded: results.find((r) => r.id === id)?.expanded === false });
  };

  const allExpanded = results.length > 0 && results.every((r) => r.expanded);
  const toggleAll = () => {
    const next = !allExpanded;
    setResults((prev) => prev.map((r) => ({ ...r, expanded: next })));
  };

  // --- Chat ---
  const activeResult = results.find((r) => r.id === activeChatId) ?? null;
  const activeMessages = activeChatId ? (chatHistories[activeChatId] ?? []) : [];

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !activeChatId || chatLoading) return;
    const result = results.find((r) => r.id === activeChatId);
    if (!result) return;

    const userMsg: ChatMessage = { role: "user", content: chatInput.trim() };
    setChatInput("");

    const updatedHistory = [...activeMessages, userMsg];
    setChatHistories((prev) => ({ ...prev, [activeChatId]: updatedHistory }));
    setChatLoading(true);

    const placeholderMsg: ChatMessage = { role: "assistant", content: "" };
    setChatHistories((prev) => ({ ...prev, [activeChatId]: [...updatedHistory, placeholderMsg] }));

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
          const msgs = [...(prev[activeChatId] ?? [])];
          msgs[msgs.length - 1] = { role: "assistant", content: buf };
          return { ...prev, [activeChatId]: msgs };
        });
      }
      buf += decoder.decode();

      if (buf.startsWith("__ERROR__:")) {
        const errCode = buf.slice("__ERROR__:".length);
        let userMsg = "Error getting response. Please try again.";
        if (errCode.startsWith("GROQ_TOKEN_DAY_LIMIT:")) {
          const sec = parseFloat(errCode.split(":")[1]) || 1800;
          setGroqLimitUntil(Date.now() + Math.ceil(sec) * 1000);
          userMsg = "Groq daily token limit reached. Please wait for the countdown and try again.";
        } else if (errCode.startsWith("GROQ_TOKEN_MIN_LIMIT:") || errCode.startsWith("GROQ_RATE_LIMIT:")) {
          const sec = parseFloat(errCode.split(":")[1]) || 60;
          setGroqLimitUntil(Date.now() + Math.ceil(sec) * 1000);
          userMsg = "Rate limit reached. Please wait a moment.";
        }
        setChatHistories((prev) => {
          const msgs = [...(prev[activeChatId] ?? [])];
          msgs[msgs.length - 1] = { role: "assistant", content: userMsg };
          return { ...prev, [activeChatId]: msgs };
        });
        return;
      }
    } catch {
      setChatHistories((prev) => {
        const msgs = [...(prev[activeChatId] ?? [])];
        msgs[msgs.length - 1] = { role: "assistant", content: "Error getting response. Please try again." };
        return { ...prev, [activeChatId]: msgs };
      });
    } finally {
      setChatLoading(false);
    }
  };

  const onChatKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dismissable banner */}
      {showBanner && (
        <div className="relative bg-amber-50/80 backdrop-blur-sm border-b border-amber-200/60 px-4 py-2.5">
          <div className="mx-auto max-w-5xl flex items-start gap-3">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 flex-1">{t.bannerText}</p>
            <button
              onClick={() => setShowBanner(false)}
              className="shrink-0 text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors flex items-center gap-1"
            >
              {t.bannerDismiss}
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

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
        <div className="mx-auto max-w-5xl flex items-center justify-between px-5 py-3.5">
          <LogoFull iconSize={36} />
          <button
            onClick={() => setLocale((l) => (l === "en" ? "pl" : "en"))}
            className="glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Globe className="h-4 w-4" />
            {locale === "en" ? "EN → PL" : "PL → EN"}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-gray-500">{t.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:auto-rows-fr">
          {/* Job Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 ml-1">{t.jobDescLabel}</label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder={t.jobDescPlaceholder}
              className="glass-input w-full flex-1 min-h-[280px] rounded-2xl px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 resize-none transition-shadow"
            />
          </div>

          {/* File Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 ml-1">{t.uploadLabel}</label>
            <div className="flex flex-col flex-1 gap-3">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`glass flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-10 cursor-pointer transition-all ${
                  dragOver ? "border-blue-400 !bg-blue-50/40" : "border-white/40 hover:border-blue-300/60"
                }`}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100/60 backdrop-blur-sm">
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <span className="text-sm text-gray-500">{t.uploadHint}</span>
                <input ref={fileRef} type="file" accept=".pdf,.docx" multiple onChange={onFileChange} className="hidden" />
              </div>

              {candidates.length > 0 && (
                <div className="space-y-2">
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
                  <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1">
                    {candidates.map((c, index) => (
                      <div key={c.file.name} className="glass rounded-xl overflow-hidden">
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

        <div className="flex justify-center">
          <button
            onClick={analyze}
            disabled={loading}
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

                      {/* Chat button — only when analysis is done */}
                      {r.status === "done" && (
                        <button
                          onClick={() => setActiveChatId(activeChatId === r.id ? null : r.id)}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                            activeChatId === r.id
                              ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                              : "glass text-indigo-600 hover:text-indigo-800"
                          }`}
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          {t.chatBtn}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded analysis */}
                  {r.expanded && (
                    <div className="border-t border-white/30 px-5 py-5">
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
                  )}

                  {/* Inline chat panel */}
                  {activeChatId === r.id && (
                    <div className="border-t border-white/30">
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

                      {/* Messages */}
                      <div className="flex flex-col gap-3 px-5 py-4 max-h-80 overflow-y-auto">
                        {activeMessages.length === 0 && (
                          <p className="text-xs text-gray-400 text-center py-4">{t.chatContextNote}</p>
                        )}
                        {activeMessages.map((msg, i) => (
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
                        <div ref={chatEndRef} />
                      </div>

                      {/* Input */}
                      <div className="flex items-end gap-2 px-5 pb-4">
                        <textarea
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={onChatKeyDown}
                          placeholder={t.chatPlaceholder}
                          rows={1}
                          disabled={chatLoading}
                          className="flex-1 rounded-xl border border-white/50 bg-white/40 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 resize-none transition-shadow disabled:opacity-50"
                        />
                        <button
                          onClick={sendChatMessage}
                          disabled={chatLoading || !chatInput.trim()}
                          className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                        >
                          {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="py-4 text-center text-xs text-gray-400 space-y-1">
        <p>AI HR Assistant &middot; Powered by Groq &amp; Vercel AI SDK</p>
        <p>
          <a href="mailto:sumotry@gmail.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            sumotry@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}
