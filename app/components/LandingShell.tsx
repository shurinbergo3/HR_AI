"use client";

import { useState } from "react";
import type { Locale } from "@/lib/locale";
import { CookieConsent } from "./CookieConsent";
import { PrivacyPolicy } from "./PrivacyPolicy";

export function LandingShell({ locale }: { locale: Locale }) {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <CookieConsent locale={locale} onOpenPolicy={() => setPrivacyOpen(true)} />
      <PrivacyPolicy open={privacyOpen} onClose={() => setPrivacyOpen(false)} locale={locale} />
    </>
  );
}
