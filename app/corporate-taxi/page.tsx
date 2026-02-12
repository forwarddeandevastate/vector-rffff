import type { Metadata } from "next";
import Script from "next/script";
import ServicePage from "../ui/service-page";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";
const CANONICAL = `${SITE_URL}/corporate-taxi`;
const PHONE_E164 = "+78314233929";

export const metadata: Metadata = {
  title: "Корпоративное такси и перевозки для компаний | Вектор РФ",
  description:
    "Корпоративные перевозки и трансферы для компаний: договор, безнал, отчётность. Регулярные поездки для сотрудников и гостей. Встреча в аэропорту. 24/7.",
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: CANONICAL,
    title: "Корпоративное такси — Вектор РФ",
    description:
      "Перевозки для компаний: договор, безнал, отчётность. Поездки сотрудников и гостей, встречи в аэропорту. 24/7.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Корпоративное такси — Вектор РФ",
    description: "Перевозки для компаний: договор, безнал, отчётность. Поездки сотрудников и гостей. 24/7.",
    images: ["/og.jpg"],
  },
};

export default function Page() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${CANONICAL}#service`,
    name: "Корпоративное такси и перевозки",
    description:
      "Корпоративные перевозки для компаний: регулярные поездки сотрудников и гостей, встречи в аэропорту, фиксируем заявки и согласуем условия. Договор, безнал, отчётность. 24/7.",
    url: CANONICAL,
    areaServed: { "@type": "Country", name: "Россия" },
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      telephone: PHONE_E164,
    },
    serviceType: [
      "Корпоративное такси",
      "Корпоративные перевозки",
      "Трансфер в аэропорт",
      "Трансфер из аэропорта",
      "Аренда автомобиля с водителем",
      "Деловые поездки",
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Корпоративное такси", item: CANONICAL },
    ],
  };

  // ✅ FAQPage JSON-LD (под FAQ, который показывается на странице через ServicePage)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Работаете по договору и безналу?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да. Согласуем условия, подготовим договор и реквизиты. Закрывающие документы — по запросу.",
        },
      },
      {
        "@type": "Question",
        name: "Можно организовать поездки сотрудников по заявкам?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Да. Настроим понятный формат заявок: кто, куда, когда, контакт. Можно централизованно через ответственного.",
        },
      },
      {
        "@type": "Question",
        name: "Встречаете в аэропорту по рейсу?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Да. Если укажете номер рейса, ориентируемся по фактическому времени прилёта. По запросу — встреча с табличкой.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="ld-corporate-taxi-service"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id="ld-corporate-taxi-breadcrumbs"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="ld-corporate-taxi-faq"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <ServicePage
        breadcrumbs={[
          { name: "Главная", href: "/" },
          { name: "Корпоративное такси", href: "/corporate-taxi" },
        ]}
        title="Корпоративное такси и перевозки для компаний"
        subtitle="Регулярные поездки для сотрудников и гостей: договор, безнал, единые условия и удобная отчётность. Встречи в аэропорту и межгород. 24/7."
        bullets={[
          "Договор / безналичный расчёт",
          "Отчётность для бухгалтерии (по запросу)",
          "Единые правила подачи и ожидания",
          "Встреча в аэропорту по рейсу, помощь с багажом",
          "Город / аэропорты / межгород / минивэн",
        ]}
        faq={[
          {
            q: "Работаете по договору и безналу?",
            a: "Да. Согласуем условия, подготовим договор и реквизиты. Закрывающие документы — по запросу.",
          },
          {
            q: "Можно организовать поездки сотрудников по заявкам?",
            a: "Да. Настроим понятный формат заявок: кто, куда, когда, контакт. Можно централизованно через ответственного.",
          },
          {
            q: "Встречаете в аэропорту по рейсу?",
            a: "Да. Если укажете номер рейса, ориентируемся по фактическому времени прилёта. По запросу — встреча с табличкой.",
          },
        ]}
      />
    </>
  );
}