import type { Metadata } from "next";
import Script from "next/script";
import ServicePage from "../ui/service-page";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

export const metadata: Metadata = {
  title: "Трансфер в аэропорт и из аэропорта — заказать | Вектор РФ",
  description:
    "Трансфер в аэропорт и из аэропорта: встреча по времени прилёта, помощь с багажом, согласование стоимости заранее. Комфорт, бизнес, минивэн. Онлайн-заявка 24/7.",
  alternates: { canonical: `${SITE_URL}/airport-transfer` },

  openGraph: {
    type: "website",
    url: `${SITE_URL}/airport-transfer`,
    title: "Трансфер в аэропорт и из аэропорта — Вектор РФ",
    description:
      "Встреча по времени прилёта, подача авто, помощь с багажом. Стоимость согласуем заранее. Работаем 24/7.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Трансфер в аэропорт и из аэропорта — Вектор РФ",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Трансфер в аэропорт и из аэропорта — Вектор РФ",
    description:
      "Встреча по времени прилёта, подача авто, помощь с багажом. Стоимость согласуем заранее. Работаем 24/7.",
    images: ["/og.jpg"],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Трансфер в аэропорт и из аэропорта",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "Россия" },
    serviceType: ["Трансфер в аэропорт", "Трансфер из аэропорта"],
    url: `${SITE_URL}/airport-transfer`,
  };

  return (
    <>
      <Script
        id="ld-airport"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ServicePage
        breadcrumbs={[
          { name: "Главная", href: "/" },
          { name: "Трансфер в аэропорт", href: "/airport-transfer" },
        ]}
        title="Трансфер в аэропорт и из аэропорта"
        subtitle="Встречаем по времени прилёта и подаём автомобиль к нужному терминалу. Помогаем с багажом, стоимость согласуем заранее. Работаем 24/7."
        bullets={[
          "Встреча по времени прилёта (или подача к вылету)",
          "Можно указать номер рейса и комментарии",
          "Комфорт / Бизнес / Минивэн",
          "Помощь с багажом по запросу",
          "Стоимость согласуем до подачи автомобиля",
        ]}
        faq={[
          {
            q: "Встречаете с табличкой?",
            a: "Да, по запросу. Укажите это в комментарии к заявке — подтвердим детали.",
          },
          {
            q: "Если рейс задержали?",
            a: "Если вы указали рейс, мы ориентируемся по фактическому времени прилёта и согласуем ожидание.",
          },
          {
            q: "Можно заказать детское кресло?",
            a: "Да, укажите возраст ребёнка — подберём подходящее кресло.",
          },
        ]}
      />
    </>
  );
}