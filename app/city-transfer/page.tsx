import type { Metadata } from "next";
import Script from "next/script";
import ServicePage from "../ui/service-page";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

export const metadata: Metadata = {
  title: "Трансфер по городу",
  description:
    "Городской трансфер и поездки по городу: подача авто, фиксируем заявку, стоимость согласуем заранее. Комфорт, бизнес, минивэн. Онлайн-заявка 24/7.",
  alternates: { canonical: `${SITE_URL}/city-transfer` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/city-transfer`,
    title: "Трансфер по городу — Вектор РФ",
    description:
      "Городской трансфер: подача авто, фиксируем заявку, стоимость согласуем заранее. Онлайн-заявка 24/7.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Трансфер по городу",
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: { "@type": "Country", name: "Россия" },
    serviceType: ["Такси по городу", "Городской трансфер"],
    url: `${SITE_URL}/city-transfer`,
  };

  return (
    <>
      <Script
        id="ld-city"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicePage
        breadcrumbs={[
          { name: "Главная", href: "/" },
          { name: "Трансфер по городу", href: "/city-transfer" },
        ]}
        title="Трансфер по городу"
        subtitle="Комфортные поездки по городу: подача автомобиля, фиксация заявки и согласование стоимости до подачи. Работаем 24/7."
        bullets={[
          "Стоимость согласуем до подачи автомобиля",
          "Подача авто по адресу и времени",
          "Комфорт / Бизнес / Минивэн",
          "Учитываем пожелания: багаж, детское кресло, остановки",
          "Связь по телефону и в Telegram",
        ]}
        faq={[
          {
            q: "Как быстро подаёте автомобиль?",
            a: "Обычно подача занимает от 15–30 минут (зависит от адреса и загрузки). Точное время подтверждаем после заявки.",
          },
          {
            q: "Можно ли заказать поездку заранее?",
            a: "Да, вы можете указать дату и время — мы зафиксируем заявку и подтвердим подачу.",
          },
          {
            q: "Что если нужна остановка по пути?",
            a: "Укажите это в комментарии — учтём при расчёте и согласовании стоимости.",
          },
        ]}
      />
    </>
  );
}