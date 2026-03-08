import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";

import SeoCityClient from "@/app/ui/seo-city-client";
import { CITY_BY_SLUG, CITY_LANDINGS, prettyCityNameFromSlug } from "@/lib/city-landings";
import { buildBreadcrumbJsonLd, buildCityMetadata, buildFaqJsonLd } from "@/lib/seo";
import { CITY_CONTENT } from "@/lib/city-content";
import { CITY_FAQ } from "@/lib/city-faq";

function normalizeSlug(input: string) {
  const raw = (input ?? "").trim();
  let s = raw;
  try {
    s = decodeURIComponent(raw);
  } catch {
    // ignore
  }
  // приводим к единому виду
  s = s
    .trim()
    .toLowerCase()
    // разные дефисы (— – - −) -> обычный "-"
    .replace(/[—–-−]/g, "-")
    // множественные дефисы
    .replace(/-+/g, "-");
  return s;
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = normalizeSlug(resolvedParams.city);
  const city = CITY_BY_SLUG.get(slug);
  if (!city) return { robots: { index: false, follow: false } };

  return buildCityMetadata({
    slug: city.slug,
    cityName: city.name,
    fromGenitive: city.fromGenitive,
  });
}

export function generateStaticParams() {
  return CITY_LANDINGS.map((city) => ({ city: city.slug }));
}

export default async function Page({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = await params;
  const slug = normalizeSlug(resolvedParams.city);
  const city = CITY_BY_SLUG.get(slug);
  if (!city) return notFound();

  const content =
    CITY_CONTENT[city.slug] ??
    `Междугородние поездки из ${city.fromGenitive}: согласуем стоимость заранее и подберём класс автомобиля под вашу задачу.`;

  const faq =
    CITY_FAQ[city.slug] ?? [
      {
        question: `Сколько стоит трансфер из ${city.fromGenitive}?`,
        answer: "Стоимость зависит от маршрута и класса авто — подтвердим цену до поездки.",
      },
      { question: "Работаете круглосуточно?", answer: "Да, заявки принимаем 24/7." },
    ];

  const popular = city.popularTo.slice(0, 10).map((toSlug) => ({
    toSlug,
    toName: prettyCityNameFromSlug(toSlug),
  }));

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: city.name, path: `/${city.slug}` },
  ]);

  const faqJsonLd = buildFaqJsonLd(faq);

  const popularRoutesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Популярные маршруты из ${city.name}`,
    itemListElement: popular.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${city.name} — ${item.toName}`,
      url: `https://vector-rf.ru/${city.slug}/${item.toSlug}`,
    })),
  };

  return (
    <>
      <Script
        id={`ld-city-breadcrumbs-${city.slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <Script
        id={`ld-city-faq-${city.slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id={`ld-city-routes-${city.slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(popularRoutesJsonLd) }}
      />

      <SeoCityClient
        citySlug={city.slug}
        cityName={city.name}
        fromGenitive={city.fromGenitive}
        content={content}
        faq={faq}
        popular={popular}
      />
    </>
  );
}