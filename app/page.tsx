"use client";

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from "react";
import { Upload, FileText, Loader2, Globe, Sparkles, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { dict, type Locale } from "@/lib/locale";

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [jobDesc, setJobDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const t = dict[locale];

  const handleFile = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf" || ext === "docx") {
      setFile(f);
      setError("");
    }
  };

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const analyze = async () => {
    if (!jobDesc.trim()) return setError(t.errorNoJob);
    if (!file) return setError(t.errorNoResume);

    setError("");
    setResult("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDesc);
      formData.append("resume", file);
      formData.append("language", locale === "en" ? "English" : "Polish");

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
        setResult(buf);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <span className="font-semibold text-lg tracking-tight">{t.title}</span>
          </div>
          <button
            onClick={() => setLocale((l) => (l === "en" ? "pl" : "en"))}
            className="flex items-center gap-1.5 rounded-full border border-gray-700 px-3 py-1.5 text-sm hover:bg-gray-800 transition-colors"
          >
            <Globe className="h-4 w-4" />
            {locale === "en" ? "EN → PL" : "PL → EN"}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 space-y-8">
        <p className="text-gray-400 text-center">{t.subtitle}</p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Job Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t.jobDescLabel}</label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder={t.jobDescPlaceholder}
              rows={12}
              className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t.uploadLabel}</label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-16 cursor-pointer transition-colors ${
                dragOver
                  ? "border-indigo-400 bg-indigo-950/30"
                  : "border-gray-700 bg-gray-900 hover:border-gray-500"
              }`}
            >
              <Upload className="h-8 w-8 text-gray-500" />
              <span className="text-sm text-gray-400">{t.uploadHint}</span>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.docx"
                onChange={onFileChange}
                className="hidden"
              />
            </div>
            {file && (
              <div className="flex items-center gap-2 rounded-lg bg-gray-800/60 px-3 py-2 text-sm">
                <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                <span className="text-gray-300 truncate">
                  {t.uploadedFile} {file.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="ml-auto text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-center">
          <button
            onClick={analyze}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

        {/* Result */}
        {result && (
          <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-200">{t.resultHeading}</h2>
            <article className="prose prose-invert prose-sm max-w-none prose-headings:text-indigo-300 prose-strong:text-gray-200">
              <ReactMarkdown>{result}</ReactMarkdown>
            </article>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-4 text-center text-xs text-gray-600">
        AI HR Assistant &middot; Powered by Groq &amp; Vercel AI SDK
      </footer>
    </div>
  );
}
