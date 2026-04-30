import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Brain,
  Users,
  Star,
} from "lucide-react";
import { LogoFull, LogoIcon } from "./Logo";
import type { LandingContent } from "@/lib/landing-content";

const VERDICT_BADGE: Record<"emerald" | "amber" | "red", string> = {
  emerald: "inline-block rounded-full bg-emerald-100/70 text-emerald-700 border border-emerald-200/60 px-3 py-1 text-xs font-semibold",
  amber: "inline-block rounded-full bg-amber-100/70 text-amber-700 border border-amber-200/60 px-3 py-1 text-xs font-semibold",
  red: "inline-block rounded-full bg-red-100/70 text-red-700 border border-red-200/60 px-3 py-1 text-xs font-semibold",
};

const PILL_BADGE: Record<"emerald" | "amber" | "red", string> = {
  emerald: "inline-block rounded-full bg-emerald-100/70 text-emerald-700 border border-emerald-200/60 px-3 py-0.5 text-xs font-semibold mb-1.5",
  amber: "inline-block rounded-full bg-amber-100/70 text-amber-700 border border-amber-200/60 px-3 py-0.5 text-xs font-semibold mb-1.5",
  red: "inline-block rounded-full bg-red-100/70 text-red-700 border border-red-200/60 px-3 py-0.5 text-xs font-semibold mb-1.5",
};

const THRESHOLD_TEXT: Record<"emerald" | "amber" | "red", string> = {
  emerald: "text-emerald-700 font-bold text-sm",
  amber: "text-amber-700 font-bold text-sm",
  red: "text-red-700 font-bold text-sm",
};

export function Landing({ c }: { c: LandingContent }) {
  return (
    <main className="relative overflow-x-hidden">
      {/* ===== NAV ===== */}
      <header className="sticky top-0 z-50 w-full">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <nav
            aria-label={c.nav.primaryAria}
            className="glass rounded-2xl flex items-center justify-between px-5 py-3"
          >
            <Link href="/" aria-label={c.nav.homeAria}>
              <LogoFull iconSize={32} />
            </Link>
            <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-700">
              <a href="#features" className="hover:text-gray-900 transition">{c.nav.features}</a>
              <a href="#how-it-works" className="hover:text-gray-900 transition">{c.nav.howItWorks}</a>
              <a href="#use-cases" className="hover:text-gray-900 transition">{c.nav.useCases}</a>
              <a href="#faq" className="hover:text-gray-900 transition">{c.nav.faq}</a>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={c.langSwitch.href}
                hrefLang={c.langSwitch.href === "/" ? "en" : "pl"}
                className="hidden sm:inline-flex items-center gap-1.5 glass rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-white/70 transition"
                aria-label={c.langSwitch.label}
              >
                {c.langSwitch.code}
              </Link>
              <Link
                href="/app"
                className="glass-btn inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition"
              >
                {c.nav.openApp} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-gray-700 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              {c.hero.badge}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.05]">
              {c.hero.h1Line1}
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                {c.hero.h1Line2}
              </span>
            </h1>

            <p className="mt-7 text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {c.hero.subtitle}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/app"
                className="glass-btn inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-base font-semibold text-white transition shadow-lg"
              >
                {c.hero.ctaPrimary} <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="glass inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-base font-semibold text-gray-800 hover:bg-white/70 transition"
              >
                {c.hero.ctaSecondary}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
              {c.hero.trustChips.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Hero visual — glass mock */}
          <div className="mt-20 mx-auto max-w-5xl">
            <div className="glass-heavy rounded-3xl p-2 shadow-2xl">
              <div className="rounded-2xl bg-white/60 backdrop-blur-xl p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-3 w-3 rounded-full bg-red-300/70" />
                  <div className="h-3 w-3 rounded-full bg-amber-300/70" />
                  <div className="h-3 w-3 rounded-full bg-emerald-300/70" />
                  <span className="ml-3 text-xs text-gray-400 font-mono">{c.hero.mockBrowserBar}</span>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {c.hero.mockCandidates.map((cand) => (
                    <div key={cand.name} className="glass rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-xs text-gray-500 font-medium">{c.hero.mockCandidateLabel}</div>
                          <div className="text-base font-semibold text-gray-900">{cand.name}</div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 tracking-tight">{cand.score}</div>
                      </div>
                      <div className={VERDICT_BADGE[cand.color]}>{cand.verdict}</div>
                      <div className="mt-4 space-y-1.5">
                        <div className="h-1.5 w-full rounded-full bg-gray-200/60 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            style={{ width: cand.score }}
                          />
                        </div>
                        <div className="flex gap-2 pt-3">
                          <div className="h-1.5 w-3/4 rounded bg-gray-200/60" />
                          <div className="h-1.5 w-1/4 rounded bg-gray-200/40" />
                        </div>
                        <div className="h-1.5 w-2/3 rounded bg-gray-200/60" />
                        <div className="h-1.5 w-1/2 rounded bg-gray-200/50" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {c.stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl px-6 py-5 text-center">
                <div className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 md:py-28 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-4">
              <Sparkles className="h-3.5 w-3.5" /> {c.features.label}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
              {c.features.h2}
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">{c.features.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.features.items.map((f) => (
              <article key={f.title} className="glass rounded-3xl p-7 hover:bg-white/70 transition-colors">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md mb-5">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 md:py-28 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-4">
              <Zap className="h-3.5 w-3.5" /> {c.how.label}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
              {c.how.h2}
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">{c.how.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.how.steps.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="glass-heavy rounded-3xl p-7 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className="text-3xl font-bold tracking-tight text-gray-300">{s.n}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
                </div>
                {i < c.how.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SCORING PHILOSOPHY ===== */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-4">
                <Brain className="h-3.5 w-3.5" /> {c.scoring.label}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
                {c.scoring.h2Line1}
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  {c.scoring.h2Line2}
                </span>
              </h2>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">{c.scoring.p1}</p>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">{c.scoring.p2}</p>
            </div>

            <div className="glass-heavy rounded-3xl p-7 md:p-9">
              <h3 className="text-base font-semibold text-gray-900 mb-5">{c.scoring.cardTitle}</h3>
              <div className="space-y-3">
                {c.scoring.rows.map((row) => (
                  <div key={row.level} className="glass rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className={PILL_BADGE[row.color]}>{row.level}</div>
                      <p className="text-sm text-gray-600">{row.def}</p>
                    </div>
                    <div className="text-sm font-mono font-semibold text-gray-900 whitespace-nowrap">
                      {row.impact}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-base font-semibold text-gray-900 mt-7 mb-3">{c.scoring.thresholdsTitle}</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                {c.scoring.thresholds.map((t) => (
                  <div key={t.label} className="glass rounded-xl p-3">
                    <div className={THRESHOLD_TEXT[t.color]}>{t.range}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section id="use-cases" className="py-20 md:py-28 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-4">
              <Users className="h-3.5 w-3.5" /> {c.useCases.label}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
              {c.useCases.h2}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {c.useCases.items.map((u) => (
              <article key={u.title} className="glass rounded-3xl p-7 hover:bg-white/70 transition-colors">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-md mb-5">
                  <u.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{u.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{u.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRIVACY / TRUST ===== */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="glass-heavy rounded-3xl p-8 md:p-14 text-center max-w-4xl mx-auto">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md mb-6">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              {c.privacy.h2}
            </h2>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {c.privacy.body}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {c.privacy.chips.map((t) => (
                <span key={t} className="glass rounded-full px-4 py-1.5 text-xs font-semibold text-gray-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20 md:py-28 scroll-mt-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-4">
              {c.faq.label}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
              {c.faq.h2}
            </h2>
          </div>

          <div className="space-y-3">
            {c.faq.items.map((f) => (
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
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl glass-heavy p-10 md:p-16 text-center">
            <div
              className="absolute inset-0 -z-10 opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99, 102, 241, 0.2), transparent 60%)",
              }}
            />
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg mb-7">
              <LogoIcon size={32} />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-3xl mx-auto leading-[1.1]">
              {c.finalCta.h2Line1}
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                {c.finalCta.h2Line2}
              </span>
            </h2>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {c.finalCta.body}
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/app"
                className="glass-btn inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-white transition shadow-lg"
              >
                {c.finalCta.cta} <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                {c.finalCta.secondaryCta}
              </a>
            </div>
            <div className="mt-7 flex items-center justify-center gap-1 text-amber-500" aria-label={c.finalCta.starsLabel}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 text-sm text-gray-500">{c.finalCta.socialProof}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/40 bg-white/30 backdrop-blur-md mt-12">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <LogoFull iconSize={28} />
            <p className="mt-3 text-sm text-gray-600 max-w-md leading-relaxed">{c.footer.tagline}</p>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <div className="flex items-center gap-5 text-sm text-gray-600">
              <Link href="/app" className="hover:text-gray-900 transition">{c.footer.appLink}</Link>
              <a href="#features" className="hover:text-gray-900 transition">{c.footer.featuresLink}</a>
              <a href="#faq" className="hover:text-gray-900 transition">{c.footer.faqLink}</a>
              <Link
                href={c.langSwitch.href}
                hrefLang={c.langSwitch.href === "/" ? "en" : "pl"}
                className="hover:text-gray-900 transition"
              >
                {c.langSwitch.label}
              </Link>
            </div>
            <p className="text-xs text-gray-500">{c.footer.copyright(new Date().getFullYear())}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export function buildJsonLd(c: LandingContent, siteUrl: string, locale: "en" | "pl") {
  const url = locale === "pl" ? `${siteUrl}/pl` : siteUrl;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#software`,
        name: "HR AI Assistant",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Human Resources Software",
        operatingSystem: "Web",
        url,
        inLanguage: locale,
        description: c.meta.description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "127",
        },
        featureList: c.features.items.map((f) => f.title),
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "HR AI Assistant",
        url: siteUrl,
        logo: `${siteUrl}/og-image.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "HR AI Assistant",
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: ["en", "pl"],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: locale,
        mainEntity: c.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}
