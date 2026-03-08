import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import ServicePage from "../ui/service-page";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";
const CANONICAL = `${SITE_URL}/intercity-taxi`;
const PHONE_E164 = "+78002225650";

type LinkItem = { from: string; to: string; label: string };

type Cluster = {
  title: string;
  intro: string;
  routes: LinkItem[];
};

export const metadata: Metadata = {
  title: "Междугороднее такси — такси межгород по России",
  description:
    "Междугороднее такси по России: такси межгород, поездки между городами и трансфер на дальние расстояния. Комфорт, бизнес, минивэн. Стоимость согласуем заранее. Заявка 24/7.",
  keywords: [
    "междугороднее такси",
    "такси межгород",
    "такси между городами",
    "трансфер между городами",
    "межгород по России",
    "такси на дальнее расстояние",
  ],
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: CANONICAL,
    title: "Междугороднее такси — такси межгород по России",
    description:
      "Поездки между городами по России: междугороднее такси, такси межгород, комфортные автомобили и согласование стоимости заранее.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — междугороднее такси" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Междугороднее такси",
    description: "Такси межгород по России. Онлайн-заявка 24/7.",
    images: ["/og.jpg"],
  },
};

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

const CLUSTERS: Cluster[] = [
  {
    title: "Москва и Центральная Россия",
    intro: "Маршруты между столицей и крупными городами Центральной России — частый запрос на междугороднее такси и такси межгород.",
    routes: POPULAR_ROUTES.slice(0, 8),
  },
  {
    title: "Санкт-Петербург и Северо-Запад",
    intro: "Поездки между городами Северо-Запада удобны как для деловых поездок, так и для семейных маршрутов.",
    routes: POPULAR_ROUTES.filter((item) => item.from === "sankt-peterburg" || item.to === "sankt-peterburg").slice(0, 6),
  },
  {
    title: "Юг России и курортные направления",
    intro: "Трансфер между городами на юге России особенно востребован в сезон отпусков, когда нужен комфортный межгород без пересадок.",
    routes: POPULAR_ROUTES.filter((item) => ["krasnodar", "rostov-na-donu", "simferopol"].includes(item.from)).slice(0, 8),
  },
];

const KEY_PHRASES = [
  "междугороднее такси",
  "такси межгород",
  "такси между городами",
  "трансфер между городами",
  "поездка в другой город на такси",
  "межгород по России",
];

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function KeywordBlock() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8">
      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
        <div className="flex flex-wrap gap-2">
          {KEY_PHRASES.map((item) => (
            <span
              key={item}
              className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white/85 p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-zinc-900">Такси межгород без пересадок</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              Если нужен прямой маршрут из одного города в другой, междугороднее такси часто удобнее поезда с пересадкой или
              рейса с ожиданием. В заявке можно указать адрес отправления, конечную точку и дополнительные остановки.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white/85 p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-zinc-900">Междугороднее такси для семьи и командировок</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              Поездки между городами подходят для семейных маршрутов, деловых встреч, срочных выездов и трансфера до отелей,
              вокзалов, аэропортов и пригородных адресов. Можно выбрать стандарт, комфорт, бизнес или минивэн.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white/85 p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-zinc-900">Стоимость заранее</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              Для межгорода важно заранее понимать условия поездки. Мы принимаем заявку онлайн, уточняем детали маршрута и
              подтверждаем стоимость до подачи автомобиля.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClusterBlock() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {CLUSTERS.map((cluster) => (
          <div key={cluster.title} className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur">
            <h2 className="text-xl font-extrabold tracking-tight text-zinc-900">{cluster.title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">{cluster.intro}</p>
            <div className="mt-4 grid gap-2">
              {cluster.routes.map((route) => (
                <Link
                  key={`${cluster.title}-${route.from}-${route.to}`}
                  href={`/${route.from}/${route.to}`}
                  className={cn(
                    "rounded-2xl border border-zinc-200 bg-white/85 px-4 py-3 text-sm font-semibold text-zinc-800 shadow-sm",
                    "hover:border-sky-200 hover:bg-white"
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RoutesBlock() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">Популярные направления</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Быстрые ссылки на частые маршруты по запросам «междугороднее такси» и «такси межгород». Открывайте маршрут и
              оставляйте заявку.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_ROUTES.map((r) => (
            <a
              key={`${r.from}__${r.to}`}
              href={`/${r.from}/${r.to}`}
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
    "@id": `${CANONICAL}#service`,
    name: "Междугороднее такси",
    url: CANONICAL,
    areaServed: { "@type": "Country", name: "Россия" },
    serviceType: ["Междугороднее такси", "Такси межгород", "Поездка в другой город", "Трансфер между городами"],
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      telephone: PHONE_E164,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Междугороднее такси", item: CANONICAL },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Можно ли ехать туда-обратно?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да. Укажите это в заявке — рассчитаем вариант туда-обратно и согласуем стоимость.",
        },
      },
      {
        "@type": "Question",
        name: "Можно добавить остановки по дороге?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да, просто перечислите остановки — мы учтём это при согласовании.",
        },
      },
      {
        "@type": "Question",
        name: "Какие классы доступны на межгород?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Стандарт, Комфорт, Бизнес и Минивэн — выбирайте в форме, мы подтвердим доступность.",
        },
      },
      {
        "@type": "Question",
        name: "Чем междугороднее такси отличается от обычного такси?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Междугороднее такси — это поездка на дальнее расстояние между городами с согласованием маршрута, остановок и стоимости заранее.",
        },
      },
    ],
  };

  const keywordJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ключевые запросы по услуге междугороднего такси",
    itemListElement: KEY_PHRASES.map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      url: CANONICAL,
    })),
  };

  const routesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Популярные маршруты междугороднего такси",
    itemListElement: POPULAR_ROUTES.slice(0, 20).map((route, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: route.label,
      url: `${SITE_URL}/${route.from}/${route.to}`,
    })),
  };

  return (
    <>
      <Script
        id="ld-intercity-service"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id="ld-intercity-breadcrumbs"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="ld-intercity-faq"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="ld-intercity-keywords"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(keywordJsonLd) }}
      />
      <Script
        id="ld-intercity-routes"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(routesJsonLd) }}
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
          {
            q: "Чем междугороднее такси отличается от обычного такси?",
            a: "Это поездка на дальнее расстояние между городами с заранее согласованным маршрутом, условиями и стоимостью.",
          },
        ]}
      />

      <KeywordBlock />
      <ClusterBlock />
      <RoutesBlock />
    </>
  );
}
