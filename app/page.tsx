import type { Metadata } from "next";
import { Landing, buildJsonLd } from "./components/Landing";
import { LandingShell } from "./components/LandingShell";
import { landingEN } from "@/lib/landing-content";

const SITE_URL = "https://hr-ai-assistant.vercel.app";

export const metadata: Metadata = {
  title: landingEN.meta.title,
  description: landingEN.meta.description,
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "pl-PL": "/pl",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: landingEN.meta.ogLocale,
    alternateLocale: [landingEN.meta.ogAlternateLocale],
    url: SITE_URL,
    siteName: "HR AI Assistant",
    title: landingEN.meta.title,
    description: landingEN.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: landingEN.meta.title,
    description: landingEN.meta.description,
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(landingEN, SITE_URL, "en")) }}
      />
      <Landing c={landingEN} />
      <LandingShell locale="en" />
    </>
  );
}
