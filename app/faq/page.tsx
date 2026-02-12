import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

const PHONE_DISPLAY = "+7 (831) 423-39-29";
const PHONE_TEL = "+78314233929";
const TELEGRAM = "https://t.me/vector_rf52";

const FAQ = [
  {
    q: "Сколько стоит трансфер и как считается цена?",
    a: "Стоимость зависит от маршрута и класса авто (Стандарт/Комфорт/Бизнес/Минивэн). После заявки мы уточняем детали и подтверждаем стоимость до подачи автомобиля — без сюрпризов.",
  },
  {
    q: "Как быстро подаётся машина?",
    a: "По городу обычно 15–30 минут (зависит от района и времени). В аэропорт и на межгород — подача к согласованному времени.",
  },
  {
    q: "Встречаете в аэропорту с табличкой?",
    a: "Да. Водитель встречает в зоне прилёта с табличкой. Укажите это и номер рейса в комментарии к заявке — подтвердим детали.",
  },
  {
    q: "Можно ли заказать межгород туда-обратно?",
    a: "Да. Отметьте «Туда-обратно» в форме или напишите в комментарии — согласуем детали обратной поездки.",
  },
  {
    q: "Можно ли добавить остановки по пути?",
    a: "Да. Перечислите остановки в комментарии — учтём это при согласовании стоимости.",
  },
  {
    q: "Какие классы автомобилей доступны?",
    a: "Стандарт, Комфорт, Бизнес и Минивэн. Выберите класс в форме — мы подтвердим доступность.",
  },
  {
    q: "Работаете с компаниями?",
    a: "Да. Корпоративные перевозки для сотрудников и гостей. Работаем по договору, возможен безнал и закрывающие документы.",
  },
  {
    q: "Можно заказать детское кресло?",
    a: "Да. Укажите возраст ребёнка в комментарии — подберём подходящее кресло.",
  },
] as const;

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export const metadata: Metadata = {
  title: "Вопросы и ответы (FAQ) | Вектор РФ",
  description:
    "Ответы на частые вопросы о трансферах: стоимость, подача авто, аэропорты, межгород, классы автомобилей, корпоративные поездки. Онлайн-заявка 24/7.",
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/faq`,
    title: "Вопросы и ответы — Вектор РФ",
    description:
      "FAQ по трансферам: стоимость, подача авто, аэропорты, межгород, классы автомобилей, корпоративные поездки.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Вопросы и ответы — Вектор РФ",
    description: "FAQ по трансферам: стоимость, подача авто, аэропорты, межгород, классы автомобилей.",
    images: ["/og.jpg"],
  },
};

export default function FaqPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Вопросы и ответы", item: `${SITE_URL}/faq` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <main className="min-h-screen text-zinc-900">
      <Script
        id="ld-faq-breadcrumbs"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="ld-faq-page"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* фон как на главной */}
      <div className="fixed inset-0 -z-20 bg-[#f3f7ff]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_50%_-10%,rgba(56,189,248,0.28),transparent_60%),radial-gradient(900px_520px_at_12%_18%,rgba(59,130,246,0.14),transparent_55%),radial-gradient(900px_520px_at_88%_20%,rgba(99,102,241,0.12),transparent_55%)]" />
      <div className="fixed inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white/70 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-600">FAQ</div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Вопросы и ответы
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                Коротко и по делу: стоимость, подача, аэропорт, межгород, классы авто и корпоративные поездки.
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
        </div>

        <section className="mt-8 rounded-3xl border border-zinc-200 bg-white/75 p-6 shadow-sm backdrop-blur md:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Частые вопросы</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Если не нашли ответ — оставьте заявку, уточним детали и согласуем стоимость до подачи автомобиля.
          </p>

          <div className="mt-6 space-y-3">
            {FAQ.map((it) => (
              <details
                key={it.q}
                className="group rounded-2xl border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="text-sm font-extrabold text-zinc-900">{it.q}</span>
                  <span className="select-none rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-sm text-zinc-700 group-open:hidden">
                    +
                  </span>
                  <span className="hidden select-none rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-sm text-zinc-700 group-open:inline">
                    —
                  </span>
                </summary>
                <div className="mt-3 text-sm leading-6 text-zinc-600">{it.a}</div>
              </details>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/#order"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
            >
              Оставить заявку
            </Link>
            <Link
              href="/intercity-taxi"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              Межгород
            </Link>
            <Link
              href="/airport-transfer"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              Аэропорт
            </Link>
            <Link
              href="/corporate"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              Корпоративным
            </Link>
          </div>
        </section>

        <footer className="mt-8 text-xs text-zinc-500">
          © {new Date().getFullYear()} Вектор РФ. Все права защищены.
        </footer>
      </div>
    </main>
  );
}