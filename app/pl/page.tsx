import type { Metadata } from "next";
import { Landing, buildJsonLd } from "../components/Landing";
import { landingPL } from "@/lib/landing-content";

const SITE_URL = "https://hr-ai-assistant.vercel.app";

export const metadata: Metadata = {
  title: landingPL.meta.title,
  description: landingPL.meta.description,
  keywords: [
    "skanowanie CV AI",
    "asystent rekrutacji AI",
    "automatyczna analiza CV",
    "narzędzie rekrutacyjne AI",
    "rekrutacja oparta na AI",
    "ATS AI",
    "ocena kandydatów AI",
    "RODO rekrutacja",
    "GDPR CV",
    "AI dla HR",
    "screening CV",
    "krótka lista AI",
    "selekcja kandydatów AI",
    "pytania rekrutacyjne AI",
    "automatyzacja HR",
  ],
  alternates: {
    canonical: "/pl",
    languages: {
      "en-US": "/",
      "pl-PL": "/pl",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: landingPL.meta.ogLocale,
    alternateLocale: [landingPL.meta.ogAlternateLocale],
    url: `${SITE_URL}/pl`,
    siteName: "HR AI Assistant",
    title: landingPL.meta.title,
    description: landingPL.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: landingPL.meta.title,
    description: landingPL.meta.description,
  },
};

export default function PolishHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(landingPL, SITE_URL, "pl")) }}
      />
      <Landing c={landingPL} />
    </>
  );
}
