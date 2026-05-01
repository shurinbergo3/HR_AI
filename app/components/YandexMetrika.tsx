"use client";

import { useEffect } from "react";

const COUNTER_ID = 108995222;
const STORAGE_KEY = "hr-ai-cookie-consent-v2";

declare global {
  interface Window {
    ym?: ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };
  }
}

type Consent = { essential: true; analytics: boolean; marketing: boolean };

function readAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { consent?: Consent };
    return Boolean(parsed?.consent?.analytics);
  } catch {
    return false;
  }
}

function loadMetrika() {
  if (typeof window === "undefined") return;
  if (window.ym) return; // already initialised

  const src = `https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}`;

  // Dedupe — don't inject if the tag is already on the page
  for (let j = 0; j < document.scripts.length; j++) {
    if ((document.scripts[j] as HTMLScriptElement).src === src) return;
  }

  // Bootstrap the global queue exactly like the official snippet does, then
  // append the loader script and initialise the counter.
  type YmFn = ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };
  const queue: unknown[] = [];
  const stub: YmFn = (...args) => {
    queue.push(args);
  };
  stub.a = queue;
  stub.l = Date.now();
  window.ym = stub;

  const tag = document.createElement("script");
  const first = document.getElementsByTagName("script")[0];
  tag.async = true;
  tag.src = src;
  first?.parentNode?.insertBefore(tag, first);

  stub(COUNTER_ID, "init", {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: "dataLayer",
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });
}

export function YandexMetrika() {
  useEffect(() => {
    if (readAnalyticsConsent()) loadMetrika();

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<Consent>).detail;
      if (detail?.analytics) loadMetrika();
      // Note: once loaded, the script stays; future page loads will respect
      // the new choice via readAnalyticsConsent() on mount.
    };

    window.addEventListener("hr-ai:consent", onConsent);
    return () => window.removeEventListener("hr-ai:consent", onConsent);
  }, []);

  // No <noscript> pixel: it would track users with JS disabled even when they
  // have not granted analytics consent, which would violate RODO/GDPR.
  return null;
}
