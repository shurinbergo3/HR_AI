import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { LogoFull } from "./Logo";
import type { BlogPost } from "@/lib/blog/posts";
import { articleCopy, blogIndexCopy } from "@/lib/blog/posts";

function formatDate(iso: string, locale: "en" | "pl") {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === "pl" ? "pl-PL" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogArticle({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const a = articleCopy(post.locale);
  const idx = blogIndexCopy(post.locale);
  const blogHref = post.locale === "pl" ? "/pl/blog" : "/blog";
  const homeHref = post.locale === "pl" ? "/pl" : "/";
  const appHref = "/app";

  return (
    <main className="relative overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <nav className="glass rounded-2xl flex items-center justify-between px-5 py-3">
            <Link href={homeHref} aria-label={a.backHome}>
              <LogoFull iconSize={32} />
            </Link>
            <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-700">
              <Link href={blogHref} className="hover:text-gray-900 transition">{idx.blog}</Link>
              <Link href={homeHref} className="hover:text-gray-900 transition">{a.backHome}</Link>
            </div>
            <Link
              href={appHref}
              className="glass-btn inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition"
            >
              {post.locale === "pl" ? "Otwórz aplikację" : "Open app"} <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 pt-8 pb-20">
        <nav aria-label="breadcrumb" className="mb-8 text-xs text-gray-500 flex items-center gap-2">
          <Link href={homeHref} className="hover:text-gray-700 transition">{a.backHome}</Link>
          <span aria-hidden>/</span>
          <Link href={blogHref} className="hover:text-gray-700 transition">{idx.blog}</Link>
          <span aria-hidden>/</span>
          <span className="text-gray-700 truncate">{post.title}</span>
        </nav>

        <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          <Sparkles className="h-3.5 w-3.5" /> {post.hero.eyebrow}
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
          {post.hero.h1}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {a.published} {formatDate(post.publishedAt, post.locale)}
          </span>
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <span className="inline-flex items-center gap-1.5">
              · {a.updated} {formatDate(post.updatedAt, post.locale)}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readingMinutes} {idx.minutes}
          </span>
          <span className="inline-flex items-center gap-1.5">
            · {a.author}: {post.author}
          </span>
        </div>

        <p className="mt-8 text-lg text-gray-600 leading-relaxed">{post.hero.intro}</p>

        <div className="mt-10 prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-table:text-sm prose-th:bg-indigo-50/40 prose-th:text-gray-900 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-table:border-collapse prose-th:border prose-th:border-gray-200/70 prose-td:border prose-td:border-gray-200/70">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>

        <section className="mt-16 glass-heavy rounded-3xl p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            {post.cta.title}
          </h2>
          <p className="mt-4 text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {post.cta.body}
          </p>
          <Link
            href={appHref}
            className="mt-6 glass-btn inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-base font-semibold text-white transition shadow-lg"
          >
            {post.cta.button} <ArrowRight className="h-5 w-5" />
          </Link>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-6">
            {a.faqHeading}
          </h2>
          <div className="space-y-3">
            {post.faq.map((f) => (
              <details
                key={f.q}
                className="glass rounded-2xl px-6 py-5 group [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="text-base font-semibold text-gray-900 pr-4">{f.q}</h3>
                  <span className="flex-shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-gray-500 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm text-gray-700 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-6">
              {a.relatedHeading}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`${blogHref}/${r.slug}`}
                  className="glass rounded-2xl p-5 hover:bg-white/70 transition-colors block group"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
                    {r.hero.eyebrow}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors leading-snug">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16">
          <Link
            href={blogHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
          >
            <ArrowLeft className="h-4 w-4" /> {a.backToBlog}
          </Link>
        </div>
      </article>
    </main>
  );
}

export function buildArticleJsonLd(post: BlogPost, siteUrl: string) {
  const url = post.locale === "pl"
    ? `${siteUrl}/pl/blog/${post.slug}`
    : `${siteUrl}/blog/${post.slug}`;
  const blogHome = post.locale === "pl" ? `${siteUrl}/pl/blog` : `${siteUrl}/blog`;
  const home = post.locale === "pl" ? `${siteUrl}/pl` : siteUrl;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        keywords: post.keywords.join(", "),
        inLanguage: post.locale,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: { "@type": "Organization", name: post.author },
        publisher: {
          "@type": "Organization",
          name: "HR AI Assistant",
          logo: { "@type": "ImageObject", url: `${siteUrl}/icon` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: post.locale === "pl" ? "Strona główna" : "Home", item: home },
          { "@type": "ListItem", position: 2, name: "Blog", item: blogHome },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
