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
  title: "Услуги трансфера и такси | Вектор РФ",
  description:
    "Все услуги «Вектор РФ»: трансфер в аэропорт, междугородние поездки, минивэн, корпоративные перевозки и поездки по городу. Онлайн-заявка 24/7.",
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/services`,
    title: "Услуги — Вектор РФ",
    description:
      "Трансфер в аэропорт, межгород, минивэн, корпоративное такси и поездки по городу. Онлайн-заявка 24/7.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Услуги — Вектор РФ",
    description:
      "Трансфер в аэропорт, межгород, минивэн, корпоративные перевозки и поездки по городу.",
    images: ["/og.jpg"],
  },
};

function ServiceCard({
  title,
  desc,
  href,
  badge,
}: {
  title: string;
  desc: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur transition",
        "hover:bg-white hover:border-sky-200/70 hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {badge ? (
            <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
              {badge}
            </div>
          ) : null}

          <div className="mt-3 text-lg font-extrabold tracking-tight text-zinc-900 group-hover:text-sky-700">
            {title}
          </div>
          <div className="mt-2 text-sm leading-6 text-zinc-600">{desc}</div>
        </div>

        <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-sky-50 ring-1 ring-sky-100">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600" />
        </div>
      </div>

      <div className="mt-5 text-sm font-bold text-sky-700">
        Подробнее <span className="ml-1 transition group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}

export default function ServicesPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Услуги", item: `${SITE_URL}/services` },
    ],
  };

  return (
    <main className="min-h-screen text-zinc-900">
      <Script
        id="ld-services-breadcrumbs"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* фон как на главной */}
      <div className="fixed inset-0 -z-20 bg-[#f3f7ff]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_50%_-10%,rgba(56,189,248,0.28),transparent_60%),radial-gradient(900px_520px_at_12%_18%,rgba(59,130,246,0.14),transparent_55%),radial-gradient(900px_520px_at_88%_20%,rgba(99,102,241,0.12),transparent_55%)]" />
      <div className="fixed inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white/70 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <header className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-600">Услуги</div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Трансферы и перевозки «Вектор РФ»
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                Здесь собраны основные направления работы: город, аэропорт, межгород, минивэн и корпоративные поездки.
                Выберите услугу и оставьте заявку онлайн — работаем 24/7.
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
              className={cn(
                "rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur hover:bg-white"
              )}
            >
              <div className="text-xs font-semibold text-zinc-600">Телефон</div>
              <div className="mt-1 text-sm font-extrabold text-zinc-900">{PHONE_DISPLAY}</div>
              <div className="mt-1 text-sm text-zinc-600">Нажмите, чтобы позвонить</div>
            </a>

            <a
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur hover:bg-white"
              )}
            >
              <div className="text-xs font-semibold text-zinc-600">Telegram</div>
              <div className="mt-1 text-sm font-extrabold text-zinc-900">Написать в Telegram</div>
              <div className="mt-1 text-sm text-zinc-600">Ответим быстрее по срочным вопросам</div>
            </a>
          </div>
        </header>

        <section className="mt-8">
          <div className="grid gap-4 md:grid-cols-2">
            <ServiceCard
              badge="Аэропорт"
              title="Трансфер в аэропорт / из аэропорта"
              desc="Встреча по рейсу, помощь с багажом, подача к терминалу. Можно указать номер рейса и табличку."
              href="/airport-transfer"
            />

            <ServiceCard
              badge="Межгород"
              title="Междугороднее такси"
              desc="Поездки между городами по России. Согласуем маршрут, остановки и стоимость заранее."
              href="/intercity-taxi"
            />

            <ServiceCard
              badge="Минивэн"
              title="Минивэн / групповой трансфер"
              desc="Когда нужно больше мест и багажа: 4–7 пассажиров. Отлично подходит для аэропорта и межгорода."
              href="/minivan-transfer"
            />

            <ServiceCard
              badge="Для бизнеса"
              title="Корпоративное такси и перевозки"
              desc="Регулярные поездки для сотрудников и гостей. Работа по договору, безнал, отчётность."
              href="/corporate-taxi"
            />

            <ServiceCard
              badge="Город"
              title="Поездки по городу"
              desc="Встречи, поездки по Нижнему Новгороду и другим городам. Быстрая подача и подтверждение заявки."
              href="/city-transfer"
            />

            <div className="rounded-3xl border border-zinc-200 bg-white/75 p-6 shadow-sm backdrop-blur md:p-8">
              <div className="text-sm font-extrabold text-zinc-900">Не нашли нужную услугу?</div>
              <div className="mt-2 text-sm leading-6 text-zinc-600">
                Оставьте заявку — мы подберём маршрут, класс автомобиля и заранее согласуем стоимость.
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/#order"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
                >
                  Оставить заявку
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
                >
                  Вопросы и ответы
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
                >
                  О компании
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-8 text-xs text-zinc-500">
          © {new Date().getFullYear()} Вектор РФ. Все права защищены.
        </footer>
      </div>
    </main>
  );
}