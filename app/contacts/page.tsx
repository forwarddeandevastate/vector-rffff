import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

const PHONE_DISPLAY = "+7 (831) 423-39-29";
const PHONE_TEL = "+78314233929";
const TELEGRAM = "https://t.me/vector_rf52";
const TELEGRAM_USERNAME = "@vector_rf52";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export const metadata: Metadata = {
  title: "Контакты | Вектор РФ",
  description:
    "Контакты сервиса «Вектор РФ»: телефон, Telegram, режим работы 24/7. Оставьте заявку на трансфер по городу, в аэропорт или на межгород.",
  alternates: { canonical: `${SITE_URL}/contacts` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/contacts`,
    title: "Контакты — Вектор РФ",
    description: "Телефон, Telegram и режим работы. Трансферы и поездки по России. 24/7.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Контакты — Вектор РФ",
    description: "Телефон, Telegram и режим работы. Трансферы 24/7.",
    images: ["/og.jpg"],
  },
};

export default function ContactsPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Контакты", item: `${SITE_URL}/contacts` },
    ],
  };

  // Мягкая микроразметка Organization (без адреса/координат — безопасно)
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    telephone: "+7-831-423-39-29",
    sameAs: [TELEGRAM],
  };

  return (
    <main className="min-h-screen text-zinc-900">
      <Script
        id="ld-contacts-breadcrumbs"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="ld-contacts-organization"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* фон как на главной */}
      <div className="fixed inset-0 -z-20 bg-[#f3f7ff]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_50%_-10%,rgba(56,189,248,0.28),transparent_60%),radial-gradient(900px_520px_at_12%_18%,rgba(59,130,246,0.14),transparent_55%),radial-gradient(900px_520px_at_88%_20%,rgba(99,102,241,0.12),transparent_55%)]" />
      <div className="fixed inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white/70 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <header className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-600">Контакты</div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Как с нами связаться</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                Быстрее всего отвечаем в Telegram и по телефону. Работаем 24/7: город, аэропорт и межгород.
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
              <div className="mt-1 text-sm text-zinc-600">
                {TELEGRAM_USERNAME} • Ответим быстрее по срочным вопросам
              </div>
            </a>
          </div>
        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="rounded-3xl border border-zinc-200 bg-white/75 p-6 shadow-sm backdrop-blur md:p-8">
              <h2 className="text-2xl font-extrabold tracking-tight">Режим работы и география</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Подтверждаем детали и стоимость до подачи автомобиля. Учитываем багаж, детское кресло и остановки.
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur">
                  <div className="text-xs font-semibold text-zinc-600">Работаем</div>
                  <div className="mt-1 text-sm font-extrabold text-zinc-900">24/7</div>
                  <div className="mt-1 text-sm text-zinc-600">Город • Аэропорты • Межгород</div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur">
                  <div className="text-xs font-semibold text-zinc-600">Основной регион</div>
                  <div className="mt-1 text-sm font-extrabold text-zinc-900">Нижний Новгород и область</div>
                  <div className="mt-1 text-sm text-zinc-600">Также — поездки по России</div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur">
                <div className="text-sm font-extrabold text-zinc-900">Что написать в сообщении</div>
                <div className="mt-3 grid gap-2 text-sm text-zinc-700">
                  <div className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                    <span>Откуда → куда (адрес или город)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                    <span>Дата и время подачи</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                    <span>Класс авто: Стандарт / Комфорт / Бизнес / Минивэн</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                    <span>Пожелания: багаж, детское кресло, остановки, номер рейса</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
                >
                  Услуги
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
                >
                  Вопросы и ответы
                </Link>
                <Link
                  href="/#order"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
                >
                  Оставить заявку
                </Link>
              </div>
            </div>
          </div>

          <aside className="md:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-white/85 p-6 shadow-xl backdrop-blur md:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-zinc-900">Быстрый контакт</div>
                  <div className="mt-1 text-sm text-zinc-600">Для срочных вопросов — Telegram или звонок.</div>
                </div>
                <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                  быстро
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
                >
                  Позвонить: {PHONE_DISPLAY}
                </a>

                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
                >
                  Написать в Telegram
                </a>

                <Link
                  href="/#order"
                  className="mt-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
                >
                  Оставить заявку на сайте
                </Link>
              </div>

              <div className="mt-4 text-xs text-zinc-500">
                Нажимая “Оставить заявку”, вы соглашаетесь на обработку персональных данных.
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur md:p-7">
              <div className="text-sm font-extrabold text-zinc-900">Документы</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/privacy" className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 hover:underline">
                  Политика конфиденциальности
                </Link>
                <span className="text-zinc-300">•</span>
                <Link
                  href="/personal-data"
                  className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 hover:underline"
                >
                  Согласие на обработку ПДн
                </Link>
                <span className="text-zinc-300">•</span>
                <Link
                  href="/agreement"
                  className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 hover:underline"
                >
                  Пользовательское соглашение
                </Link>
              </div>
            </div>
          </aside>
        </section>

        <footer className="mt-8 text-xs text-zinc-500">© {new Date().getFullYear()} Вектор РФ. Все права защищены.</footer>
      </div>
    </main>
  );
}