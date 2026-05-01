import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { YandexMetrika } from "./components/YandexMetrika";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

const SITE_URL = "https://www.hr-ai.services";
const SITE_NAME = "HR AI Assistant";
const TITLE = "HR AI Assistant — AI Resume Screening & Candidate Analysis in Seconds";
const DESCRIPTION =
  "AI-powered resume screening for recruiters and HR teams. Upload CVs, paste a job description, and get senior-level candidate analysis with match scores, hiring recommendations, and interview questions — streamed in real-time. Free to try, GDPR/RODO compliant, EN/PL.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | HR AI Assistant",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "AI resume screening",
    "AI HR assistant",
    "candidate analysis software",
    "automated CV screening",
    "AI recruiting tool",
    "applicant tracking AI",
    "resume parser AI",
    "AI hiring assistant",
    "recruitment automation",
    "AI candidate scoring",
    "ATS alternative",
    "skrining CV AI",
    "asystent rekrutacji AI",
    "GDPR resume screening",
    "RODO recruitment",
  ],
  authors: [{ name: "HR AI Assistant" }],
  creator: "HR AI Assistant",
  publisher: "HR AI Assistant",
  category: "Human Resources",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["pl_PL"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HR AI Assistant — AI-powered resume screening for recruiters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "axH0NEHDSMG7un5XLerYngt8w4LJR3Px042xqgIImHs",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e0f0ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-gray-800 antialiased`}>
        <ErrorBoundary>{children}</ErrorBoundary>
        <YandexMetrika />
      </body>
    </html>
  );
}