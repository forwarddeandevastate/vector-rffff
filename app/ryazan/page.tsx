import type { Metadata } from "next";
import Script from "next/script";

import SeoCityClient from "@/app/ui/seo-city-client";
import { CITY_CONTENT } from "@/lib/city-content";
import { CITY_FAQ } from "@/lib/city-faq";
import { prettyCityNameFromSlug } from "@/lib/city-landings";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

export const metadata: Metadata = {
  title: `Междугороднее такси из Рязани — трансфер 24/7 | ${SITE_NAME}`,
  description:
    `Заказать междугороднее такси из Рязани: комфорт, бизнес, минивэн. Стоимость согласуем заранее, подача по времени. Заявка онлайн 24/7.`,
  alternates: { canonical: `${SITE_URL}/ryazan` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/ryazan`,
    title: `Междугороднее такси из Рязани — трансфер 24/7 | ${SITE_NAME}`,
    description:
      `Заказать междугороднее такси из Рязани: комфорт, бизнес, минивэн. Стоимость согласуем заранее, подача по времени. Заявка онлайн 24/7.`,
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Междугороднее такси из Рязани — трансфер 24/7 | ${SITE_NAME}`,
    description:
      `Заказать междугороднее такси из Рязани: комфорт, бизнес, минивэн. Стоимость согласуем заранее, подача по времени. Заявка онлайн 24/7.`,
    images: ["/og.jpg"],
  },
};

export default function Page() {
  const content =
    CITY_CONTENT["ryazan"] ??
    `Междугородние поездки из Рязани: согласуем стоимость заранее и подберём класс автомобиля под вашу задачу.`;

  const faq =
    CITY_FAQ["ryazan"] ?? [
      {
        question: `Сколько стоит трансфер из Рязани?`,
        answer: "Стоимость зависит от маршрута и класса авто — подтвердим цену до поездки.",
      },
      { question: "Работаете круглосуточно?", answer: "Да, заявки принимаем 24/7." },
    ];

  const popular = (["moskva", "tula", "tver", "ivanovo", "kaluga", "orel", "kursk", "lipetsk", "voronezh", "smolensk"] as string[]).map((toSlug) => ({
    toSlug,
    toName: prettyCityNameFromSlug(toSlug),
  }));

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Рязань", item: `${SITE_URL}/ryazan` },
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
        id="ld-city-breadcrumbs-ryazan"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <Script
        id="ld-city-faq-ryazan"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <SeoCityClient
        citySlug="ryazan"
        cityName="Рязань"
        fromGenitive="Рязани"
        content={content}
        faq={faq}
        popular={popular}
      />
    </>
  );
}
