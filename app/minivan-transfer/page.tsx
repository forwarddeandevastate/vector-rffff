import type { Metadata } from "next";
import Script from "next/script";
import ServicePage from "../ui/service-page";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

export const metadata: Metadata = {
  title: "Минивэн и групповой трансфер — 4–7 мест | Вектор РФ",
  description:
    "Минивэн и групповой трансфер: для семьи/компании и большого багажа. В аэропорт, по городу и на межгород. Согласуем стоимость заранее. Онлайн-заявка 24/7.",
  alternates: { canonical: `${SITE_URL}/minivan-transfer` },

  openGraph: {
    type: "website",
    url: `${SITE_URL}/minivan-transfer`,
    title: "Минивэн / групповой трансфер — Вектор РФ",
    description:
      "Групповые поездки и трансферы на минивэне: больше мест и багажа. Согласуем стоимость до подачи. 24/7.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Минивэн / групповой трансфер — Вектор РФ",
    description: "Групповые поездки и трансферы на минивэне: больше мест и багажа. 24/7.",
    images: ["/og.jpg"],
  },
};

export default function Page() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/minivan-transfer#service`,
    name: "Минивэн и групповой трансфер",
    description:
      "Трансфер на минивэне для 4–7 пассажиров и большого багажа: по городу, в аэропорт и на межгород. Стоимость согласуем до подачи автомобиля. 24/7.",
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      telephone: "+7-831-423-39-29",
    },
    areaServed: { "@type": "Country", name: "Россия" },
    serviceType: [
      "Минивэн",
      "Групповой трансфер",
      "Трансфер с багажом",
      "Трансфер в аэропорт",
      "Междугородний трансфер",
    ],
    url: `${SITE_URL}/minivan-transfer`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Минивэн / групповой трансфер", item: `${SITE_URL}/minivan-transfer` },
    ],
  };

  return (
    <>
      <Script
        id="ld-minivan-service"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id="ld-minivan-breadcrumbs"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ServicePage
        breadcrumbs={[
          { name: "Главная", href: "/" },
          { name: "Минивэн / групповой трансфер", href: "/minivan-transfer" },
        ]}
        title="Минивэн / групповой трансфер"
        subtitle="Когда нужно больше мест и багаж: поездки по городу, в аэропорт и на межгород. Подбор авто под количество пассажиров. 24/7."
        bullets={[
          "Для 4–7 пассажиров (семья/компания)",
          "Удобно с большим багажом",
          "Подходит для аэропорта и межгорода",
          "Согласуем стоимость до подачи автомобиля",
          "Можно указать детское кресло и остановки",
        ]}
        faq={[
          {
            q: "Сколько мест в минивэне?",
            a: "Обычно 4–7 мест. Напишите количество пассажиров и багаж — подберём оптимальный вариант.",
          },
          {
            q: "Подходит для аэропорта с багажом?",
            a: "Да, это один из самых частых кейсов: чемоданы, коляски, спортивный инвентарь.",
          },
          {
            q: "Можно заказать заранее на конкретное время?",
            a: "Да. Укажите дату/время — заявка фиксируется, подтверждаем подачу.",
          },
        ]}
      />
    </>
  );
}