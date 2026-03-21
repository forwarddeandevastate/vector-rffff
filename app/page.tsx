import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { PageBackground, Header, Footer, Tag } from "@/app/ui/shared";
import HomePageInteractive from "./home-page-client";
import HomePageStaticForm from "./home-page-static-form";
import {
  CORE_SERVICE_LINKS,
  POPULAR_ROUTE_LINKS,
  REGIONAL_ROUTE_GROUPS,
  TRUST_FACTS,
  TRUST_METRICS,
  BLOG_COMMERCIAL_LINKS,
} from "@/lib/internal-links";

const SITE_URL = "https://vector-rf.ru";
const PHONE_TEL = "+78002225650";
const PHONE_DISPLAY = "8 800 222-56-50";
const TELEGRAM = "https://t.me/vector_rf52";

export const metadata: Metadata = {
  title: "Вектор РФ — такси межгород и трансферы по России 24/7",
  description:
    "Заказать такси межгород, трансфер в аэропорт или поездку по России. Комфорт, бизнес, минивэн. Стоимость фиксируем до выезда, работаем 24/7.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    title: "Вектор РФ — такси межгород и трансферы по России 24/7",
    description:
      "Заказать такси межгород, трансфер в аэропорт или поездку по России. Комфорт, бизнес, минивэн. Стоимость фиксируем до выезда.",
    siteName: "Вектор РФ",
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы по России" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Вектор РФ — такси межгород и трансферы по России 24/7",
    description: "Такси межгород, трансфер в аэропорт, минивэн. Стоимость до выезда, 24/7.",
    images: ["/og.jpg"],
  },
};

// ── JSON-LD — все на сервере ──────────────────────────────────────────────

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "@id": `${SITE_URL}/#organization`,
  name: "Вектор РФ",
  url: SITE_URL,
  telephone: PHONE_TEL,
  areaServed: { "@type": "Country", name: "Россия" },
  serviceType: ["Междугороднее такси", "Трансфер в аэропорт", "Поездки по городу", "Минивэн"],
  sameAs: [TELEGRAM],
  priceRange: "₽₽",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Сколько стоит такси межгород?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Стоимость зависит от маршрута и класса авто. Москва — Нижний Новгород от 13 000 ₽, Москва — Казань от 25 000 ₽ (стандарт). Финальную цену фиксируем до выезда.",
      },
    },
    {
      "@type": "Question",
      name: "Как быстро подаётся машина?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "По городу — обычно 15–30 минут. В аэропорт и на межгород — строго к согласованному времени.",
      },
    },
    {
      "@type": "Question",
      name: "Встречаете в аэропорту с табличкой?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да, водитель встречает в зоне прилёта с именной табличкой. Отслеживаем рейс — если задержка, ждём.",
      },
    },
    {
      "@type": "Question",
      name: "Можно ли заказать минивэн для группы?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да, минивэн на 6–7 мест доступен для любых маршрутов: межгород, аэропорт, поездки по городу.",
      },
    },
    {
      "@type": "Question",
      name: "Принимаете ли оплату по безналу?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да, доступен безналичный расчёт. Для организаций выставляем счёт и предоставляем закрывающие документы.",
      },
    },
  ],
};

const navItemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Услуги Вектор РФ",
  itemListElement: CORE_SERVICE_LINKS.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.label,
    url: `${SITE_URL}${item.href}`,
  })),
};

const popularRoutesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Популярные маршруты",
  itemListElement: POPULAR_ROUTE_LINKS.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.label,
    url: `${SITE_URL}${item.href}`,
  })),
};

// ── Статичные секции (Server Components) ─────────────────────────────────

function HeroStatic() {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Tag>Проверенные водители</Tag>
        <Tag>Фиксированная стоимость</Tag>
        <Tag>Работаем 24/7</Tag>
      </div>
      <h1 className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 md:text-5xl lg:text-[52px]">
        Такси и трансферы{" "}
        <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800 bg-clip-text text-transparent">
          по России 24/7
        </span>
      </h1>
      <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
        Заказать такси межгород, трансфер в аэропорт или поездку по городу.
        Уточним детали, подтвердим стоимость и организуем подачу ко времени — без счётчиков и сюрпризов.
      </p>

      {/* Гарантии — статичный список, важен для краулера */}
      <div className="mt-5 rounded-2xl border border-blue-100/60 bg-white/70 backdrop-blur-sm p-5 shadow-sm">
        <div className="text-sm font-bold text-slate-800 mb-3">Как это работает</div>
        <div className="grid gap-2">
          {[
            "Оставьте заявку — перезвоним в течение 15 минут",
            "Согласуем маршрут, класс авто и стоимость заранее",
            "Водитель подъедет к указанному адресу вовремя",
          ].map((g, i) => (
            <div key={g} className="flex items-start gap-2.5 text-sm text-slate-600">
              <span className="mt-0.5 shrink-0 grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-[10px] font-black text-white">
                {i + 1}
              </span>
              {g}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrustSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <div className="grid gap-4 md:grid-cols-3">
        {TRUST_METRICS.map((item) => (
          <div key={item.label}
            className="rounded-3xl border border-blue-100/60 bg-white/80 p-6 text-center backdrop-blur-sm shadow-sm">
            <div className="text-3xl font-black tracking-tight text-blue-700">{item.value}</div>
            <div className="mt-1.5 text-sm text-slate-500">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {TRUST_FACTS.map((fact) => (
          <div key={fact}
            className="flex items-start gap-2.5 rounded-2xl border border-blue-100/50 bg-white/75 p-4 shadow-sm">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
            <span className="text-sm text-slate-700">{fact}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      title: "Такси межгород",
      text: "Прямые поездки между городами без пересадок. Согласуем маршрут и фиксируем цену до выезда.",
      href: "/taxi-mezhgorod",
      badge: "Популярное",
      highlight: true,
    },
    {
      title: "Трансфер в аэропорт",
      text: "Подача ко времени вылета. Встреча в зале прилёта с табличкой. Отслеживаем рейс при задержке.",
      href: "/transfer-v-aeroport",
      badge: "Аэропорт",
    },
    {
      title: "Минивэн",
      text: "6–7 мест для семьи, группы или большого багажа. Межгород и аэропорт.",
      href: "/minivan-transfer",
      badge: "Группа",
    },
    {
      title: "Корпоративным",
      text: "Поездки сотрудников и гостей. Договор, безнал, закрывающие документы.",
      href: "/corporate",
      badge: "Бизнес",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-6">Наши услуги</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <Link key={s.href} href={s.href}
            className={`group rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md ${s.highlight
              ? "border-blue-400 bg-blue-600 text-white hover:bg-blue-700"
              : "border-blue-100/60 bg-white/82 backdrop-blur-md hover:border-blue-300"}`}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className={`text-base font-extrabold ${s.highlight ? "text-white" : "text-slate-900"}`}>
                {s.title}
              </div>
              <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${s.highlight
                ? "bg-white/20 text-white"
                : "bg-blue-50 text-blue-600"}`}>
                {s.badge}
              </span>
            </div>
            <p className={`text-xs leading-5 ${s.highlight ? "text-blue-100" : "text-slate-500"}`}>{s.text}</p>
            <div className={`mt-4 text-xs font-semibold ${s.highlight ? "text-blue-100" : "text-blue-600"} group-hover:underline`}>
              Подробнее →
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { href: "/city-transfer", label: "Поездки по городу" },
          { href: "/transfer-iz-aeroporta", label: "Трансфер из аэропорта" },
          { href: "/prices", label: "Цены" },
          { href: "/services", label: "Все услуги" },
          { href: "/contacts", label: "Контакты" },
          { href: "/reviews", label: "Отзывы" },
        ].map((l) => (
          <Link key={l.href} href={l.href}
            className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-blue-50 hover:text-blue-700 transition-colors">
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}


function CarClassSection() {
  const classes = [
    {
      name: "Стандарт", badge: "Эконом", highlight: false,
      desc: "Комфортный седан для 1–3 пассажиров. Оптимально по цене для коротких и средних маршрутов.",
      features: ["1–3 пассажира, 1–2 чемодана", "Кондиционер, аккуратная подача", "Цену фиксируем до выезда"],
      note: "Хороший выбор для поездок до 3–4 часов.",
    },
    {
      name: "Комфорт", badge: "Популярный", highlight: true,
      desc: "Просторный бизнес-седан. Мягкий ход, увеличенный багажник. Чаще берут на аэропорт и межгород.",
      features: ["Просторный салон, тихий ход", "Большой багажник", "Деловые и семейные поездки"],
      note: "Детское кресло — по запросу.",
    },
    {
      name: "Бизнес", badge: "Премиум", highlight: false,
      desc: "Mercedes, BMW или аналог. Для деловых встреч, VIP-трансферов и поездок, где важно впечатление.",
      features: ["Кожаный салон, тишина", "Встреча с табличкой", "Пунктуальность — гарантия"],
      note: "Уточняем марку при бронировании.",
    },
    {
      name: "Минивэн", badge: "Группа", highlight: false,
      desc: "6–7 мест для семьи, команды или больших чемоданов. Межгород, аэропорт, загородные поездки.",
      features: ["До 7 мест, широкий салон", "Много багажного места", "Детские кресла по запросу"],
      note: "Укажите число пассажиров при заявке.",
    },
  ];

  return (
    <section id="classes" className="mx-auto max-w-6xl px-4 pb-12">
      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2">Классы автомобилей</h2>
      <p className="text-sm text-slate-500 mb-6">
        Выберите в форме — или укажите при бронировании, и мы подберём оптимально.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {classes.map((cls) => (
          <div
            key={cls.name}
            className={`rounded-3xl border p-5 shadow-sm ${cls.highlight
              ? "border-blue-400 bg-blue-600"
              : "border-blue-100/60 bg-white/82 backdrop-blur-md"}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className={`text-base font-extrabold ${cls.highlight ? "text-white" : "text-slate-900"}`}>
                {cls.name}
              </div>
              <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${cls.highlight
                ? "bg-white/20 text-white"
                : "bg-blue-50 text-blue-600"}`}>
                {cls.badge}
              </span>
            </div>
            <p className={`text-xs leading-5 mb-4 ${cls.highlight ? "text-blue-100" : "text-slate-500"}`}>
              {cls.desc}
            </p>
            <ul className="space-y-1.5">
              {cls.features.map((f) => (
                <li key={f} className={`flex items-center gap-2 text-xs ${cls.highlight ? "text-blue-100" : "text-slate-600"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cls.highlight ? "bg-white/60" : "bg-blue-400"}`} />
                  {f}
                </li>
              ))}
            </ul>
            {cls.note && (
              <p className={`mt-3 text-[11px] ${cls.highlight ? "text-blue-200" : "text-slate-400"}`}>{cls.note}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function RoutesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2">Популярные маршруты</h2>
      <p className="text-sm text-slate-500 mb-6">
        Нижний Новгород, Москва, Казань, Краснодар, Екатеринбург и другие города России
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Популярные */}
        <div className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm">
          <div className="text-sm font-bold text-slate-800 mb-4">Топовые направления</div>
          <div className="grid gap-1.5">
            {POPULAR_ROUTE_LINKS.slice(0, 8).map((item) => (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-2 rounded-xl border border-blue-50 bg-white/80 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        {/* По регионам */}
        <div className="grid gap-3">
          {REGIONAL_ROUTE_GROUPS.map((group) => (
            <div key={group.title}
              className="rounded-2xl border border-blue-100/50 bg-white/70 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-3">{group.title}</div>
              <div className="flex flex-wrap gap-1.5">
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href}
                    className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-2.5 py-1 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <Link href="/city"
          className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/60 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors shadow-sm">
          Все города и маршруты →
        </Link>
      </div>
    </section>
  );
}

function BlogSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900 mb-1">Читайте перед поездкой</h2>
      <p className="text-sm text-slate-500 mb-5">Статьи блога о том, как заказать и что учесть</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {BLOG_COMMERCIAL_LINKS.map((b) => (
          <Link key={b.href} href={b.href}
            className="group rounded-2xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 block">Блог</span>
            <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
              {b.label}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-3">
        <Link href="/blog" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
          Все статьи блога →
        </Link>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <>
      {/* JSON-LD — сервер */}
      <Script id="schema-business" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
      <Script id="schema-faq" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-nav" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navItemListSchema) }} />
      <Script id="schema-routes" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(popularRoutesSchema) }} />

      <PageBackground />
      <Header />

      <div className="animate-page">
        {/* HERO: статика сервера + интерактив клиента в одной секции */}
        <section className="mx-auto max-w-6xl px-4 pt-8 pb-10 md:pt-12 md:pb-14">
          {/* Hero grid: левый текст + правая форма */}
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:gap-10 lg:items-start">
            {/* Левая колонка: H1, описание, шаги — SSR */}
            <HeroStatic />

            {/* Правая колонка: форма
                HomePageStaticForm — SSR-скелет виден боту и до JS
                HomePageInteractive накладывается поверх после гидрации */}
            <div className="relative">
              {/* Статичный HTML для бота и LCP */}
              <HomePageStaticForm />
              {/* Интерактивная оболочка — скрыта до гидрации через CSS,
                  затем берёт управление */}
              <HomePageInteractive />
            </div>
          </div>
        </section>

        <TrustSection />
        <CarClassSection />
        <ServicesSection />
        <RoutesSection />
        <BlogSection />
      </div>

      <Footer />
    </>
  );
}
