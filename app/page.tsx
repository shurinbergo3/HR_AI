"use client";

import {
  useState,
  useRef,
  useCallback,
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
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { dict, type Locale } from "@/lib/locale";
import { LogoFull } from "./components/Logo";

interface CandidateResult {
  id: string;
  fileName: string;
  content: string;
  status: "streaming" | "done" | "error";
  expanded: boolean;
  matchPercent: string | null;
  recommendation: string | null;
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
    if (m) {
      recommendation = m[1];
      break;
    }
  }

  return {
    matchPercent: matchMatch?.[1] ?? null,
    recommendation,
  };
}

function recBadgeColor(rec: string | null): string {
  if (!rec) return "bg-gray-200/60 text-gray-600";
  const lower = rec.toLowerCase();
  if (lower.includes("not") || lower.includes("nie"))
    return "bg-red-100/70 text-red-700 border border-red-200/60";
  if (lower.includes("hold") || lower.includes("wstrzymaj"))
    return "bg-amber-100/70 text-amber-700 border border-amber-200/60";
  return "bg-emerald-100/70 text-emerald-700 border border-emerald-200/60";
}

function isValidFile(f: File): boolean {
  const ext = f.name.split(".").pop()?.toLowerCase();
  return ext === "pdf" || ext === "docx";
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [jobDesc, setJobDesc] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const t = dict[locale];

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const valid = Array.from(incoming).filter(isValidFile);
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const fresh = valid.filter((f) => !existingNames.has(f.name));
      return [...prev, ...fresh];
    });
    setError("");
  }, []);

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    if (fileRef.current) fileRef.current.value = "";
  };

  const updateResult = (id: string, patch: Partial<CandidateResult>) => {
    setResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  };

  const analyzeOne = async (file: File, jobDescription: string, language: string) => {
    const id = `${file.name}-${Date.now()}`;

    setResults((prev) => [
      ...prev,
      {
        id,
        fileName: file.name,
        content: "",
        status: "streaming",
        expanded: true,
        matchPercent: null,
        recommendation: null,
      },
    ]);

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      formData.append("resume", file);
      formData.append("language", language);

      const res = await fetch("/api/chat", { method: "POST", body: formData });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || t.errorGeneric);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error(t.errorGeneric);

      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const summary = extractSummary(buf);
        updateResult(id, {
          content: buf,
          matchPercent: summary.matchPercent,
          recommendation: summary.recommendation,
        });
      }

      const summary = extractSummary(buf);
      updateResult(id, {
        status: "done",
        content: buf,
        matchPercent: summary.matchPercent,
        recommendation: summary.recommendation,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.errorGeneric;
      updateResult(id, { status: "error", content: message });
    }
  };

  const analyze = async () => {
    if (!jobDesc.trim()) return setError(t.errorNoJob);
    if (files.length === 0) return setError(t.errorNoResume);

    setError("");
    setResults([]);
    setLoading(true);

    const language = locale === "en" ? "English" : "Polish";

    await Promise.all(
      files.map((file) => analyzeOne(file, jobDesc, language)),
    );

    setLoading(false);
  };

  const toggleExpand = (id: string) => {
    updateResult(id, {
      expanded: results.find((r) => r.id === id)?.expanded === false,
    });
  };

  const allExpanded = results.length > 0 && results.every((r) => r.expanded);
  const toggleAll = () => {
    const next = !allExpanded;
    setResults((prev) => prev.map((r) => ({ ...r, expanded: next })));
  };

  return (
    <div className="min-h-screen flex flex-col">
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
            <label className="text-sm font-medium text-gray-600 ml-1">
              {t.jobDescLabel}
            </label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder={t.jobDescPlaceholder}
              className="glass-input w-full flex-1 min-h-[280px] rounded-2xl px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 resize-none transition-shadow"
            />
          </div>

          {/* File Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 ml-1">
              {t.uploadLabel}
            </label>
            <div className="flex flex-col flex-1 gap-2">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`glass flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 cursor-pointer transition-all flex-1 min-h-[140px] ${
                  dragOver
                    ? "border-blue-400 !bg-blue-50/40"
                    : "border-white/40 hover:border-blue-300/60"
                }`}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100/60 backdrop-blur-sm">
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <span className="text-sm text-gray-500">{t.uploadHint}</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx"
                  multiple
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>

              {/* File list */}
              {files.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-gray-500">
                      {files.length} {t.uploadedFiles}
                    </span>
                    <button
                      onClick={() => {
                        setFiles([]);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 inline mr-1" />
                      {locale === "en" ? "Clear all" : "Wyczyść"}
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {files.map((f) => (
                      <div
                        key={f.name}
                        className="glass flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm group"
                      >
                        <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                        <span className="text-gray-700 truncate flex-1">
                          {f.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {(f.size / 1024).toFixed(0)} KB
                        </span>
                        <button
                          onClick={() => removeFile(f.name)}
                          className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200/60 bg-red-50/50 backdrop-blur-sm px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-center">
          <button
            onClick={analyze}
            disabled={loading}
            className="glass-btn inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.analyzingBtn}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {t.analyzeBtn}
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Users className="h-5 w-5 text-blue-500" />
                {t.resultHeading}
                <span className="text-sm font-normal text-gray-400">
                  ({results.length})
                </span>
              </h2>
              {results.some((r) => r.status === "done") && (
                <button
                  onClick={toggleAll}
                  className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {allExpanded ? t.collapseAll : t.expandAll}
                </button>
              )}
            </div>

            <div className="space-y-3">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="glass-heavy rounded-2xl overflow-hidden transition-all"
                >
                  {/* Collapsed header */}
                  <button
                    onClick={() => toggleExpand(r.id)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    {r.expanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                    )}

                    <FileText className="h-4 w-4 text-blue-500 shrink-0" />

                    <span className="font-medium text-gray-800 truncate flex-1">
                      {r.fileName.replace(/\.(pdf|docx)$/i, "")}
                    </span>

                    {r.matchPercent && (
                      <span className="shrink-0 rounded-full bg-blue-100/60 border border-blue-200/50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        {t.matchLabel}: {r.matchPercent}
                      </span>
                    )}

                    {r.recommendation && (
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${recBadgeColor(r.recommendation)}`}
                      >
                        {r.recommendation}
                      </span>
                    )}

                    {r.status === "streaming" && (
                      <span className="shrink-0 flex items-center gap-1 text-xs text-amber-600">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {t.statusStreaming}
                      </span>
                    )}
                    {r.status === "done" && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    )}
                    {r.status === "error" && (
                      <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                    )}
                  </button>

                  {/* Expanded content */}
                  {r.expanded && (
                    <div className="border-t border-white/30 px-5 py-5">
                      {r.status === "error" ? (
                        <p className="text-sm text-red-600">{r.content}</p>
                      ) : (
                        <article className="prose prose-sm max-w-none prose-headings:text-blue-700 prose-strong:text-gray-800 prose-li:text-gray-600 prose-p:text-gray-600">
                          <ReactMarkdown>{r.content}</ReactMarkdown>
                        </article>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400">
        AI HR Assistant &middot; Powered by Groq &amp; Vercel AI SDK
      </footer>
    </div>
  );
}
