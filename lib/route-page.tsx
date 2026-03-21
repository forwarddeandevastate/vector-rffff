import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";

import SeoRouteFormClient from "@/app/ui/seo-route-client";
import Link from "next/link";
import {
  PageBackground, Header, Footer, GlassPanel, Tag, SectionHeading,
} from "@/app/ui/shared";
import {
  CORE_SERVICE_LINKS,
  POPULAR_ROUTE_LINKS,
  BLOG_COMMERCIAL_LINKS,
  TRUST_FACTS,
} from "@/lib/internal-links";
import {
  CITY_BY_SLUG,
  CITY_LANDINGS,
  isValidRouteSlugs,
  prettyCityNameFromSlug,
} from "@/lib/city-landings";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildRouteMetadata,
} from "@/lib/seo";
import { buildRouteSeoData } from "@/lib/route-seo";
import { type RouteVariantKey } from "@/lib/route-variants";
import { getPriorityDestinationsForCity } from "@/lib/priority-routes";

const SITE_PHONE = "+78002225650";

function normalizeSlug(input: string) {
  const raw = (input ?? "").trim();
  let s = raw;

  try {
    s = decodeURIComponent(raw);
  } catch {}

  return s
    .trim()
    .toLowerCase()
    .replace(/[—–-−]/g, "-")
    .replace(/-+/g, "-");
}

function getCity(slug: string) {
  return CITY_BY_SLUG.get(slug) ?? null;
}

export function buildRoutePageMetadata(_variantKey: RouteVariantKey) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ city: string; to: string }> | { city: string; to: string };
  }): Promise<Metadata> {
    const resolved = await Promise.resolve(params as { city: string; to: string });
    const fromSlug = normalizeSlug(resolved.city);
    const toSlug = normalizeSlug(resolved.to);

    const fromCity = getCity(fromSlug);
    const toCity = getCity(toSlug);

    if (!fromCity || !toCity || !isValidRouteSlugs(fromSlug, toSlug)) {
      return {
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const seoData = buildRouteSeoData({
      fromSlug: fromCity.slug,
      fromName: fromCity.name,
      fromGenitive: fromCity.fromGenitive,
      toSlug: toCity.slug,
      toName: toCity.name,
      variantKey: "main",
    });

    return buildRouteMetadata({
      fromSlug: fromCity.slug,
      fromName: fromCity.name,
      toSlug: toCity.slug,
      toName: toCity.name,
      title: seoData.metadataTitle,
      description: seoData.metadataDescription,
      keywords: seoData.metadataKeywords,
      canonicalPath: `/${fromCity.slug}/${toCity.slug}`,
      indexable: true,
    });
  };
}

export function createRoutePage(variantKey: RouteVariantKey) {
  return async function RoutePage({
    params,
  }: {
    params: Promise<{ city: string; to: string }> | { city: string; to: string };
  }) {
    const resolved = await Promise.resolve(params as { city: string; to: string });
    const fromSlug = normalizeSlug(resolved.city);
    const toSlug = normalizeSlug(resolved.to);

    const fromCity = getCity(fromSlug);
    const toCity = getCity(toSlug);

    if (!fromCity || !toCity || !isValidRouteSlugs(fromSlug, toSlug)) {
      return notFound();
    }

    const seoData = buildRouteSeoData({
      fromSlug: fromCity.slug,
      fromName: fromCity.name,
      fromGenitive: fromCity.fromGenitive,
      toSlug: toCity.slug,
      toName: toCity.name,
      variantKey,
    });

    const reverseRoute = {
      href: `/${toCity.slug}/${fromCity.slug}`,
      label: `${toCity.name} — ${fromCity.name}`,
    };

    const priorityDestinations = getPriorityDestinationsForCity(fromCity.slug, toCity.slug, 10)
      .map((item) => item.to)
      .filter((slug) => slug !== fromCity.slug && slug !== toCity.slug);

    const moreFromCity = [
      ...priorityDestinations,
      ...CITY_LANDINGS.map((item) => item.slug),
    ]
      .filter((slug, index, arr) => arr.indexOf(slug) === index)
      .filter((slug) => slug !== fromCity.slug && slug !== toCity.slug)
      .slice(0, 10)
      .map((slug) => ({
        toSlug: slug,
        toName: prettyCityNameFromSlug(slug),
      }));

    const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: fromCity.name, path: `/${fromCity.slug}` },
      {
        name: `${fromCity.name} — ${toCity.name}`,
        path: `/${fromCity.slug}/${toCity.slug}`,
      },
    ]);

    const faqJsonLd = buildFaqJsonLd(seoData.faq);

    const moreRoutesJsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Ещё маршруты из ${fromCity.name}`,
      itemListElement: moreFromCity.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${fromCity.name} — ${item.toName}`,
        url: `https://vector-rf.ru/${fromCity.slug}/${item.toSlug}`,
      })),
    };

    const serviceJsonLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${fromCity.name} — ${toCity.name}`,
      serviceType: "Междугороднее такси и трансфер",
      provider: {
        "@type": "LocalBusiness",
        name: "Вектор РФ",
        telephone: SITE_PHONE,
        areaServed: "Россия",
        url: `https://vector-rf.ru/${fromCity.slug}/${toCity.slug}`,
      },
      areaServed: [fromCity.name, toCity.name],
      description: seoData.metadataDescription,
    };

    const offerJsonLd = {
      "@context": "https://schema.org",
      "@type": "Offer",
      url: `https://vector-rf.ru/${fromCity.slug}/${toCity.slug}`,
      priceCurrency: "RUB",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "RUB",
        valueAddedTaxIncluded: false,
        description: "Итоговая стоимость подтверждается заранее до поездки",
      },
      availability: "https://schema.org/InStock",
      eligibleRegion: {
        "@type": "Country",
        name: "Россия",
      },
      seller: {
        "@type": "Organization",
        name: "Вектор РФ",
        url: "https://vector-rf.ru",
      },
    };

    return (
      <>
        <Script
          id={`ld-route-breadcrumbs-${fromCity.slug}-${toCity.slug}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsJsonLd),
          }}
        />
        <Script
          id={`ld-route-faq-${fromCity.slug}-${toCity.slug}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
        <Script
          id={`ld-route-more-${fromCity.slug}-${toCity.slug}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(moreRoutesJsonLd),
          }}
        />
        <Script
          id={`ld-route-service-${fromCity.slug}-${toCity.slug}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceJsonLd),
          }}
        />
        <Script
          id={`ld-route-offer-${fromCity.slug}-${toCity.slug}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(offerJsonLd),
          }}
        />

        <PageBackground />
        <Header />

        <div className="animate-page">
          <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">

            {/* ── HERO ─────────────────────────────────────────── */}
            <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-10 lg:items-start">
              <section>
                {/* Breadcrumb */}
                <nav className="text-xs text-blue-400/80 mb-4">
                  <Link href="/" className="hover:text-blue-600 transition-colors">Главная</Link>
                  <span className="mx-2">/</span>
                  <Link href={`/${fromCity.slug}`} className="hover:text-blue-600 transition-colors">{fromCity.name}</Link>
                  <span className="mx-2">/</span>
                  <span className="text-blue-800/60 font-semibold">{toCity.name}</span>
                </nav>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Tag>Межгород</Tag>
                  <Tag>Без пересадок</Tag>
                  <Tag>Стоимость заранее</Tag>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                  {seoData.h1 || `${fromCity.name} — ${toCity.name}`}
                </h1>
                <p className="mt-3 text-base leading-7 text-slate-600">{seoData.subtitle}</p>

                {/* Route facts */}
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {seoData.routeFacts.slice(0, 4).map((fact: string) => (
                    <div key={fact} className="flex items-start gap-2.5 rounded-2xl border border-blue-100/60 bg-white/75 p-3.5 backdrop-blur-sm shadow-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      <span className="text-sm text-slate-700">{fact}</span>
                    </div>
                  ))}
                </div>

                {/* Keyword badges */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    `такси ${fromCity.name} — ${toCity.name}`,
                    `трансфер ${fromCity.name} — ${toCity.name}`,
                    `межгород ${fromCity.name} — ${toCity.name}`,
                  ].map((b) => (
                    <span key={b} className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200/60 px-3 py-1 text-xs font-semibold text-blue-700">{b}</span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a href="#order" className="btn-primary inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold">
                    Оставить заявку
                  </a>
                  <a href="tel:+78002225650" className="btn-ghost inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold">
                    8 800 222-56-50
                  </a>
                </div>
              </section>

              {/* Form — client */}
              <SeoRouteFormClient fromName={fromCity.name} toName={toCity.name} />
            </div>

            {/* ── TRUST FACTS ───────────────────────────────────── */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {TRUST_FACTS.map((fact: string) => (
                <div key={fact} className="flex items-start gap-2.5 rounded-2xl border border-blue-100/50 bg-white/75 p-4 shadow-sm">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  <span className="text-sm text-slate-700">{fact}</span>
                </div>
              ))}
            </div>

            {/* ── КОНТЕНТ ───────────────────────────────────────── */}
            <GlassPanel className="mt-6 p-6 md:p-8">
              <h2 className="text-base font-extrabold text-slate-800 mb-4">Маршрут {fromCity.name} — {toCity.name}</h2>
              <div className="space-y-4">
                {seoData.content.split(/\n\n+/).map((p: string) => p.trim()).filter(Boolean).map((p: string, i: number) => (
                  <p key={i} className="text-sm leading-6 text-slate-600">{p}</p>
                ))}
              </div>
            </GlassPanel>

            {/* ── KEYWORD TEXT ──────────────────────────────────── */}
            {seoData.keywordText?.length > 0 && (
              <GlassPanel className="mt-6 p-6">
                <div className="space-y-3">
                  {seoData.keywordText.map((text: string, i: number) => (
                    <p key={i} className="text-sm leading-6 text-slate-600">{text}</p>
                  ))}
                </div>
              </GlassPanel>
            )}

            {/* ── ОБРАТНЫЙ МАРШРУТ + НАВИГАЦИЯ ─────────────────── */}
            <GlassPanel className="mt-6 p-6">
              <div className="text-sm font-bold text-slate-800 mb-4">Смотрите также</div>
              <div className="flex flex-wrap gap-2">
                <Link href={reverseRoute.href}
                  className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors">
                  ↔ {reverseRoute.label}
                </Link>
                <Link href={`/${fromCity.slug}`}
                  className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  Все маршруты из {fromCity.name}
                </Link>
                <Link href={`/${toCity.slug}`}
                  className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  Все маршруты в {toCity.name}
                </Link>
                <Link href="/taxi-mezhgorod"
                  className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  Такси межгород
                </Link>
              </div>
            </GlassPanel>

            {/* ── ЕЩЁ МАРШРУТЫ ─────────────────────────────────── */}
            <GlassPanel className="mt-6 p-6">
              <div className="text-sm font-bold text-slate-800 mb-4">Другие маршруты из {fromCity.name}</div>
              <div className="flex flex-wrap gap-2">
                {moreFromCity.map((p: {toSlug: string; toName: string}) => (
                  <Link key={p.toSlug} href={`/${fromCity.slug}/${p.toSlug}`}
                    className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    {fromCity.name} — {p.toName}
                  </Link>
                ))}
              </div>
            </GlassPanel>

            {/* ── FAQ ───────────────────────────────────────────── */}
            <GlassPanel className="mt-6 p-6 md:p-8">
              <SectionHeading title={`Вопросы о маршруте ${fromCity.name} — ${toCity.name}`} />
              <div className="grid gap-3">
                {seoData.faq.map((f: {question: string; answer: string}, idx: number) => (
                  <div key={idx} className="rounded-2xl border border-blue-100/50 bg-white/80 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-xs font-bold text-blue-400 shrink-0 w-5 text-center">{idx + 1}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{f.question}</div>
                        <div className="mt-2 text-sm leading-6 text-slate-600">{f.answer}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* ── БЛОГ ─────────────────────────────────────────── */}
            <GlassPanel className="mt-6 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-slate-800">Читайте перед поездкой</div>
                <Link href="/blog" className="text-xs font-semibold text-blue-600 hover:text-blue-800">Все статьи →</Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {BLOG_COMMERCIAL_LINKS.map((b: {href: string; label: string}) => (
                  <Link key={b.href} href={b.href}
                    className="group rounded-2xl border border-blue-100/60 bg-white p-3 shadow-sm hover:border-blue-200 transition-all">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1.5 block">Блог</span>
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 transition-colors leading-snug">{b.label}</span>
                  </Link>
                ))}
              </div>
            </GlassPanel>

            {/* ── ПЕРЕЛИНКОВКА ─────────────────────────────────── */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <GlassPanel className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Полезные разделы</div>
                <div className="flex flex-wrap gap-2">
                  {CORE_SERVICE_LINKS.map((item: {href: string; label: string}) => (
                    <Link key={item.href} href={item.href}
                      className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </GlassPanel>
              <GlassPanel className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Популярные маршруты</div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_ROUTE_LINKS.slice(0, 8).map((item: {href: string; label: string}) => (
                    <Link key={item.href} href={item.href}
                      className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </GlassPanel>
            </div>

          </main>
        </div>

        <Footer />
      </>
    );
  };
}
