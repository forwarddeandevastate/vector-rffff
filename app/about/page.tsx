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
  title: "О компании — Вектор РФ",
  description:
    "«Вектор РФ» — трансферы по городу, в аэропорт и междугородние поездки по России. Как мы работаем, какие классы авто, регионы и сервис.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/about`,
    title: "О компании — Вектор РФ",
    description:
      "Кто мы, как работаем и что предлагаем: город, аэропорт, межгород. Комфорт, бизнес, минивэн. 24/7.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "О компании — Вектор РФ",
    description: "Трансферы и поездки по России: город, аэропорт, межгород. 24/7.",
    images: ["/og.jpg"],
  },
};

export default function AboutPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "О компании", item: `${SITE_URL}/about` },
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    telephone: "+7-831-423-39-29",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+7-831-423-39-29",
        contactType: "customer support",
        areaServed: "RU",
        availableLanguage: ["ru"],
      },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/about#service`,
    name: "Трансферы и поездки по России",
    serviceType: ["Трансфер", "Междугороднее такси", "Трансфер в аэропорт", "Городские поездки"],
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Россия" },
    url: `${SITE_URL}/about`,
  };

  return (
    <main className="min-h-screen text-zinc-900">
      <Script
        id="ld-about-breadcrumbs"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="ld-about-org"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="ld-about-service"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
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
              <div className="text-xs font-semibold text-zinc-600">О компании</div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                «Вектор РФ» — трансферы и поездки по России
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                Мы организуем поездки по городу, трансферы в аэропорт и междугородние маршруты. Работаем 24/7: фиксируем
                заявку, уточняем детали и подтверждаем стоимость до подачи автомобиля.
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

        {/* blocks */}
        <section className="mt-8 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-7 rounded-3xl border border-zinc-200 bg-white/75 p-6 shadow-sm backdrop-blur md:p-8">
            <h2 className="text-2xl font-extrabold tracking-tight">Как мы работаем</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Стараемся делать процесс простым и предсказуемым — без «сюрпризов» в цене и по времени.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {[
                {
                  t: "1) Заявка",
                  d: "Вы оставляете заявку на сайте или пишете в Telegram. Указываете маршрут и пожелания.",
                },
                {
                  t: "2) Подтверждение",
                  d: "Мы уточняем детали, подтверждаем стоимость и время подачи автомобиля.",
                },
                {
                  t: "3) Подача",
                  d: "Автомобиль подаётся по адресу/к терминалу. При необходимости — встреча с табличкой.",
                },
                {
                  t: "4) Поездка",
                  d: "Едете спокойно. Остановки, багаж, кресло — учитываем заранее.",
                },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur">
                  <div className="text-sm font-extrabold text-zinc-900">{x.t}</div>
                  <div className="mt-2 text-sm leading-6 text-zinc-600">{x.d}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="md:col-span-5 rounded-3xl border border-zinc-200 bg-white/85 p-6 shadow-sm backdrop-blur md:p-8">
            <h2 className="text-2xl font-extrabold tracking-tight">Что мы делаем</h2>
            <div className="mt-4 grid gap-2 text-sm text-zinc-700">
              {[
                "Городские поездки и встречи по адресу",
                "Трансфер в аэропорт и из аэропорта",
                "Междугородние поездки по России",
                "Минивэн для семьи/группы и большого багажа",
                "Корпоративные перевозки: договор / безнал / отчётность",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                  <span className="leading-6">{t}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/intercity-taxi"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Межгород
              </Link>
              <Link
                href="/airport-transfer"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Аэропорт
              </Link>
              <Link
                href="/minivan-transfer"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Минивэн
              </Link>
              <Link
                href="/corporate"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Корпоративным
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-4 rounded-3xl border border-zinc-200 bg-white/75 p-6 shadow-sm backdrop-blur md:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Автопарк и классы</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Подбираем класс автомобиля под задачу: по городу, в аэропорт или на межгород.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {[
              { t: "Стандарт", d: "Оптимально для города и коротких поездок." },
              { t: "Комфорт", d: "Больше пространства, удобно с багажом." },
              { t: "Бизнес", d: "Представительно и спокойно для важных поездок." },
              { t: "Минивэн", d: "4–7 мест и большой багаж для семьи/группы." },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur">
                <div className="text-sm font-extrabold text-zinc-900">{x.t}</div>
                <div className="mt-2 text-sm leading-6 text-zinc-600">{x.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-sky-200/70 bg-sky-50/70 p-5">
            <div className="text-sm font-extrabold text-zinc-900">Важно</div>
            <div className="mt-2 text-sm leading-6 text-zinc-700">
              Мы <b>согласуем стоимость до подачи автомобиля</b>. Если нужны остановки по пути, детское кресло, встреча с
              табличкой или помощь с багажом — укажите это в комментарии к заявке.
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-zinc-200 bg-white/75 p-6 shadow-sm backdrop-blur md:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Регионы и направления</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Работаем по России: городские поездки, аэропорты, вокзалы и междугородние маршруты. География постоянно
            расширяется — если нужного направления нет на сайте, оставьте заявку, и мы предложим вариант.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              {
                t: "Город",
                d: "Поездки по городу и области, встречи у дома/офиса, подача по адресу.",
              },
              {
                t: "Аэропорты",
                d: "Трансферы в аэропорт и из аэропорта, встреча по прилёту, помощь с багажом.",
              },
              {
                t: "Межгород",
                d: "Поездки между городами, в том числе с остановками и вариантом туда-обратно.",
              },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur">
                <div className="text-sm font-extrabold text-zinc-900">{x.t}</div>
                <div className="mt-2 text-sm leading-6 text-zinc-600">{x.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
            >
              Смотреть услуги
            </Link>

            <Link
              href="/faq"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              Вопросы и ответы
            </Link>

            <Link
              href="/reviews"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              Отзывы
            </Link>
          </div>
        </section>

        <footer className="mt-8 text-xs text-zinc-500">© {new Date().getFullYear()} Вектор РФ. Все права защищены.</footer>
      </div>
    </main>
  );
}