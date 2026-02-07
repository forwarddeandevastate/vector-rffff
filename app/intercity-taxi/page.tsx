import type { Metadata } from "next";
import Script from "next/script";
import ServicePage from "../ui/service-page";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

export const metadata: Metadata = {
  title: "Междугороднее такси",
  description:
    "Междугороднее такси по России: поездки между городами, комфортные автомобили, фиксируем заявку и согласуем стоимость заранее. Комфорт, бизнес, минивэн. Онлайн-заявка 24/7.",
  alternates: { canonical: `${SITE_URL}/intercity-taxi` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/intercity-taxi`,
    title: "Междугороднее такси — Вектор РФ",
    description:
      "Поездки между городами по России: комфорт, безопасность, согласование стоимости заранее. 24/7.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Междугороднее такси",
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: { "@type": "Country", name: "Россия" },
    serviceType: ["Междугороднее такси", "Поездка в другой город", "Трансфер между городами"],
    url: `${SITE_URL}/intercity-taxi`,
  };

  return (
    <>
      <Script
        id="ld-intercity"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicePage
        breadcrumbs={[
          { name: "Главная", href: "/" },
          { name: "Междугороднее такси", href: "/intercity-taxi" },
        ]}
        title="Междугороднее такси по России"
        subtitle="Поездки между городами: подберём класс авто, согласуем маршрут и стоимость заранее. Остановки и пожелания учитываем. 24/7."
        bullets={[
          "Поездки между городами по России",
          "Маршрут, остановки и пожелания — заранее",
          "Комфорт / Бизнес / Минивэн",
          "Стоимость подтверждаем до подачи автомобиля",
          "Подходит для семьи, командировок и срочных поездок",
        ]}
        faq={[
          {
            q: "Можно ли ехать туда-обратно?",
            a: "Да. Укажите это в заявке — рассчитаем вариант туда-обратно и согласуем стоимость.",
          },
          {
            q: "Можно добавить остановки по дороге?",
            a: "Да, просто перечислите остановки — мы учтём это при согласовании.",
          },
          {
            q: "Какие классы доступны на межгород?",
            a: "Стандарт, Комфорт, Бизнес и Минивэн — выбирайте в форме, мы подтвердим доступность.",
          },
        ]}
      />
    </>
  );
}