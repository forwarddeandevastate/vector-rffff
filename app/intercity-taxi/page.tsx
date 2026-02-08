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
  twitter: {
    card: "summary_large_image",
    title: "Междугороднее такси — Вектор РФ",
    description: "Поездки между городами по России. Онлайн-заявка 24/7.",
    images: ["/og.jpg"],
  },
};

type LinkItem = { from: string; to: string; label: string };

const POPULAR_ROUTES: LinkItem[] = [
  { from: "moskva", to: "sankt-peterburg", label: "Москва — Санкт-Петербург" },
  { from: "moskva", to: "nizhniy-novgorod", label: "Москва — Нижний Новгород" },
  { from: "moskva", to: "kazan", label: "Москва — Казань" },
  { from: "moskva", to: "samara", label: "Москва — Самара" },
  { from: "moskva", to: "saratov", label: "Москва — Саратов" },
  { from: "moskva", to: "voronezh", label: "Москва — Воронеж" },
  { from: "moskva", to: "rostov-na-donu", label: "Москва — Ростов-на-Дону" },
  { from: "moskva", to: "krasnodar", label: "Москва — Краснодар" },
  { from: "moskva", to: "sochi", label: "Москва — Сочи" },
  { from: "moskva", to: "volgograd", label: "Москва — Волгоград" },
  { from: "moskva", to: "tula", label: "Москва — Тула" },
  { from: "moskva", to: "ryazan", label: "Москва — Рязань" },
  { from: "moskva", to: "smolensk", label: "Москва — Смоленск" },
  { from: "moskva", to: "kaluga", label: "Москва — Калуга" },
  { from: "moskva", to: "bryansk", label: "Москва — Брянск" },
  { from: "moskva", to: "yaroslavl", label: "Москва — Ярославль" },

  { from: "sankt-peterburg", to: "moskva", label: "Санкт-Петербург — Москва" },
  { from: "sankt-peterburg", to: "tver", label: "Санкт-Петербург — Тверь" },
  { from: "sankt-peterburg", to: "velikiy-novgorod", label: "Санкт-Петербург — Великий Новгород" },
  { from: "sankt-peterburg", to: "pskov", label: "Санкт-Петербург — Псков" },

  { from: "nizhniy-novgorod", to: "moskva", label: "Нижний Новгород — Москва" },
  { from: "nizhniy-novgorod", to: "kazan", label: "Нижний Новгород — Казань" },
  { from: "nizhniy-novgorod", to: "samara", label: "Нижний Новгород — Самара" },

  { from: "krasnodar", to: "sochi", label: "Краснодар — Сочи" },
  { from: "krasnodar", to: "anapa", label: "Краснодар — Анапа" },
  { from: "krasnodar", to: "novorossiysk", label: "Краснодар — Новороссийск" },
  { from: "rostov-na-donu", to: "krasnodar", label: "Ростов-на-Дону — Краснодар" },
  { from: "rostov-na-donu", to: "taganrog", label: "Ростов-на-Дону — Таганрог" },
  { from: "rostov-na-donu", to: "simferopol", label: "Ростов-на-Дону — Симферополь" },

  { from: "simferopol", to: "sevastopol", label: "Симферополь — Севастополь" },
  { from: "simferopol", to: "kerch", label: "Симферополь — Керчь" },
  { from: "simferopol", to: "evpatoriya", label: "Симферополь — Евпатория" },

  // новые территории (осторожно: только те, что реально у тебя есть в seo-routes + CITY_MAP)
  { from: "donetsk", to: "rostov-na-donu", label: "Донецк — Ростов-на-Дону" },
  { from: "donetsk", to: "moskva", label: "Донецк — Москва" },
  { from: "donetsk", to: "krasnodar", label: "Донецк — Краснодар" },
  { from: "lugansk", to: "rostov-na-donu", label: "Луганск — Ростов-на-Дону" },
  { from: "lugansk", to: "moskva", label: "Луганск — Москва" },
  { from: "mariupol", to: "taganrog", label: "Мариуполь — Таганрог" },
  { from: "mariupol", to: "rostov-na-donu", label: "Мариуполь — Ростов-на-Дону" },
  { from: "melitopol", to: "rostov-na-donu", label: "Мелитополь — Ростов-на-Дону" },
  { from: "kherson", to: "simferopol", label: "Херсон — Симферополь" },
];

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function RoutesBlock() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">Популярные направления</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Быстрые ссылки на самые частые маршруты. Можно открыть страницу маршрута и оставить заявку.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_ROUTES.map((r) => (
            <a
              key={`${r.from}__${r.to}`}
              href={`/route/${r.from}/${r.to}`}
              className={cn(
                "rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-semibold",
                "text-zinc-800 shadow-sm backdrop-blur hover:bg-white hover:border-sky-200/80"
              )}
            >
              {r.label}
            </a>
          ))}
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Не нашли направление? Оставьте заявку — подберём маршрут, класс авто и заранее согласуем стоимость.
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/intercity-taxi#service`,
    name: "Междугороднее такси",
    url: `${SITE_URL}/intercity-taxi`,
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "Россия" },
    serviceType: ["Междугороднее такси", "Поездка в другой город", "Трансфер между городами"],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Междугороднее такси", item: `${SITE_URL}/intercity-taxi` },
    ],
  };

  return (
    <>
      <Script
        id="ld-intercity-service"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id="ld-intercity-breadcrumbs"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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

      <RoutesBlock />
    </>
  );
}