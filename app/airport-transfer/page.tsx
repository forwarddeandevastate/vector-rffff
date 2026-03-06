import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import ServicePage from "../ui/service-page";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";
const CANONICAL = `${SITE_URL}/airport-transfer`;

type LinkItem = { from: string; to: string; label: string };

type AirportGroup = {
  title: string;
  intro: string;
  links: Array<{ href: string; label: string }>;
};

export const metadata: Metadata = {
  title: "Трансфер в аэропорт и из аэропорта — заказать 24/7 | Вектор РФ",
  description:
    "Трансфер в аэропорт и из аэропорта: встреча по времени прилёта, помощь с багажом, подача к терминалу и стоимость заранее. Комфорт, бизнес, минивэн. Онлайн-заявка 24/7.",
  keywords: [
    "трансфер в аэропорт",
    "трансфер из аэропорта",
    "такси в аэропорт",
    "встреча в аэропорту",
    "трансфер аэропорт",
    "заказать трансфер в аэропорт",
  ],
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: CANONICAL,
    title: "Трансфер в аэропорт и из аэропорта — заказать 24/7 | Вектор РФ",
    description:
      "Встреча по времени прилёта, помощь с багажом, подача к терминалу и согласование стоимости заранее.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансфер в аэропорт" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Трансфер в аэропорт — Вектор РФ",
    description: "Трансфер в аэропорт и из аэропорта. Онлайн-заявка 24/7.",
    images: ["/og.jpg"],
  },
};

const AIRPORT_ROUTES: LinkItem[] = [
  { from: "moskva", to: "domodedovo", label: "Москва — Домодедово" },
  { from: "domodedovo", to: "moskva", label: "Домодедово — Москва" },
  { from: "moskva", to: "khimki", label: "Москва — Химки" },
  { from: "khimki", to: "moskva", label: "Химки — Москва" },
  { from: "moskva", to: "podolsk", label: "Москва — Подольск" },
  { from: "podolsk", to: "moskva", label: "Подольск — Москва" },
  { from: "sankt-peterburg", to: "velikiy-novgorod", label: "Санкт-Петербург — Великий Новгород" },
  { from: "velikiy-novgorod", to: "sankt-peterburg", label: "Великий Новгород — Санкт-Петербург" },
  { from: "sankt-peterburg", to: "pskov", label: "Санкт-Петербург — Псков" },
  { from: "pskov", to: "sankt-peterburg", label: "Псков — Санкт-Петербург" },
  { from: "nizhniy-novgorod", to: "moskva", label: "Нижний Новгород — Москва" },
  { from: "moskva", to: "nizhniy-novgorod", label: "Москва — Нижний Новгород" },
  { from: "kazan", to: "moskva", label: "Казань — Москва" },
  { from: "samara", to: "moskva", label: "Самара — Москва" },
  { from: "rostov-na-donu", to: "krasnodar", label: "Ростов-на-Дону — Краснодар" },
  { from: "krasnodar", to: "rostov-na-donu", label: "Краснодар — Ростов-на-Дону" },
  { from: "krasnodar", to: "sochi", label: "Краснодар — Сочи" },
  { from: "sochi", to: "krasnodar", label: "Сочи — Краснодар" },
  { from: "krasnodar", to: "anapa", label: "Краснодар — Анапа" },
  { from: "anapa", to: "krasnodar", label: "Анапа — Краснодар" },
  { from: "krasnodar", to: "novorossiysk", label: "Краснодар — Новороссийск" },
  { from: "novorossiysk", to: "krasnodar", label: "Новороссийск — Краснодар" },
  { from: "rostov-na-donu", to: "simferopol", label: "Ростов-на-Дону — Симферополь" },
  { from: "krasnodar", to: "simferopol", label: "Краснодар — Симферополь" },
  { from: "simferopol", to: "sevastopol", label: "Симферополь — Севастополь" },
  { from: "donetsk", to: "rostov-na-donu", label: "Донецк — Ростов-на-Дону" },
  { from: "lugansk", to: "rostov-na-donu", label: "Луганск — Ростов-на-Дону" },
  { from: "mariupol", to: "taganrog", label: "Мариуполь — Таганрог" },
  { from: "melitopol", to: "rostov-na-donu", label: "Мелитополь — Ростов-на-Дону" },
  { from: "kherson", to: "simferopol", label: "Херсон — Симферополь" },
];

const KEY_PHRASES = [
  "трансфер в аэропорт",
  "трансфер из аэропорта",
  "такси в аэропорт",
  "встреча в аэропорту",
  "заказать трансфер в аэропорт",
  "индивидуальный трансфер аэропорт",
];

const AIRPORT_GROUPS: AirportGroup[] = [
  {
    title: "Трансфер в аэропорт",
    intro: "Когда нужен выезд к терминалу без лишних пересадок, удобнее заранее заказать трансфер в аэропорт с подачей к нужному адресу.",
    links: [
      { href: "/airport-transfer", label: "Заказать трансфер в аэропорт" },
      { href: "/intercity-taxi", label: "Междугороднее такси" },
      { href: "/city-transfer", label: "Поездки по городу" },
    ],
  },
  {
    title: "Трансфер из аэропорта",
    intro: "После прилёта можно заранее оформить встречу в аэропорту, указать номер рейса и адрес подачи, чтобы водитель приехал ко времени прилёта.",
    links: [
      { href: "/airport-transfer", label: "Трансфер из аэропорта" },
      { href: "/minivan-transfer", label: "Минивэн для багажа и группы" },
      { href: "/corporate", label: "Корпоративный трансфер" },
    ],
  },
  {
    title: "Аэропорт + межгород",
    intro: "Если после аэропорта нужно ехать в другой город, можно сразу оформить трансфер между аэропортом и конечным адресом без дополнительных пересадок.",
    links: [
      { href: "/moskva/nizhniy-novgorod", label: "Москва — Нижний Новгород" },
      { href: "/moskva/kazan", label: "Москва — Казань" },
      { href: "/krasnodar/sochi", label: "Краснодар — Сочи" },
    ],
  },
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
            <h2 className="text-lg font-extrabold text-zinc-900">Трансфер в аэропорт по времени вылета</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              В заявке можно указать дату, время подачи, адрес и пожелания по багажу. Такой формат подходит, когда нужен
              индивидуальный трансфер в аэропорт без ожидания и лишних пересадок.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white/85 p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-zinc-900">Трансфер из аэропорта по времени прилёта</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              Для встречи после рейса можно указать номер рейса и адрес назначения. Это удобно для поездок домой, в отель,
              офис, другой город или к вокзалу.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white/85 p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-zinc-900">Комфорт, бизнес и минивэн</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              Можно подобрать класс автомобиля под поездку: стандарт для одного-двух пассажиров, комфорт или бизнес для деловых
              поездок, минивэн — если нужно больше места для людей и багажа.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GroupBlock() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {AIRPORT_GROUPS.map((group) => (
          <div key={group.title} className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur">
            <h2 className="text-xl font-extrabold tracking-tight text-zinc-900">{group.title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">{group.intro}</p>
            <div className="mt-4 grid gap-2">
              {group.links.map((item) => (
                <Link
                  key={`${group.title}-${item.href}`}
                  href={item.href}
                  className={cn(
                    "rounded-2xl border border-zinc-200 bg-white/85 px-4 py-3 text-sm font-semibold text-zinc-800 shadow-sm",
                    "hover:border-sky-200 hover:bg-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PopularBlock() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">Популярные направления (аэропорт)</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Быстрые ссылки на частые маршруты под запросы «трансфер в аэропорт», «трансфер из аэропорта» и «такси в аэропорт».
        </p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {AIRPORT_ROUTES.map((r) => (
            <Link
              key={`${r.from}__${r.to}`}
              href={`/${r.from}/${r.to}`}
              className={cn(
                "rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-semibold",
                "text-zinc-800 shadow-sm backdrop-blur hover:bg-white hover:border-sky-200/80"
              )}
            >
              {r.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Не нашли направление? Оставьте заявку — уточним рейс, адрес и заранее согласуем стоимость.
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
    name: "Трансфер в аэропорт и из аэропорта",
    serviceType: ["Трансфер в аэропорт", "Трансфер из аэропорта", "Такси в аэропорт", "Встреча в аэропорту"],
    url: CANONICAL,
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
      { "@type": "ListItem", position: 2, name: "Трансфер в аэропорт", item: CANONICAL },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Встречаете с табличкой?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да, по запросу. Укажите это в комментарии к заявке — подтвердим детали встречи.",
        },
      },
      {
        "@type": "Question",
        name: "Если рейс задержали?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Если вы указали номер рейса, ориентируемся по фактическому времени прилёта и заранее согласуем ожидание.",
        },
      },
      {
        "@type": "Question",
        name: "Можно заказать детское кресло?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да. Укажите возраст ребёнка — подберём подходящее кресло и подтвердим наличие.",
        },
      },
      {
        "@type": "Question",
        name: "Можно ли заказать трансфер сразу в другой город?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да, можно оформить поездку из аэропорта или в аэропорт с конечной точкой в другом городе. Укажите адрес и детали маршрута в заявке.",
        },
      },
    ],
  };

  const keywordJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ключевые запросы по трансферу в аэропорт",
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
    name: "Популярные маршруты для трансфера в аэропорт",
    itemListElement: AIRPORT_ROUTES.slice(0, 20).map((route, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: route.label,
      url: `${SITE_URL}/${route.from}/${route.to}`,
    })),
  };

  return (
    <>
      <Script
        id="ld-airport-service"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id="ld-airport-breadcrumbs"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="ld-airport-faq"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="ld-airport-keywords"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(keywordJsonLd) }}
      />
      <Script
        id="ld-airport-routes"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(routesJsonLd) }}
      />

      <ServicePage
        breadcrumbs={[
          { name: "Главная", href: "/" },
          { name: "Трансфер в аэропорт", href: "/airport-transfer" },
        ]}
        title="Трансфер в аэропорт и из аэропорта"
        subtitle="Встречаем по времени прилёта и подаём автомобиль к нужному месту. Помогаем с багажом, стоимость согласуем заранее. 24/7."
        bullets={[
          "Встреча по времени прилёта или подача к вылету",
          "Можно указать номер рейса и комментарии",
          "Комфорт / Бизнес / Минивэн",
          "Помощь с багажом по запросу",
          "Стоимость согласуем до подачи автомобиля",
        ]}
        faq={[
          { q: "Встречаете с табличкой?", a: "Да, по запросу. Укажите это в комментарии к заявке — подтвердим детали." },
          { q: "Если рейс задержали?", a: "Если вы указали рейс, ориентируемся по фактическому времени прилёта и согласуем ожидание." },
          { q: "Можно заказать детское кресло?", a: "Да, укажите возраст ребёнка — подберём подходящее кресло." },
          { q: "Можно ли заказать трансфер сразу в другой город?", a: "Да, можно заранее оформить маршрут из аэропорта или в аэропорт с конечной точкой в другом городе." },
        ]}
      />

      <KeywordBlock />
      <GroupBlock />
      <PopularBlock />
    </>
  );
}
