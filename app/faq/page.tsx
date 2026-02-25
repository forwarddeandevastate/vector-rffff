import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

export const metadata: Metadata = {
  title: "Вопросы и ответы | Трансфер и междугороднее такси | Вектор РФ",
  description:
    "Ответы на частые вопросы о трансферах и междугородних поездках: стоимость, подача, ожидание, встреча в аэропорту, детское кресло, остановки, оплата и документы.",
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/faq`,
    title: "Вопросы и ответы | Вектор РФ",
    description:
      "Стоимость, подача, аэропорты, ожидание, детское кресло, остановки, оплата и документы — ответы на популярные вопросы.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Вопросы и ответы | Вектор РФ",
    description:
      "Ответы на частые вопросы о трансферах и междугородних поездках — Вектор РФ.",
    images: ["/og.jpg"],
  },
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const PHONE_TEL = "+78314233929";
const PHONE_DISPLAY = "+7 (831) 423-39-29";
const TELEGRAM = "https://t.me/vector_rf52";
const WHATSAPP = "https://wa.me/78314233929";

type FaqItem = {
  q: string;
  a: string;
};

const FAQ: FaqItem[] = [
  {
    q: "Сколько стоит трансфер и как формируется цена?",
    a: "Цена зависит от маршрута и класса автомобиля (Стандарт/Комфорт/Бизнес/Минивэн). После заявки мы связываемся, уточняем детали и подтверждаем стоимость до подачи автомобиля.",
  },
  {
    q: "Можно ли заказать поездку заранее?",
    a: "Да. Укажите дату и время — мы зафиксируем заявку и подтвердим подачу автомобиля к согласованному времени.",
  },
  {
    q: "Как быстро подаётся машина по городу?",
    a: "Обычно 15–30 минут (зависит от района и времени). Если нужно к конкретному времени — лучше оформить заявку заранее.",
  },
  {
    q: "Встречаете в аэропорту с табличкой?",
    a: "Да. Водитель встречает в зоне прилёта с табличкой. Можно указать номер рейса и имя для таблички в комментарии к заявке.",
  },
  {
    q: "Есть ли ожидание и сколько оно стоит?",
    a: "Ожидание и детали (например, при задержке рейса) согласуем заранее. В заявке укажите рейс/время — мы подстроим подачу.",
  },
  {
    q: "Можно ли добавить остановки по пути?",
    a: "Да. Просто перечислите остановки в комментарии — учтём это при согласовании стоимости и времени.",
  },
  {
    q: "Можно ли заказать межгород туда-обратно?",
    a: "Да. Отметьте «Туда-обратно» в форме или напишите в комментарии — согласуем обратную поездку и время ожидания.",
  },
  {
    q: "Можно ли с детским креслом?",
    a: "Да, по возможности. Укажите возраст ребёнка/тип кресла в комментарии — подтвердим наличие.",
  },
  {
    q: "Какие способы оплаты доступны?",
    a: "Оплату и формат расчёта согласуем при подтверждении заявки. Для корпоративных клиентов возможен договор и закрывающие документы.",
  },
  {
    q: "Работаете с компаниями (корпоративные поездки)?",
    a: "Да. Регулярные поездки сотрудников/гостей, договор, безнал и отчётность — напишите в Telegram или оставьте заявку.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="min-h-screen text-zinc-900">
      {/* ✅ SEO: JSON-LD в HTML сразу */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="fixed inset-0 -z-20 bg-[#f3f7ff]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_50%_-10%,rgba(56,189,248,0.35),transparent_60%),radial-gradient(900px_520px_at_12%_18%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(900px_520px_at_88%_20%,rgba(99,102,241,0.14),transparent_55%)]" />
      <div className="fixed inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white/70 to-transparent" />

      <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/65 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="font-extrabold tracking-tight text-zinc-900">
            Вектор РФ
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white"
            >
              Главная
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white"
            >
              Услуги
            </Link>
            <Link
              href="/reviews"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white"
            >
              Отзывы
            </Link>
            <Link
              href="/contacts"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white"
            >
              Контакты
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white"
              title="Позвонить"
            >
              {PHONE_DISPLAY}
            </a>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white"
              title="Telegram"
            >
              Telegram
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">Вопросы и ответы</h1>
          <p className="mt-4 text-base leading-7 text-zinc-700">
            Собрали популярные вопросы про трансферы, поездки по городу и межгород. Если не нашли ответ — напишите в Telegram
            или позвоните.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold text-white shadow-sm bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:opacity-95"
            >
              Написать в Telegram
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
            >
              WhatsApp
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
            >
              Позвонить
            </a>
          </div>
        </div>

        <section className="mt-10 grid gap-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className={cn(
                "group rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur",
                "open:bg-white"
              )}
            >
              <summary className="cursor-pointer list-none">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-base font-extrabold text-zinc-900">{item.q}</h2>
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 ring-1 ring-sky-100">
                    <span className="block h-2 w-2 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600" />
                  </span>
                </div>
                <div className="mt-2 text-sm text-zinc-600">Нажмите, чтобы раскрыть ответ</div>
              </summary>

              <div className="mt-4 text-sm leading-7 text-zinc-700">{item.a}</div>

              <div className="mt-4 text-xs text-zinc-500">
                Полезно? Посмотрите также:{" "}
                <Link href="/services" className="underline hover:text-zinc-900">
                  услуги
                </Link>
                ,{" "}
                <Link href="/prices" className="underline hover:text-zinc-900">
                  цены
                </Link>
                ,{" "}
                <Link href="/contacts" className="underline hover:text-zinc-900">
                  контакты
                </Link>
                .
              </div>
            </details>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">Нужна поездка прямо сейчас?</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Оставьте заявку — мы уточним маршрут и подтвердим стоимость до подачи автомобиля.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/#order"
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold text-white shadow-sm bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:opacity-95"
            >
              Оставить заявку
            </Link>
            <Link
              href="/reviews"
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
            >
              Отзывы
            </Link>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
            >
              Контакты
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white/65 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-600">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} Вектор РФ</div>
            <div className="flex flex-wrap gap-3">
              <a className="hover:text-zinc-900 hover:underline" href={`tel:${PHONE_TEL}`}>
                {PHONE_DISPLAY}
              </a>
              <a className="hover:text-zinc-900 hover:underline" href={TELEGRAM} target="_blank" rel="noreferrer">
                Telegram
              </a>
              <a className="hover:text-zinc-900 hover:underline" href="/requisites">
                Реквизиты
              </a>
              <a className="hover:text-zinc-900 hover:underline" href="/prices">
                Цены
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}