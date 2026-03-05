import type { Metadata } from "next";
import Script from "next/script";

import SeoCityClient from "@/app/ui/seo-city-client";
import { CITY_CONTENT } from "@/lib/city-content";
import { CITY_FAQ } from "@/lib/city-faq";
import { prettyCityNameFromSlug } from "@/lib/city-landings";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

export const metadata: Metadata = {
  title: `Междугороднее такси из Калуги — трансфер 24/7 | ${SITE_NAME}`,
  description:
    `Заказать междугороднее такси из Калуги: комфорт, бизнес, минивэн. Стоимость согласуем заранее, подача по времени. Заявка онлайн 24/7.`,
  alternates: { canonical: `${SITE_URL}/kaluga` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/kaluga`,
    title: `Междугороднее такси из Калуги — трансфер 24/7 | ${SITE_NAME}`,
    description:
      `Заказать междугороднее такси из Калуги: комфорт, бизнес, минивэн. Стоимость согласуем заранее, подача по времени. Заявка онлайн 24/7.`,
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Междугороднее такси из Калуги — трансфер 24/7 | ${SITE_NAME}`,
    description:
      `Заказать междугороднее такси из Калуги: комфорт, бизнес, минивэн. Стоимость согласуем заранее, подача по времени. Заявка онлайн 24/7.`,
    images: ["/og.jpg"],
  },
};

export default function Page() {
  const content =
    CITY_CONTENT["kaluga"] ??
    `Междугородние поездки из Калуги: согласуем стоимость заранее и подберём класс автомобиля под вашу задачу.`;

  const faq =
    CITY_FAQ["kaluga"] ?? [
      {
        question: `Сколько стоит трансфер из Калуги?`,
        answer: "Стоимость зависит от маршрута и класса авто — подтвердим цену до поездки.",
      },
      { question: "Работаете круглосуточно?", answer: "Да, заявки принимаем 24/7." },
    ];

  const popular = (["moskva", "tula", "bryansk", "smolensk", "orel", "ryazan", "tver", "ivanovo", "yaroslavl", "voronezh"] as string[]).map((toSlug) => ({
    toSlug,
    toName: prettyCityNameFromSlug(toSlug),
  }));

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Калуга", item: `${SITE_URL}/kaluga` },
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
        id="ld-city-breadcrumbs-kaluga"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <Script
        id="ld-city-faq-kaluga"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <SeoCityClient
        citySlug="kaluga"
        cityName="Калуга"
        fromGenitive="Калуги"
        content={content}
        faq={faq}
        popular={popular}
      />
    </>
  );
}
