import type { Metadata } from "next";
import { BlogIndex, buildBlogIndexJsonLd } from "../components/BlogIndex";
import { getPostsByLocale } from "@/lib/blog/posts";

const SITE_URL = "https://www.hr-ai.services";

export const metadata: Metadata = {
  title: "HR AI Blog: Resume Screening, AI Recruiting & GDPR Compliance",
  description:
    "Practical guides on AI resume screening, recruiter productivity, and GDPR/EU AI Act compliance for HR teams. Written for recruiters, not consultants.",
  alternates: {
    canonical: "/blog",
    languages: {
      "en-US": "/blog",
      "pl-PL": "/pl/blog",
      "x-default": "/blog",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["pl_PL"],
    url: `${SITE_URL}/blog`,
    siteName: "HR AI Assistant",
    title: "HR AI Blog: Resume Screening, AI Recruiting & GDPR Compliance",
    description:
      "Practical guides on AI resume screening, recruiter productivity, and GDPR/EU AI Act compliance for HR teams.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HR AI Blog: Resume Screening, AI Recruiting & GDPR Compliance",
    description:
      "Practical guides on AI resume screening, recruiter productivity, and GDPR/EU AI Act compliance for HR teams.",
  },
};

export default function BlogIndexPage() {
  const posts = getPostsByLocale("en");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBlogIndexJsonLd(posts, SITE_URL, "en")),
        }}
      />
      <BlogIndex posts={posts} locale="en" />
    </>
  );
}
