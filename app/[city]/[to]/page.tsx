import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";

import SeoRouteClient from "@/app/ui/seo-route-client";
import { CITY_BY_SLUG, prettyCityNameFromSlug } from "@/lib/city-landings";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildRouteMetadata } from "@/lib/seo";
import { buildRouteSeoData } from "@/lib/route-seo";

function normalizeSlug(input: string) {
  const raw = (input ?? "").trim();
  let s = raw;
  try {
    s = decodeURIComponent(raw);
  } catch {
    // ignore
  }
  s = s
    .trim()
    .toLowerCase()
    .replace(/[—–-−]/g, "-")
    .replace(/-+/g, "-");
  return s;
}

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { city: string; to: string };
}): Promise<Metadata> {
  const fromSlug = normalizeSlug(params.city);
  const toSlug = normalizeSlug(params.to);

  const fromCity = CITY_BY_SLUG.get(fromSlug);
  if (!fromCity) return { robots: { index: false, follow: false } };

  const validTo = new Set(fromCity.popularTo.map(normalizeSlug));
  if (!validTo.has(toSlug)) return { robots: { index: false, follow: false } };

  const toName = prettyCityNameFromSlug(toSlug);
  const seoData = buildRouteSeoData({
    fromSlug: fromCity.slug,
    fromName: fromCity.name,
    fromGenitive: fromCity.fromGenitive,
    toSlug,
    toName,
  });

  return buildRouteMetadata({
    fromSlug: fromCity.slug,
    fromName: fromCity.name,
    toSlug,
    toName,
    title: seoData.metadataTitle,
    description: seoData.metadataDescription,
    keywords: seoData.metadataKeywords,
  });
}

export default function Page({ params }: { params: { city: string; to: string } }) {
  const fromSlug = normalizeSlug(params.city);
  const toSlug = normalizeSlug(params.to);

  const fromCity = CITY_BY_SLUG.get(fromSlug);
  if (!fromCity) return notFound();

  const toName = prettyCityNameFromSlug(toSlug);

  const seoData = buildRouteSeoData({
    fromSlug: fromCity.slug,
    fromName: fromCity.name,
    fromGenitive: fromCity.fromGenitive,
    toSlug,
    toName,
  });

  const moreFromCity = fromCity.popularTo
    .filter((s) => s !== toSlug)
    .slice(0, 10)
    .map((s) => ({ toSlug: s, toName: prettyCityNameFromSlug(s) }));

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: fromCity.name, path: `/${fromCity.slug}` },
    { name: toName, path: `/${fromCity.slug}/${toSlug}` },
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
    name: `Такси ${fromCity.name} — ${toName}`,
    serviceType: "Междугороднее такси",
    provider: {
      "@type": "LocalBusiness",
      name: "Вектор РФ",
      telephone: "+78002225650",
      areaServed: "Россия",
      url: `https://vector-rf.ru/${fromCity.slug}/${toSlug}`,
    },
    areaServed: [fromCity.name, toName],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `https://vector-rf.ru/${fromCity.slug}/${toSlug}`,
      availableLanguage: "ru",
    },
    description: seoData.metadataDescription,
  };

  const keywordsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Запросы по маршруту ${fromCity.name} — ${toName}`,
    itemListElement: [
      `такси ${fromCity.name} ${toName}`,
      `междугороднее такси ${fromCity.name} ${toName}`,
      `такси межгород ${fromCity.name} ${toName}`,
      `трансфер ${fromCity.name} ${toName}`,
    ].map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
    })),
  };

  return (
    <>
      <Script
        id={`ld-route-breadcrumbs-${fromCity.slug}-${toSlug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <Script
        id={`ld-route-faq-${fromCity.slug}-${toSlug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id={`ld-route-more-${fromCity.slug}-${toSlug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(moreRoutesJsonLd) }}
      />
      <Script
        id={`ld-route-service-${fromCity.slug}-${toSlug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id={`ld-route-keywords-${fromCity.slug}-${toSlug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(keywordsJsonLd) }}
      />

      <SeoRouteClient
        fromSlug={fromCity.slug}
        cityBackHref={`/${fromCity.slug}`}
        cityBackLabel={`← Из ${fromCity.fromGenitive}`}
        fromName={fromCity.name}
        toSlug={toSlug}
        toName={toName}
        content={seoData.content}
        keywordText={seoData.keywordText}
        faq={seoData.faq}
        moreFromCity={moreFromCity}
      />
    </>
  );
}
