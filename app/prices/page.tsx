import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

const PHONE_DISPLAY = "+7 (831) 423-39-29";
const PHONE_TEL = "+78314233929";
const TELEGRAM = "https://t.me/vector_rf52";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export const metadata: Metadata = {
  title: "Цены на междугородние поездки — Вектор РФ",
  description:
    "Актуальные цены на междугородние поездки и трансферы из Нижнего Новгорода. Москва, Санкт-Петербург, Казань, Уфа, Краснодар и другие направления.",
  alternates: { canonical: `${SITE_URL}/prices` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/prices`,
    title: "Цены на междугородние поездки — Вектор РФ",
    description:
      "Таблица цен на трансферы и междугородние поездки из Нижнего Новгорода. Стоимость фиксируется до подачи автомобиля.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — цены на трансферы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Цены на междугородние поездки — Вектор РФ",
    description: "Цены на трансферы из Нижнего Новгорода. Стоимость подтверждаем заранее.",
    images: ["/og.jpg"],
  },
};

const PRICES = [
  { route: "Нижний Новгород - Москва", price: 11900 },
  { route: "Нижний Новгород - Чебоксары", price: 6720 },
  { route: "Нижний Новгород - Канаш", price: 7280 },
  { route: "Нижний Новгород - Шумерля", price: 7700 },
  { route: "Нижний Новгород - Набережные Челны", price: 14420 },
  { route: "Нижний Новгород - Уфа", price: 24640 },
  { route: "Нижний Новгород - Ульяновск", price: 12040 },
  { route: "Нижний Новгород - Санкт-Петербург", price: 30520 },
  { route: "Нижний Новгород - Сочи", price: 52080 },
  { route: "Нижний Новгород - Краснодар", price: 48720 },
  { route: "Нижний Новгород - Воронеж", price: 23800 },
  { route: "Нижний Новгород - Волгоград", price: 35560 },
  { route: "Нижний Новгород – Смоленск", price: 22400 },
  { route: "Нижний Новгород – Петрозаводск", price: 30520 },
  { route: "Нижний Новгород – Ярославль", price: 16240 },
  { route: "Нижний Новгород - Иваново", price: 8540 },
  { route: "Нижний Новгород - Ижевск", price: 27160 },
  { route: "Нижний Новгород - Тольятти", price: 26880 },
  { route: "Нижний Новгород - Оренбург", price: 39200 },
  { route: "Нижний Новгород - Омск", price: 62160 },
  { route: "Нижний Новгород - Пермь", price: 29960 },
  { route: "Нижний Новгород - Тверь", price: 12320 },
  { route: "Нижний Новгород - Самара", price: 26880 },
  { route: "Нижний Новгород - Саратов", price: 24220 },
  { route: "Нижний Новгород - Новороссийск", price: 47040 },
  { route: "Нижний Новгород - Крым", price: 48720 },
  { route: "Нижний Новгород - Ростов-на-Дону", price: 35560 },
  { route: "Нижний Новгород - Луганск", price: 36400 },
  { route: "Нижний Новгород - Россошь", price: 27440 },
  { route: "Нижний Новгород - Ровеньки", price: 30520 },
  { route: "Нижний Новгород - Миллерово", price: 33040 },
  { route: "Нижний Новгород - Богучар", price: 25760 },
  { route: "Нижний Новгород - Чертково", price: 29680 },
  { route: "Нижний Новгород - Таганрог", price: 37520 },
  { route: "Нижний Новгород - Горловка", price: 37240 },
  { route: "Нижний Новгород - Каменск-Шахтинский", price: 32480 },
  { route: "Нижний Новгород - Курск", price: 24920 },
  { route: "Нижний Новгород - Орел", price: 22120 },
];

function formatPrice(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

export default function PricesPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Цены", item: `${SITE_URL}/prices` },
    ],
  };

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Цены на междугородние поездки",
    url: `${SITE_URL}/prices`,
    description:
      "Таблица цен на междугородние поездки и трансферы из Нижнего Новгорода. Стоимость подтверждаем до подачи.",
  };

  return (
    <main className="min-h-screen text-zinc-900">
      <Script
        id="ld-prices-breadcrumbs"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="ld-prices-page"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* фон как на главной */}
      <div className="fixed inset-0 -z-20 bg-[#f3f7ff]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_50%_-10%,rgba(56,189,248,0.28),transparent_60%),radial-gradient(900px_520px_at_12%_18%,rgba(59,130,246,0.14),transparent_55%),radial-gradient(900px_520px_at_88%_20%,rgba(99,102,241,0.12),transparent_55%)]" />
      <div className="fixed inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white/70 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* hero */}
        <header className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-600">Цены</div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Цены на междугородние поездки
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                Ниже — популярные направления из Нижнего Новгорода. Стоимость указана ориентировочно и подтверждается
                перед подачей автомобиля.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/#order"
                className="rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
              >
                Оставить заявку
              </Link>
              <Link
                href="/"
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                На главную
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <a
              href={`tel:${PHONE_TEL}`}
              className={cn("rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur hover:bg-white")}
            >
              <div className="text-xs font-semibold text-zinc-600">Телефон</div>
              <div className="mt-1 text-sm font-extrabold text-zinc-900">{PHONE_DISPLAY}</div>
              <div className="mt-1 text-sm text-zinc-600">Нажмите, чтобы позвонить</div>
            </a>

            <a
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
              className={cn("rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur hover:bg-white")}
            >
              <div className="text-xs font-semibold text-zinc-600">Telegram</div>
              <div className="mt-1 text-sm font-extrabold text-zinc-900">Написать в Telegram</div>
              <div className="mt-1 text-sm text-zinc-600">Ответим быстрее по срочным вопросам</div>
            </a>
          </div>
        </header>

        {/* table */}
        <section className="mt-6 rounded-3xl border border-zinc-200 bg-white/75 p-6 shadow-sm backdrop-blur md:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Популярные маршруты</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Цены указаны для базового класса. Для Комфорт / Бизнес / Минивэн стоимость уточняется по заявке.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-sm">
            <div className="grid grid-cols-12 border-b border-zinc-200 bg-white/90 px-4 py-3 text-xs font-semibold text-zinc-600">
              <div className="col-span-8">Маршрут</div>
              <div className="col-span-4 text-right">Стоимость</div>
            </div>

            <div className="divide-y divide-zinc-200">
              {PRICES.map((x) => (
                <div key={x.route} className="grid grid-cols-12 px-4 py-3 text-sm hover:bg-zinc-50/70">
                  <div className="col-span-8 font-semibold text-zinc-900">{x.route}</div>
                  <div className="col-span-4 text-right font-extrabold text-zinc-900">{formatPrice(x.price)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-sky-200/70 bg-sky-50/70 p-5">
            <div className="text-sm font-extrabold text-zinc-900">Важно</div>
            <div className="mt-2 text-sm leading-6 text-zinc-700">
              Стоимость поездки подтверждаем <b>до подачи автомобиля</b>. Если нужны остановки по пути, детское кресло,
              встреча с табличкой или большой багаж — укажите это в заявке.
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/#order"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
            >
              Рассчитать поездку / оставить заявку
            </Link>

            <Link
              href="/intercity-taxi"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              Междугороднее такси
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              Все услуги
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}