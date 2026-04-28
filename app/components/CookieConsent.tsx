"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { dict } from "@/lib/locale";

const STORAGE_KEY = "hr-ai-cookie-consent-v1";

interface CookieConsentProps {
  locale: Locale;
  onOpenPolicy: () => void;
}

export function CookieConsent({ locale, onOpenPolicy }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);
  const t = dict[locale];

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const persist = (value: "accepted" | "essential") => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice: value, ts: Date.now() }),
      );
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t.cookieTitle}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] w-[calc(100%-1.5rem)] max-w-2xl"
    >
      <div className="glass-heavy rounded-2xl p-4 sm:p-5 shadow-xl animate-fade-up">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-xl bg-blue-100/70 flex items-center justify-center">
            <Cookie className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-gray-800">{t.cookieTitle}</h2>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">
              {t.cookieBody}{" "}
              <button
                onClick={onOpenPolicy}
                className="underline text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {t.cookieLearnMore}
              </button>
              .
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => persist("accepted")}
                className="glass-btn rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                {t.cookieAccept}
              </button>
              <button
                onClick={() => persist("essential")}
                className="glass rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 transition-all cursor-pointer"
              >
                {t.cookieEssentialOnly}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
