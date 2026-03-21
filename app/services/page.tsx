import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { PageShell, Tag } from "@/app/ui/shared";
import { POPULAR_ROUTE_LINKS, BLOG_COMMERCIAL_LINKS } from "@/lib/internal-links";

const SITE_URL = "https://vector-rf.ru";
const PAGE_URL = `${SITE_URL}/services`;

export const metadata: Metadata = {
  title: "Услуги — такси межгород, трансфер в аэропорт, минивэн",
  description:
    "Услуги Вектор РФ: междугороднее такси, трансфер в аэропорт, городские поездки, корпоративное такси и минивэн. Подбор формата поездки под задачу.",
  alternates: { canonical: "/services" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Услуги Вектор РФ",
    description: "Междугороднее такси, трансфер в аэропорт, городские поездки, корпоративное такси и минивэн.",
    siteName: "Вектор РФ",
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Услуги Вектор РФ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Услуги Вектор РФ",
    description: "Междугороднее такси, трансфер в аэропорт, городские поездки, корпоративное такси и минивэн.",
    images: ["/og.jpg"],
  },
};

const services = [
  {
    title: "Междугороднее такси",
    text: "Прямые поездки между городами без пересадок. Для частных, семейных и деловых маршрутов.",
    href: "/taxi-mezhgorod",
    tag: "Популярное",
  },
  {
    title: "Трансфер в аэропорт",
    text: "Подача ко времени рейса, встреча после прилёта с табличкой, помощь с багажом.",
    href: "/transfer-v-aeroport",
    tag: "Аэропорт",
  },
  {
    title: "Городские поездки",
    text: "Поездки по городу, деловые встречи, маршруты по нескольким адресам.",
    href: "/city-transfer",
    tag: "По городу",
  },
  {
    title: "Минивэн",
    text: "Семья, группа от 4 человек или большой багаж — вместительный минивэн на 6–7 мест.",
    href: "/minivan-transfer",
    tag: "Группа",
  },
  {
    title: "Корпоративные перевозки",
    text: "Сотрудники, клиенты, деловые встречи. Безнал, договор, закрывающие документы.",
    href: "/corporate-taxi",
    tag: "Бизнес",
  },
  {
    title: "Цены и классы авто",
    text: "Стандарт, комфорт, бизнес и минивэн. Примерная стоимость по популярным маршрутам.",
    href: "/prices",
    tag: "Стоимость",
  },
];

export default function ServicesPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Услуги", item: PAGE_URL },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Услуги Вектор РФ",
    itemListElement: services.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: `${SITE_URL}${item.href}`,
    })),
  };

  const servicesFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Какую услугу выбрать для межгорода?",
        acceptedAnswer: { "@type": "Answer", text: "Для 1–3 человек — стандарт или комфорт. Для группы от 4 — минивэн. Для деловой поездки — бизнес-класс." } },
      { "@type": "Question", name: "Чем трансфер отличается от обычного такси?",
        acceptedAnswer: { "@type": "Answer", text: "Трансфер бронируется заранее с фиксированной стоимостью. Конкретное время, адрес и класс авто. Никаких счётчиков." } },
      { "@type": "Question", name: "Можно ли заказать несколько автомобилей?",
        acceptedAnswer: { "@type": "Answer", text: "Да, для корпоративных клиентов организуем несколько машин разных классов. Согласовываем логистику заранее." } },
      { "@type": "Question", name: "Как оплатить поездку?",
        acceptedAnswer: { "@type": "Answer", text: "Наличными водителю или безналичным переводом. Для организаций — оплата по счёту с закрывающими документами." } },
    ],
  };

  return (
    <PageShell>
      <Script id="ld-services-breadcrumbs" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="ld-services-list" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <Script id="ld-services-faq" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesFaqJsonLd) }} />

      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14 space-y-8">

        {/* HEADER */}
        <div className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm md:p-8">
          <nav className="text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-slate-900 transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-600 font-medium">Услуги</span>
          </nav>
          <div className="flex flex-wrap gap-2 mb-4">
            <Tag>Работаем 24/7</Tag>
            <Tag>Стоимость до выезда</Tag>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Услуги Вектор РФ
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Межгород, аэропорт, город, минивэн, корпоратив — выберите формат поездки.
            Стоимость фиксируем заранее, работаем 24/7 по всей России.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/#order"
              className="btn-primary inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold">
              Оставить заявку
            </Link>
            <Link href="/prices"
              className="btn-ghost inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold">
              Цены на поездки
            </Link>
          </div>
        </div>

        {/* КАРТОЧКИ УСЛУГ */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((item) => (
            <Link key={item.href} href={item.href}
              className="group rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h2 className="text-base font-extrabold text-slate-800 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h2>
                <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  {item.tag}
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-600">{item.text}</p>
              <div className="mt-4 text-xs font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                Подробнее →
              </div>
            </Link>
          ))}
        </section>

        {/* КАК МЫ РАБОТАЕМ */}
        <section className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-5">Как мы работаем</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "1", t: "Заявка онлайн", d: "Форма на сайте, телефон или Telegram — 2 минуты." },
              { n: "2", t: "Согласование", d: "Оператор уточняет маршрут и фиксирует стоимость до выезда." },
              { n: "3", t: "Подача авто", d: "Водитель приезжает к нужному адресу в согласованное время." },
              { n: "4", t: "Комфортная поездка", d: "Прямо до адреса назначения без пересадок и ожиданий." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-blue-100/60 bg-blue-50/40 p-4">
                <div className="text-2xl font-black text-blue-600 mb-2">{s.n}</div>
                <div className="text-sm font-bold text-slate-800 mb-1">{s.t}</div>
                <p className="text-xs leading-5 text-slate-500">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ПОПУЛЯРНЫЕ МАРШРУТЫ */}
        <section className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Популярные маршруты</h2>
          <p className="text-sm text-slate-500 mb-5">Выберите направление, чтобы узнать подробности и стоимость</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_ROUTE_LINKS.map((r) => (
              <Link key={r.href} href={r.href}
                className="rounded-2xl border border-blue-100/60 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                {r.label}
              </Link>
            ))}
          </div>
        </section>

        {/* БЛОГ */}
        <section className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900 mb-1">Полезно о поездках</h2>
          <p className="text-sm text-slate-500 mb-4">Статьи блога о том, как выбрать формат и спланировать маршрут</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BLOG_COMMERCIAL_LINKS.map((b) => (
              <Link key={b.href} href={b.href}
                className="group rounded-2xl border border-blue-100/60 bg-white p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 block">Блог</span>
                <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
                  {b.label}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/blog" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
              Все статьи →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-5">Вопросы об услугах</h2>
          <div className="space-y-3">
            {[
              { q: "Какую услугу выбрать для межгорода?", a: "Для 1–3 человек — стандарт или комфорт. Для группы от 4 — минивэн. Для деловой поездки — бизнес-класс." },
              { q: "Чем трансфер отличается от обычного такси?", a: "Трансфер бронируется заранее с фиксированной стоимостью: конкретное время, адрес и класс авто. Никаких счётчиков или неожиданных доплат." },
              { q: "Можно ли заказать несколько автомобилей?", a: "Да, для корпоративных клиентов и групп организуем несколько машин. Свяжитесь с нами для согласования." },
              { q: "Как оплатить поездку?", a: "Наличными водителю или безналичным переводом. Для организаций — оплата по счёту с закрывающими документами." },
            ].map((item) => (
              <details key={item.q} className="group rounded-2xl border border-blue-100/60 bg-white/80 p-4 cursor-pointer">
                <summary className="text-sm font-semibold text-slate-900 list-none flex justify-between items-center">
                  {item.q}
                  <span className="text-blue-400 ml-2 shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

      </main>
    </PageShell>
  );
}

