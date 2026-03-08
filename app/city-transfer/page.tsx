import type { Metadata } from "next";
import Script from "next/script";
import ServicePage from "../ui/service-page";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

export const metadata: Metadata = {
  title: "Трансфер по городу — заказать поездку | Вектор РФ",
  description:
    "Городской трансфер: быстрая подача, фиксируем заявку и согласуем стоимость заранее. Комфорт, бизнес, минивэн. Онлайн-заявка 24/7.",
  alternates: { canonical: `${SITE_URL}/city-transfer` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/city-transfer`,
    title: "Трансфер по городу | Вектор РФ",
    description:
      "Городской трансфер: быстро, комфортно, согласуем стоимость заранее. Заказ онлайн 24/7.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Трансфер по городу | Вектор РФ",
    description: "Городской трансфер. Онлайн-заявка 24/7.",
    images: ["/og.jpg"],
  },
};

type CityLink = { slug: string; label: string };

const CITY_POINTS: CityLink[] = [
  { slug: "nizhniy-novgorod", label: "Нижний Новгород" },
  { slug: "dzerzhinsk", label: "Дзержинск" },
  { slug: "bor", label: "Бор" },
  { slug: "kstovo", label: "Кстово" },

  { slug: "moskva", label: "Москва" },
  { slug: "sankt-peterburg", label: "Санкт-Петербург" },
  { slug: "kazan", label: "Казань" },
  { slug: "samara", label: "Самара" },
  { slug: "krasnodar", label: "Краснодар" },
  { slug: "rostov-na-donu", label: "Ростов-на-Дону" },
];

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function CityBlock() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">
          Городской трансфер — популярные точки
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Быстрые ссылки для заявки. Если нужен другой адрес — оставьте заявку, мы уточним детали и согласуем стоимость.
        </p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {CITY_POINTS.map((c) => (
            <a
              key={c.slug}
              href={`/#order?utm_source=city-transfer&utm_medium=internal&utm_campaign=${encodeURIComponent(
                c.slug
              )}`}
              className={cn(
                "rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-semibold",
                "text-zinc-800 shadow-sm backdrop-blur hover:bg-white hover:border-sky-200/80"
              )}
            >
              {c.label}
            </a>
          ))}
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Работаем 24/7. Учитываем пожелания: багаж, детское кресло, остановки по пути.
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  const canonical = `${SITE_URL}/city-transfer`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonical}#service`,
    name: "Трансфер по городу",
    serviceType: ["Такси по городу", "Городской трансфер"],
    url: canonical,
    areaServed: { "@type": "Country", name: "Россия" },
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Трансфер по городу", item: canonical },
    ],
  };

  // ✅ FAQPage JSON-LD (вопросы совпадают с блоком FAQ на странице)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Как быстро подаёте автомобиль?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Обычно подача занимает от 15–30 минут (зависит от адреса и загрузки). Точное время подтверждаем после заявки.",
        },
      },
      {
        "@type": "Question",
        name: "Можно ли заказать поездку заранее?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да, укажите дату и время — мы зафиксируем заявку и подтвердим подачу.",
        },
      },
      {
        "@type": "Question",
        name: "Что если нужна остановка по пути?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Укажите остановку в комментарии — учтём при расчёте и согласовании стоимости.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="ld-city-service"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id="ld-city-breadcrumbs"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="ld-city-faq"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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

      <CityBlock />
    </>
  );
}