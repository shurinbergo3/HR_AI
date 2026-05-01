import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog/posts";

const SITE_URL = "https://www.hr-ai.services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          "en-US": `${SITE_URL}/`,
          "pl-PL": `${SITE_URL}/pl`,
          "x-default": `${SITE_URL}/`,
        },
      },
    },
    {
      url: `${SITE_URL}/pl`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
      alternates: {
        languages: {
          "en-US": `${SITE_URL}/`,
          "pl-PL": `${SITE_URL}/pl`,
          "x-default": `${SITE_URL}/`,
        },
      },
    },
    {
      url: `${SITE_URL}/app`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
      alternates: {
        languages: {
          "en-US": `${SITE_URL}/blog`,
          "pl-PL": `${SITE_URL}/pl/blog`,
          "x-default": `${SITE_URL}/blog`,
        },
      },
    },
    {
      url: `${SITE_URL}/pl/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          "en-US": `${SITE_URL}/blog`,
          "pl-PL": `${SITE_URL}/pl/blog`,
          "x-default": `${SITE_URL}/blog`,
        },
      },
    },
  ];

  const articles: MetadataRoute.Sitemap = blogPosts.map((post) => {
    const path = post.locale === "pl"
      ? `/pl/blog/${post.slug}`
      : `/blog/${post.slug}`;
    const enPath = `/blog/${post.slug}`;
    const plPath = `/pl/blog/${post.slug}`;
    const hasEn = blogPosts.some((p) => p.slug === post.slug && p.locale === "en");
    const hasPl = blogPosts.some((p) => p.slug === post.slug && p.locale === "pl");

    return {
      url: `${SITE_URL}${path}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          ...(hasEn ? { "en-US": `${SITE_URL}${enPath}` } : {}),
          ...(hasPl ? { "pl-PL": `${SITE_URL}${plPath}` } : {}),
          "x-default": `${SITE_URL}${hasEn ? enPath : plPath}`,
        },
      },
    };
  });

  return [...staticPages, ...articles];
}
