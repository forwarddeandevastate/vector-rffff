import type { Metadata } from "next";

export const SITE_URL = "https://vector-rf.ru";
export const SITE_NAME = "Вектор РФ";
export const DEFAULT_OG_IMAGE = "/og.jpg";

export function absoluteUrl(path = "/") {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export function buildOgImage(alt: string) {
  return [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt }];
}

export function buildCityMetadata({
  slug,
  cityName,
  fromGenitive,
}: {
  slug: string;
  cityName: string;
  fromGenitive: string;
}): Metadata {
  const path = `/${slug}`;
  // Вариативность title под город — не одна шаблонная строка для всех
  const title = `Такси из ${fromGenitive} — межгород, аэропорт, трансфер`;
  const description = `Прямые поездки из ${fromGenitive} по России: без пересадок, стоимость до выезда. Стандарт, комфорт, бизнес, минивэн. Заявки 24/7.`;
  const ogAlt = `Вектор РФ — такси и трансфер из ${cityName}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      locale: "ru_RU",
      images: buildOgImage(ogAlt),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function buildRouteMetadata({
  fromSlug,
  fromName,
  toSlug,
  toName,
  title,
  description,
  keywords,
  canonicalPath,
  indexable,
}: {
  fromSlug: string;
  fromName: string;
  toSlug: string;
  toName: string;
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  indexable?: boolean;
}): Metadata {
  const path = canonicalPath ?? `/${fromSlug}/${toSlug}`;
  const finalTitle = title ?? `Такси ${fromName} — ${toName}: заказать межгород`;
  const finalDescription =
    description ??
    `Такси ${fromName} — ${toName}: прямая поездка без пересадок, подача к адресу, стоимость до выезда. Стандарт, комфорт, бизнес, минивэн.`;
  const finalKeywords =
    keywords ?? [
      `такси ${fromName} ${toName}`,
      `${fromName} ${toName} такси`,
      `междугороднее такси ${fromName} ${toName}`,
      `такси межгород ${fromName} ${toName}`,
      `трансфер ${fromName} ${toName}`,
      `межгород ${fromName} ${toName}`,
    ];
  const ogAlt = `Вектор РФ — маршрут ${fromName} — ${toName}`;

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    alternates: { canonical: path },
    robots: { index: indexable ?? true, follow: true },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      title: `${finalTitle} — ${SITE_NAME}`,
      description: finalDescription,
      siteName: SITE_NAME,
      locale: "ru_RU",
      images: buildOgImage(ogAlt),
    },
    twitter: {
      card: "summary_large_image",
      title: `${finalTitle} — ${SITE_NAME}`,
      description: finalDescription,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
