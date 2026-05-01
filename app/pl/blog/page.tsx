import type { Metadata } from "next";
import { BlogIndex, buildBlogIndexJsonLd } from "../../components/BlogIndex";
import { getPostsByLocale } from "@/lib/blog/posts";

const SITE_URL = "https://www.hr-ai.services";

export const metadata: Metadata = {
  title: "Blog HR AI: analiza CV, rekrutacja AI i zgodność z RODO",
  description:
    "Praktyczne poradniki o analizie CV przez AI, produktywności rekrutera i zgodności z RODO oraz unijnym AI Act. Pisane dla rekruterów, nie konsultantów.",
  alternates: {
    canonical: "/pl/blog",
    languages: {
      "en-US": "/blog",
      "pl-PL": "/pl/blog",
      "x-default": "/blog",
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    alternateLocale: ["en_US"],
    url: `${SITE_URL}/pl/blog`,
    siteName: "HR AI Assistant",
    title: "Blog HR AI: analiza CV, rekrutacja AI i zgodność z RODO",
    description:
      "Praktyczne poradniki o analizie CV przez AI, produktywności rekrutera i zgodności z RODO oraz unijnym AI Act.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog HR AI: analiza CV, rekrutacja AI i zgodność z RODO",
    description:
      "Praktyczne poradniki o analizie CV przez AI, produktywności rekrutera i zgodności z RODO oraz unijnym AI Act.",
  },
};

export default function PolishBlogIndexPage() {
  const posts = getPostsByLocale("pl");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBlogIndexJsonLd(posts, SITE_URL, "pl")),
        }}
      />
      <BlogIndex posts={posts} locale="pl" />
    </>
  );
}
