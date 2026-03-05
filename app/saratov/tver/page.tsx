import type { Metadata } from "next";
import Script from "next/script";

import SeoRouteClient from "@/app/ui/seo-route-client";
import { prettyCityNameFromSlug } from "@/lib/city-landings";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

const TO_NAME = "Тверь";

export const metadata: Metadata = {
  title: `Такси Саратов — ${TO_NAME} | Межгород 24/7 — ${SITE_NAME}`,
  description:
    `Трансфер Саратов — ${TO_NAME}: комфортные авто, подача по времени, стоимость согласуем заранее. Заявка онлайн 24/7.`,
  alternates: { canonical: `${SITE_URL}/saratov/tver` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/saratov/tver`,
    title: `Такси Саратов — ${TO_NAME} | Межгород 24/7 — ${SITE_NAME}`,
    description:
      `Трансфер Саратов — ${TO_NAME}: комфортные авто, подача по времени, стоимость согласуем заранее. Заявка онлайн 24/7.`,
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Такси Саратов — ${TO_NAME} | Межгород 24/7 — ${SITE_NAME}`,
    description:
      `Трансфер Саратов — ${TO_NAME}: комфортные авто, подача по времени, стоимость согласуем заранее. Заявка онлайн 24/7.`,
    images: ["/og.jpg"],
  },
};

export default function Page() {
  const content =
    `Организуем трансфер Саратов — ${TO_NAME}. Стоимость согласуем заранее, подача по времени. ` +
    `Подберём класс авто и подтвердим детали поездки перед выездом.`;

  const faq = [
    {
      question: `Сколько стоит такси Саратов — ${TO_NAME}?`,
      answer: "Цена зависит от расстояния и класса авто — подтвердим стоимость до поездки.",
    },
    {
      question: "Можно ли заказать заранее?",
      answer: "Да, вы можете оставить заявку заранее на нужную дату и время.",
    },
    {
      question: "Есть ли минивэн?",
      answer: "Да, доступны минивэны для 5–7 пассажиров (по наличию).",
    },
  ];

  const moreFromCity = (["samara", "volgograd", "kazan", "ufa", "moskva", "voronezh", "lipetsk", "tula", "ryazan", "tver"] as string[])
    .filter((s) => s !== "tver")
    .slice(0, 9)
    .map((toSlug) => ({
      toSlug,
      toName: prettyCityNameFromSlug(toSlug),
    }));

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Саратов", item: `${SITE_URL}/saratov` },
      { "@type": "ListItem", position: 3, name: `${TO_NAME}`, item: `${SITE_URL}/saratov/tver` },
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
        id="ld-route-breadcrumbs-saratov-tver"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <Script
        id="ld-route-faq-saratov-tver"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <SeoRouteClient
        fromSlug="saratov"
        toSlug="tver"
        fromName="Саратов"
        toName={TO_NAME}
        cityBackHref="/saratov"
        cityBackLabel="← Назад: Саратов"
        content={content}
        faq={faq}
        moreFromCity={moreFromCity}
      />
    </>
  );
}
