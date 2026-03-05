import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";

import SeoRouteClient from "@/app/ui/seo-route-client";
import { CITY_BY_SLUG, prettyCityNameFromSlug } from "@/lib/city-landings";
import { CITY_CONTENT } from "@/lib/city-content";
import { type FAQItem } from "@/lib/city-faq";

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
  s = s
    .trim()
    .toLowerCase()
    .replace(/[—–-−]/g, "-")
    .replace(/-+/g, "-");
  return s;
}

export async function generateMetadata({
  params,
}: {
  params: { city: string; to: string };
}): Promise<Metadata> {
  const fromSlug = normalizeSlug(params.city);
  const toSlug = normalizeSlug(params.to);

  const fromCity = CITY_BY_SLUG.get(fromSlug);
  if (!fromCity) return { robots: { index: false, follow: false } };

  const toName = prettyCityNameFromSlug(toSlug);

  const title = `Такси ${fromCity.name} — ${toName} | Межгород 24/7 — ${SITE_NAME}`;
  const description = `Трансфер ${fromCity.name} — ${toName}: комфортные авто, подача по времени, стоимость согласуем заранее. Заявка онлайн 24/7.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${fromCity.slug}/${toSlug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${fromCity.slug}/${toSlug}`,
      title,
      description,
      siteName: SITE_NAME,
      locale: "ru_RU",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
  };
}

export default function Page({ params }: { params: { city: string; to: string } }) {
  const fromSlug = normalizeSlug(params.city);
  const toSlug = normalizeSlug(params.to);

  const fromCity = CITY_BY_SLUG.get(fromSlug);
  if (!fromCity) return notFound();

  const toName = prettyCityNameFromSlug(toSlug);

  const baseCityText =
    CITY_CONTENT[fromCity.slug] ??
    `Организуем трансфер из ${fromCity.fromGenitive}. Стоимость согласуем заранее, подача по времени.`;

  const content = `${baseCityText}\n\nЧасто заказывают маршрут ${fromCity.name} — ${toName}. Подберём класс авто и согласуем детали поездки заранее.`;

  const faq: FAQItem[] = [
    {
      question: `Сколько стоит такси ${fromCity.name} — ${toName}?`,
      answer: "Стоимость зависит от расстояния и класса авто. Итоговую цену подтверждаем заранее до поездки.",
    },
    {
      question: "Можно ли заказать поездку заранее?",
      answer: "Да, можно оформить заказ на нужную дату и время — подачу согласуем заранее.",
    },
    {
      question: "Какие классы автомобилей доступны?",
      answer: "Доступны стандарт, комфорт, бизнес и минивэн. Подберём вариант под задачу.",
    },
    {
      question: "Работаете круглосуточно?",
      answer: "Да, заявки принимаем 24/7.",
    },
  ];

  const moreFromCity = fromCity.popularTo
    .filter((s) => s !== toSlug)
    .slice(0, 10)
    .map((s) => ({ toSlug: s, toName: prettyCityNameFromSlug(s) }));

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: fromCity.name, item: `${SITE_URL}/${fromCity.slug}` },
      { "@type": "ListItem", position: 3, name: toName, item: `${SITE_URL}/${fromCity.slug}/${toSlug}` },
    ],
  };

  return (
    <>
      <Script
        id={`ld-route-breadcrumbs-${fromCity.slug}-${toSlug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <SeoRouteClient
        fromSlug={fromCity.slug}
        cityBackHref={`/${fromCity.slug}`}
        cityBackLabel={`← Из ${fromCity.fromGenitive}`}
        fromName={fromCity.name}
        toSlug={toSlug}
        toName={toName}
        content={content}
        faq={faq}
        moreFromCity={moreFromCity}
      />
    </>
  );
}