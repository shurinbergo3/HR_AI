import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { LogoFull } from "./Logo";
import { blogIndexCopy, type BlogPost } from "@/lib/blog/posts";

export function BlogIndex({ posts, locale }: { posts: BlogPost[]; locale: "en" | "pl" }) {
  const c = blogIndexCopy(locale);
  const homeHref = locale === "pl" ? "/pl" : "/";
  const blogHref = locale === "pl" ? "/pl/blog" : "/blog";
  const appHref = "/app";

  return (
    <main className="relative overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <nav className="glass rounded-2xl flex items-center justify-between px-5 py-3">
            <Link href={homeHref} aria-label={c.backHome}>
              <LogoFull iconSize={32} />
            </Link>
            <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-700">
              <Link href={blogHref} className="text-gray-900 transition">{c.blog}</Link>
              <Link href={homeHref} className="hover:text-gray-900 transition">{c.backHome}</Link>
            </div>
            <Link
              href={appHref}
              className="glass-btn inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition"
            >
              {locale === "pl" ? "Otwórz aplikację" : "Open app"} <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-gray-700 mb-6">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          {c.eyebrow}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1] max-w-3xl">
          {c.h1}
        </h1>
        <p className="mt-5 text-lg text-gray-600 leading-relaxed max-w-2xl">{c.intro}</p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-5">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`${blogHref}/${p.slug}`}
              className="glass-heavy rounded-3xl p-7 hover:bg-white/70 transition-colors group flex flex-col"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3">
                {p.hero.eyebrow}
              </div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-indigo-700 transition-colors leading-snug">
                {p.title}
              </h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
                {p.description}
              </p>
              <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {p.readingMinutes} {c.minutes}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 group-hover:gap-2 transition-all">
                  {c.readMore} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export function buildBlogIndexJsonLd(posts: BlogPost[], siteUrl: string, locale: "en" | "pl") {
  const url = locale === "pl" ? `${siteUrl}/pl/blog` : `${siteUrl}/blog`;
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    inLanguage: locale,
    name: "HR AI Assistant Blog",
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.publishedAt,
      dateModified: p.updatedAt,
      url: `${url}/${p.slug}`,
      inLanguage: p.locale,
    })),
  };
}
