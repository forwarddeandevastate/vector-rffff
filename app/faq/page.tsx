import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { PageShell, Breadcrumb, GlassPanel, Tag } from "@/app/ui/shared";

const SITE_URL = "https://vector-rf.ru";
const PAGE_URL = `${SITE_URL}/faq`;

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Часто задаваемые вопросы о междугороднем такси, трансфере в аэропорт, стоимости поездок, классах автомобилей и порядке оформления заявки.",
  alternates: {
    canonical: "/faq",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "FAQ — Вектор РФ",
    description:
      "Ответы на частые вопросы о поездках, трансферах, стоимости и оформлении заявки.",
    siteName: "Вектор РФ",
    locale: "ru_RU",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "FAQ — Вектор РФ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ — Вектор РФ",
    description:
      "Ответы на частые вопросы о поездках, трансферах, стоимости и оформлении заявки.",
    images: ["/og.jpg"],
  },
};

const faq = [
  {
    question: "Как оформить заявку?",
    answer:
      "Можно оставить заявку через форму на сайте, а также связаться по телефону, в Telegram или WhatsApp.",
  },
  {
    question: "Когда сообщается финальная стоимость?",
    answer:
      "Финальная стоимость подтверждается заранее, после уточнения маршрута, времени подачи и класса автомобиля.",
  },
  {
    question: "Какие доступны классы автомобилей?",
    answer:
      "Обычно доступны стандарт, комфорт, бизнес и минивэн. Вариант подбирается под задачу и количество пассажиров.",
  },
  {
    question: "Можно ли заказать поездку заранее?",
    answer:
      "Да, поездку можно оформить заранее на нужную дату и время.",
  },
  {
    question: "Работаете ли вы ночью и рано утром?",
    answer:
      "Да, заявки принимаются круглосуточно.",
  },
  {
    question: "Можно ли заказать междугороднюю поездку без пересадок?",
    answer:
      "Да, основной формат сервиса — прямые поездки между городами без пересадок.",
  },
];

export default function FaqPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "FAQ", item: PAGE_URL },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question", name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <Script id="ld-faq-breadcrumbs" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="ld-faq-page" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageShell>
        <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
          <Breadcrumb items={[{ name: "Главная", href: "/" }, { name: "FAQ", href: "/faq" }]} />

          <div className="mt-6">
            <Tag>Частые вопросы</Tag>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Вопросы и ответы</h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
              Ответы на основные вопросы о поездках, трансферах, стоимости и оформлении заявки.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            {faq.map((item, i) => (
              <div key={item.question} className="rounded-2xl border border-blue-100/60 bg-white/80 p-5 backdrop-blur-sm shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-xs font-bold text-blue-400 shrink-0 w-5 text-center">{i + 1}</span>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{item.question}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <GlassPanel className="mt-8 p-6">
            <div className="text-sm font-bold text-slate-800 mb-3">Остались вопросы?</div>
            <p className="text-sm text-slate-500 mb-4">Напишите нам или оставьте заявку — уточним все детали.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/" className="btn-primary inline-flex items-center rounded-xl px-4 py-2.5 text-sm">Оставить заявку</Link>
              <Link href="/contacts" className="btn-ghost inline-flex items-center rounded-xl px-4 py-2.5 text-sm">Контакты</Link>
            </div>
          </GlassPanel>
        </main>
      </PageShell>
    </>
  );
}
