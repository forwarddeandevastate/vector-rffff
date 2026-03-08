import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";

import SeoRouteClient from "@/app/ui/seo-route-client";
import { CITY_BY_SLUG, CITY_LANDINGS, isValidRouteSlugs, prettyCityNameFromSlug } from "@/lib/city-landings";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildRouteMetadata } from "@/lib/seo";
import { buildRouteSeoData } from "@/lib/route-seo";
import { ROUTE_VARIANTS, buildVariantHeading, buildVariantPath, type RouteVariantKey } from "@/lib/route-variants";
import { isRouteVariantIndexable } from "@/lib/seo-routes";

function normalizeSlug(input: string) {
  const raw = (input ?? "").trim();
  let s = raw;
  try {
    s = decodeURIComponent(raw);
  } catch {}
  return s.trim().toLowerCase().replace(/[—–-−]/g, "-").replace(/-+/g, "-");
}

function getCity(slug: string) {
  return CITY_BY_SLUG.get(slug) ?? null;
}

export function buildRoutePageMetadata(variantKey: RouteVariantKey) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ city: string; to: string }> | { city: string; to: string };
  }): Promise<Metadata> {
    const resolved = await Promise.resolve(params as any);
    const fromSlug = normalizeSlug(resolved.city);
    const toSlug = normalizeSlug(resolved.to);
    const fromCity = getCity(fromSlug);
    const toCity = getCity(toSlug);

    if (!fromCity || !toCity || !isValidRouteSlugs(fromSlug, toSlug)) {
      return { robots: { index: false, follow: false } };
    }

    const seoData = buildRouteSeoData({
      fromSlug: fromCity.slug,
      fromName: fromCity.name,
      fromGenitive: fromCity.fromGenitive,
      toSlug: toCity.slug,
      toName: toCity.name,
      variantKey,
    });

    return buildRouteMetadata({
      fromSlug: fromCity.slug,
      fromName: fromCity.name,
      toSlug: toCity.slug,
      toName: toCity.name,
      title: seoData.metadataTitle,
      description: seoData.metadataDescription,
      keywords: seoData.metadataKeywords,
      canonicalPath: buildVariantPath(variantKey, fromCity.slug, toCity.slug),
      indexable: isRouteVariantIndexable(variantKey, fromCity.slug, toCity.slug),
    });
  };
}

export function createRoutePage(variantKey: RouteVariantKey) {
  return async function RoutePage({
    params,
  }: {
    params: Promise<{ city: string; to: string }> | { city: string; to: string };
  }) {
    const resolved = await Promise.resolve(params as any);
    const fromSlug = normalizeSlug(resolved.city);
    const toSlug = normalizeSlug(resolved.to);
    const fromCity = getCity(fromSlug);
    const toCity = getCity(toSlug);

    if (!fromCity || !toCity || !isValidRouteSlugs(fromSlug, toSlug)) return notFound();

    const seoData = buildRouteSeoData({
      fromSlug: fromCity.slug,
      fromName: fromCity.name,
      fromGenitive: fromCity.fromGenitive,
      toSlug: toCity.slug,
      toName: toCity.name,
      variantKey,
    });

    const moreFromCity = CITY_LANDINGS.filter((item) => item.slug !== fromCity.slug && item.slug !== toCity.slug)
      .slice(0, 10)
      .map((item) => ({ toSlug: item.slug, toName: prettyCityNameFromSlug(item.slug) }));

    const pagePath = buildVariantPath(variantKey, fromCity.slug, toCity.slug);
    const siblingVariants = ROUTE_VARIANTS.filter(
      (item) => item.key !== "route" && item.key !== variantKey
    )
      .map((item) => ({
        key: item.key,
        href: buildVariantPath(item.key, fromCity.slug, toCity.slug),
        label: buildVariantHeading(item.key, fromCity.name, toCity.name),
      }))
      .slice(0, 5);

    const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: fromCity.name, path: `/${fromCity.slug}` },
      { name: buildVariantHeading(variantKey, fromCity.name, toCity.name), path: pagePath },
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
      name: buildVariantHeading(variantKey, fromCity.name, toCity.name),
      serviceType:
        variantKey === "transfer"
          ? "Междугородний трансфер"
          : variantKey === "mezhdugorodnee-taksi"
            ? "Междугороднее такси"
            : variantKey === "taxi-mezhgorod"
              ? "Такси межгород"
              : "Такси между городами",
      provider: {
        "@type": "LocalBusiness",
        name: "Вектор РФ",
        telephone: "+78002225650",
        areaServed: "Россия",
        url: `https://vector-rf.ru${pagePath}`,
      },
      areaServed: [fromCity.name, toCity.name],
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `https://vector-rf.ru${pagePath}`,
        availableLanguage: "ru",
      },
      description: seoData.metadataDescription,
    };

    return (
      <>
        <Script
          id={`ld-route-breadcrumbs-${variantKey}-${fromCity.slug}-${toCity.slug}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
        />
        <Script
          id={`ld-route-faq-${variantKey}-${fromCity.slug}-${toCity.slug}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <Script
          id={`ld-route-more-${variantKey}-${fromCity.slug}-${toCity.slug}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(moreRoutesJsonLd) }}
        />
        <Script
          id={`ld-route-service-${variantKey}-${fromCity.slug}-${toCity.slug}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />

        <SeoRouteClient
          fromSlug={fromCity.slug}
          cityBackHref={`/${fromCity.slug}`}
          cityBackLabel={`← Из ${fromCity.fromGenitive}`}
          fromName={fromCity.name}
          toSlug={toCity.slug}
          toName={toCity.name}
          heading={buildVariantHeading(variantKey, fromCity.name, toCity.name)}
          subtitle={seoData.subtitle}
          routeFacts={seoData.routeFacts}
          content={seoData.content}
          keywordText={seoData.keywordText}
          faq={seoData.faq}
          moreFromCity={moreFromCity}
          siblingVariants={siblingVariants}
        />
      </>
    );
  };
}
