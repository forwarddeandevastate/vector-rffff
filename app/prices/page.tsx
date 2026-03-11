import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  PageShell,
} from "@/app/ui/shared";

const SITE_URL = "https://vector-rf.ru";
const PAGE_URL = `${SITE_URL}/prices`;

export const metadata: Metadata = {
  title: "Цены на такси межгород и трансферы по России",
  description:
    "Цены на междугороднее такси и трансферы: стоимость зависит от маршрута, класса автомобиля и условий поездки. Финальная цена подтверждается заранее.",
  alternates: {
    canonical: "/prices",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Цены на поездки и трансферы",
    description:
      "Стоимость зависит от маршрута, класса автомобиля и условий поездки. Финальная цена подтверждается заранее.",
    siteName: "Вектор РФ",
    locale: "ru_RU",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Цены на поездки и трансферы",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Цены на поездки и трансферы",
    description:
      "Стоимость зависит от маршрута, класса автомобиля и условий поездки. Финальная цена подтверждается заранее.",
    images: ["/og.jpg"],
  },
};

const faq = [
  {
    question: "От чего зависит стоимость поездки?",
    answer:
      "Стоимость зависит от маршрута, расстояния, типа поездки, класса автомобиля, времени подачи и дополнительных условий. Для междугородних и аэропортных поездок также важны особенности маршрута.",
  },
  {
    question: "Когда сообщается финальная цена?",
    answer:
      "Финальная стоимость подтверждается заранее после уточнения маршрута, времени подачи и параметров поездки.",
  },
  {
    question: "Есть ли выбор классов автомобилей?",
    answer:
      "Да, доступны стандарт, комфорт, бизнес и минивэн. Класс подбирается под формат поездки, количество пассажиров и багаж.",
  },
  {
    question: "Можно ли заранее понять примерную стоимость?",
    answer:
      "Да, на сайте доступен расчёт по маршруту. После уточнения деталей стоимость подтверждается окончательно.",
  },
];

export default function PricesPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Цены на такси межгород и трансферы по России", item: PAGE_URL },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <PageShell>
      <Script
        id="ld-prices-breadcrumbs"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="ld-prices-faq"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <div className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm md:p-8">
          <nav className="text-sm text-slate-400">
            <Link href="/" className="hover:text-slate-900">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span>Цены</span>
          </nav>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Цены на поездки и трансферы
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
            Стоимость поездки зависит от направления, расстояния, класса
            автомобиля и условий маршрута. На сайте можно получить
            предварительный расчёт, а итоговая стоимость подтверждается заранее,
            до поездки. Это важно и для междугородних маршрутов, и для
            аэропортных трансферов, и для городских поездок.
          </p>

          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
            Такой подход позволяет заранее понимать формат поездки и условия
            заказа. При этом цена зависит не только от километража, но и от типа
            маршрута, времени подачи, обратной поездки и класса автомобиля.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {["Стандарт", "Комфорт", "Бизнес / минивэн"].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-blue-100/60 bg-blue-50/50 p-5"
              >
                <div className="text-sm font-semibold text-slate-800">{item}</div>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-blue-100/60 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">
            Что влияет на стоимость
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
            <p>
              На итоговую цену влияет маршрут, расстояние, выбранный класс
              автомобиля, время поездки и особенности заказа. Для аэропортных и
              междугородних маршрутов также важны формат подачи, наличие багажа
              и параметры обратного пути.
            </p>
            <p>
              Если маршрут известен заранее, можно быстро получить
              предварительный расчёт и понять порядок стоимости. После
              подтверждения деталей цена фиксируется заранее, что делает заказ
              более понятным и удобным.
            </p>
            <p>
              Такой формат особенно важен для поездок на дальние расстояния,
              трансферов к рейсу и деловых маршрутов, где нужно планировать
              время и бюджет заранее.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="btn-primary inline-flex items-center rounded-xl px-5 py-3 text-sm"
            >
              Рассчитать поездку
            </Link>
            <Link
              href="/intercity-taxi"
              className="btn-ghost inline-flex items-center rounded-xl px-5 py-3 text-sm"
            >
              Междугороднее такси
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-blue-100/60 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">FAQ</h2>
          <div className="mt-4 space-y-4">
            {faq.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-blue-100/60 bg-blue-50/50 p-4"
              >
                <div className="text-sm font-bold text-slate-800">
                  {item.question}
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-500">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
