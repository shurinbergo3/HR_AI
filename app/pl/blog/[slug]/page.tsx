import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle, buildArticleJsonLd } from "../../../components/BlogArticle";
import { blogPosts, getPost, getPostsByLocale } from "@/lib/blog/posts";

const SITE_URL = "https://www.hr-ai.services";

export function generateStaticParams() {
  return blogPosts
    .filter((p) => p.locale === "pl")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug, "pl");
  if (!post) return { title: "Artykuł nie znaleziony" };

  const url = `${SITE_URL}/pl/blog/${post.slug}`;
  const enPair = getPost(post.slug, "en");

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/pl/blog/${post.slug}`,
      languages: {
        ...(enPair ? { "en-US": `/blog/${post.slug}` } : {}),
        "pl-PL": `/pl/blog/${post.slug}`,
        "x-default": enPair ? `/blog/${post.slug}` : `/pl/blog/${post.slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: "pl_PL",
      alternateLocale: enPair ? ["en_US"] : undefined,
      url,
      siteName: "HR AI Assistant",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PolishBlogArticlePage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPost(slug, "pl");
  if (!post) notFound();

  const related = getPostsByLocale("pl")
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildArticleJsonLd(post, SITE_URL)),
        }}
      />
      <BlogArticle post={post} related={related} />
    </>
  );
}
