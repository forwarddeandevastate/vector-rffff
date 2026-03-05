import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";

import SeoCityClient from "@/app/ui/seo-city-client";
import { CITY_BY_SLUG, prettyCityNameFromSlug } from "@/lib/city-landings";
import { CITY_CONTENT } from "@/lib/city-content";
import { CITY_FAQ } from "@/lib/city-faq";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

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

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const slug = normalizeSlug(params.city);
  const city = CITY_BY_SLUG.get(slug);
  if (!city) return { robots: { index: false, follow: false } };

  const title = `Междугороднее такси из ${city.fromGenitive} — трансфер 24/7 | ${SITE_NAME}`;
  const description = `Заказать междугороднее такси из ${city.fromGenitive}: комфорт, бизнес, минивэн. Стоимость согласуем заранее, подача по времени. Заявка онлайн 24/7.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${city.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${city.slug}`,
      title,
      description,
      siteName: SITE_NAME,
      locale: "ru_RU",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.jpg"],
    },
  };
}

export default function Page({ params }: { params: { city: string } }) {
  const slug = normalizeSlug(params.city);
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

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: city.name, item: `${SITE_URL}/${city.slug}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
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