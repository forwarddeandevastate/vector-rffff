import type { Metadata } from "next";
import Script from "next/script";
import ServicePage from "../ui/service-page";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

export const metadata: Metadata = {
  title: "Трансфер по городу — заказать поездку | Вектор РФ",
  description:
    "Городской трансфер по Нижнему Новгороду и области. Быстрая подача, фиксируем стоимость заранее. Комфорт, бизнес, минивэн. Онлайн-заявка 24/7.",
  alternates: { canonical: `${SITE_URL}/city-transfer` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/city-transfer`,
    title: "Трансфер по городу | Вектор РФ",
    description:
      "Городской трансфер: быстро, комфортно, фиксируем стоимость заранее. Заказ онлайн 24/7.",
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

// Внутригородские “точки” делаем безопасно: ведём на /city-transfer#order,
// чтобы ничего не ломалось, даже если нет /route/<slug>/<slug>.
const CITY_POINTS: CityLink[] = [
  { slug: "nizhniy-novgorod", label: "Нижний Новгород" },
  { slug: "dzerzhinsk", label: "Дзержинск" },
  { slug: "bor", label: "Бор" },
  { slug: "kstovo", label: "Кстово" },

  { slug: "moskva", label: "Москва (городской трансфер)" },
  { slug: "sankt-peterburg", label: "Санкт-Петербург (городской трансфер)" },
  { slug: "kazan", label: "Казань (городской трансфер)" },
  { slug: "samara", label: "Самара (городской трансфер)" },
  { slug: "krasnodar", label: "Краснодар (городской трансфер)" },
  { slug: "rostov-na-donu", label: "Ростов-на-Дону (городской трансфер)" },
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
          Быстрые ссылки на города/агломерации. Если нужен другой адрес — оставьте заявку, уточним детали.
        </p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {CITY_POINTS.map((c) => (
            <a
              key={c.slug}
              href="/city-transfer#order"
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
          Если нужны именно ссылки на /route/… — скажи, какие slug гарантированно существуют в seo-routes, и я включу их без риска 404.
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/city-transfer#service`,
    name: "Трансфер по городу",
    serviceType: ["Такси по городу", "Городской трансфер"],
    url: `${SITE_URL}/city-transfer`,
    areaServed: { "@type": "Country", name: "Россия" },
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  // ✅ BreadcrumbList (для красивых сниппетов)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Трансфер по городу", item: `${SITE_URL}/city-transfer` },
    ],
  };

  return (
    <>
      <Script
        id="ld-city-service"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id="ld-city-breadcrumbs"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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