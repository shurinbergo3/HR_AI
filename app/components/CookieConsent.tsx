"use client";

import { useEffect, useState } from "react";
import { Cookie, Settings2, ChevronLeft } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { dict } from "@/lib/locale";

const STORAGE_KEY = "hr-ai-cookie-consent-v2";

type Consent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

const DENY_OPTIONAL: Consent = { essential: true, analytics: false, marketing: false };
const ACCEPT_ALL: Consent = { essential: true, analytics: true, marketing: true };

interface CookieConsentProps {
  locale: Locale;
  onOpenPolicy: () => void;
}

export function CookieConsent({ locale, onOpenPolicy }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"banner" | "prefs">("banner");
  const [consent, setConsent] = useState<Consent>(DENY_OPTIONAL);
  const t = dict[locale];

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const persist = (c: Consent) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ consent: c, ts: Date.now(), v: 2 }),
      );
    } catch {}
    setConsent(c);
    setVisible(false);
    // Notify analytics integrations (e.g. Yandex Metrika loader) so they can
    // start/stop tracking without a page reload.
    try {
      window.dispatchEvent(new CustomEvent("hr-ai:consent", { detail: c }));
    } catch {}
  };

  if (!visible) return null;

  const isPrefs = mode === "prefs";

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t.cookieTitle}
      aria-modal={isPrefs ? "true" : undefined}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] w-[calc(100%-1.5rem)] max-w-2xl"
    >
      <div className="glass-heavy rounded-2xl shadow-xl animate-fade-up overflow-hidden">
        {/* ===== Banner mode ===== */}
        {!isPrefs && (
          <div className="p-4 sm:p-5">
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
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => persist(ACCEPT_ALL)}
                    className="rounded-xl px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all cursor-pointer shadow-md shadow-indigo-500/15"
                  >
                    {t.cookieAcceptAll}
                  </button>
                  <button
                    onClick={() => persist(DENY_OPTIONAL)}
                    className="rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 bg-white/70 hover:bg-white border border-gray-200/70 transition-all cursor-pointer"
                  >
                    {t.cookieRejectAll}
                  </button>
                  <button
                    onClick={() => setMode("prefs")}
                    className="rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-transparent border border-gray-200/60 hover:bg-white/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                    {t.cookiePreferences}
                  </button>
                </div>
                <p className="mt-3 text-[10px] text-gray-500 leading-relaxed">
                  {t.cookieWithdraw}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===== Preferences mode ===== */}
        {isPrefs && (
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setMode("banner")}
                className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
                aria-label={t.cookieClose}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-indigo-500" />
                {t.cookiePreferences}
              </h2>
            </div>

            <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
              {/* Essential — locked on */}
              <CategoryRow
                title={t.cookieCatEssential}
                desc={t.cookieCatEssentialDesc}
                checked
                locked
                lockedLabel={t.cookieAlwaysOn}
              />

              {/* Analytics */}
              <CategoryRow
                title={t.cookieCatAnalytics}
                desc={t.cookieCatAnalyticsDesc}
                checked={consent.analytics}
                onChange={(v) => setConsent((c) => ({ ...c, analytics: v }))}
              />

              {/* Marketing */}
              <CategoryRow
                title={t.cookieCatMarketing}
                desc={t.cookieCatMarketingDesc}
                checked={consent.marketing}
                onChange={(v) => setConsent((c) => ({ ...c, marketing: v }))}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => persist(ACCEPT_ALL)}
                className="rounded-xl px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all cursor-pointer shadow-md shadow-indigo-500/15"
              >
                {t.cookieAcceptAll}
              </button>
              <button
                onClick={() => persist(DENY_OPTIONAL)}
                className="rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 bg-white/70 hover:bg-white border border-gray-200/70 transition-all cursor-pointer"
              >
                {t.cookieRejectAll}
              </button>
              <button
                onClick={() => persist(consent)}
                className="rounded-xl px-4 py-2.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 transition-all cursor-pointer"
              >
                {t.cookieSavePrefs}
              </button>
            </div>

            <p className="mt-3 text-[10px] text-gray-500 leading-relaxed">
              {t.cookieWithdraw}{" "}
              <button
                onClick={onOpenPolicy}
                className="underline text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {t.cookieLearnMore}
              </button>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CategoryRowProps {
  title: string;
  desc: string;
  checked: boolean;
  locked?: boolean;
  lockedLabel?: string;
  onChange?: (v: boolean) => void;
}

function CategoryRow({ title, desc, checked, locked, lockedLabel, onChange }: CategoryRowProps) {
  return (
    <div className="rounded-xl bg-white/40 border border-white/60 px-3.5 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-semibold text-gray-800">{title}</h3>
          <p className="mt-1 text-[11px] text-gray-600 leading-relaxed">{desc}</p>
        </div>
        <div className="shrink-0 pt-0.5">
          {locked ? (
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 border border-emerald-200/60 rounded-full px-2 py-0.5 whitespace-nowrap">
              {lockedLabel}
            </span>
          ) : (
            <button
              type="button"
              role="switch"
              aria-checked={checked}
              onClick={() => onChange?.(!checked)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                checked ? "bg-indigo-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  checked ? "translate-x-[19px]" : "translate-x-1"
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
