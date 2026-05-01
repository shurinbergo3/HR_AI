import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle, buildArticleJsonLd } from "../../components/BlogArticle";
import { blogPosts, getPost, getPostsByLocale } from "@/lib/blog/posts";

const SITE_URL = "https://www.hr-ai.services";

export function generateStaticParams() {
  return blogPosts
    .filter((p) => p.locale === "en")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug, "en");
  if (!post) return { title: "Article not found" };

  const url = `${SITE_URL}/blog/${post.slug}`;
  const plPair = getPost(post.slug, "pl");

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
      languages: {
        "en-US": `/blog/${post.slug}`,
        ...(plPair ? { "pl-PL": `/pl/blog/${post.slug}` } : {}),
        "x-default": `/blog/${post.slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      alternateLocale: plPair ? ["pl_PL"] : undefined,
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

export default async function BlogArticlePage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPost(slug, "en");
  if (!post) notFound();

  const related = getPostsByLocale("en")
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
