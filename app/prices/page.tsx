import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { PageShell, Tag } from "@/app/ui/shared";
import { BLOG_COMMERCIAL_LINKS, CORE_SERVICE_LINKS } from "@/lib/internal-links";

const SITE_URL = "https://vector-rf.ru";
const PAGE_URL = `${SITE_URL}/prices`;

export const metadata: Metadata = {
  title: "Цены на такси межгород и трансферы — Вектор РФ",
  description:
    "Стоимость междугороднего такси и трансфера в аэропорт: классы авто, примерные цены по маршрутам, факторы расчёта. Финальная цена фиксируется до выезда.",
  alternates: { canonical: "/prices" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Цены на такси и трансферы — Вектор РФ",
    description:
      "Примерные цены по классам авто и маршрутам. Стоимость фиксируется заранее до выезда.",
    siteName: "Вектор РФ",
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Цены на такси и трансферы — Вектор РФ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Цены на такси и трансферы — Вектор РФ",
    description: "Примерные цены по маршрутам и классам. Финальная стоимость до выезда.",
    images: ["/og.jpg"],
  },
};

const PRICE_TABLE = [
  { route: "Москва — Нижний Новгород", km: 430, std: "от 13 000 ₽", comfort: "от 17 500 ₽", biz: "от 34 000 ₽", van: "от 23 500 ₽", href: "/moskva/nizhniy-novgorod" },
  { route: "Москва — Тула", km: 175, std: "от 5 000 ₽", comfort: "от 7 000 ₽", biz: "от 14 000 ₽", van: "от 9 500 ₽", href: "/moskva/tula" },
  { route: "Москва — Ярославль", km: 280, std: "от 8 500 ₽", comfort: "от 11 500 ₽", biz: "от 22 000 ₽", van: "от 15 000 ₽", href: "/moskva/yaroslavl" },
  { route: "Москва — Казань", km: 820, std: "от 25 000 ₽", comfort: "от 33 500 ₽", biz: "от 65 500 ₽", van: "от 45 000 ₽", href: "/moskva/kazan" },
  { route: "Нижний Новгород — Казань", km: 400, std: "от 12 000 ₽", comfort: "от 16 000 ₽", biz: "от 32 000 ₽", van: "от 22 000 ₽", href: "/nizhniy-novgorod/kazan" },
  { route: "Краснодар — Сочи", km: 280, std: "от 8 500 ₽", comfort: "от 11 500 ₽", biz: "от 22 000 ₽", van: "от 15 000 ₽", href: "/krasnodar/sochi" },
  { route: "Екатеринбург — Тюмень", km: 330, std: "от 10 000 ₽", comfort: "от 13 500 ₽", biz: "от 26 000 ₽", van: "от 18 000 ₽", href: "/yekaterinburg/tyumen" },
  { route: "Трансфер в аэропорт (30–60 км)", km: null, std: "от 1 000 ₽", comfort: "от 1 500 ₽", biz: "от 3 500 ₽", van: "от 2 000 ₽", href: "/transfer-v-aeroport" },
];

const CAR_CLASSES = [
  {
    name: "Стандарт",
    badge: "Эконом",
    desc: "Комфортный седан для 1–3 пассажиров с небольшим багажом. Оптимальный выбор для большинства маршрутов.",
    features: ["до 3 пассажиров", "1–2 чемодана", "кондиционер"],
  },
  {
    name: "Комфорт",
    badge: "Популярный",
    highlight: true,
    desc: "Автомобиль бизнес-класса для тех, кто ценит пространство в длинной дороге. Подходит для семьи или деловой поездки.",
    features: ["до 3 пассажиров", "просторный салон", "увеличенный багажник"],
  },
  {
    name: "Бизнес",
    badge: "Премиум",
    desc: "Представительский седан для деловых поездок и трансферов VIP-уровня. Mercedes, BMW или аналог.",
    features: ["до 3 пассажиров", "люксовый салон", "встреча с табличкой"],
  },
  {
    name: "Минивэн",
    badge: "Группа",
    desc: "Вместительный минивэн для семьи, компании или большого багажа. Идеален для семейных поездок и аэропорта.",
    features: ["до 6–7 пассажиров", "много багажа", "детские кресла"],
  },
];

const FACTORS = [
  { title: "Расстояние", desc: "Основной фактор — километраж маршрута от двери до двери." },
  { title: "Класс авто", desc: "Стандарт, комфорт, бизнес или минивэн — каждый класс имеет свою базовую ставку." },
  { title: "Тип маршрута", desc: "Городская поездка, межгород или аэропорт рассчитываются по разным формулам." },
  { title: "Время подачи", desc: "Ночные и праздничные выезды могут иметь надбавку." },
  { title: "Дополнительные условия", desc: "Детские кресла, большой багаж, питомцы — уточняется при бронировании." },
  { title: "Обратный маршрут", desc: "Заказ туда-обратно может быть выгоднее двух отдельных поездок." },
];

const faq = [
  {
    question: "От чего зависит стоимость поездки?",
    answer: "Стоимость определяется маршрутом, расстоянием, классом авто, типом поездки и временем подачи. Финальная цена фиксируется заранее до выезда.",
  },
  {
    question: "Почему нет фиксированного тарифа?",
    answer: "Каждый маршрут индивидуален: разные дороги, расстояния и условия. Мы рассчитываем цену точно под ваш маршрут, а не берём усреднённую ставку.",
  },
  {
    question: "Можно ли узнать цену заранее?",
    answer: "Да. Оставьте заявку на сайте или напишите в Telegram — оператор рассчитает стоимость и подтвердит цену до выезда, без скрытых доплат.",
  },
  {
    question: "Есть ли скидки при заказе туда-обратно?",
    answer: "Да, заказ в обе стороны часто выходит выгоднее двух раздельных поездок. Уточняйте при оформлении.",
  },
  {
    question: "Какой класс авто выбрать для семьи?",
    answer: "Для 3–4 человек с чемоданами лучше всего подойдёт комфорт или минивэн. Для 5+ пассажиров — только минивэн.",
  },
  {
    question: "Принимаете ли оплату по безналу?",
    answer: "Да, доступна оплата наличными и безналичный расчёт. Для организаций предоставляем закрывающие документы.",
  },
];

export default function PricesPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Цены", item: PAGE_URL },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  // PriceSpecification для Schema.org — помогает поисковику понять ценовой диапазон
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Такси межгород и трансферы — Вектор РФ",
    url: PAGE_URL,
    provider: {
      "@type": "Organization",
      name: "Вектор РФ",
      url: SITE_URL,
      telephone: "+78002225650",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Классы автомобилей",
      itemListElement: CAR_CLASSES.map((cls) => ({
        "@type": "Offer",
        name: cls.name,
        description: cls.desc,
      })),
    },
  };

  return (
    <PageShell>
      <Script id="ld-prices-breadcrumbs" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="ld-prices-faq" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="ld-prices-service" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14 space-y-8">

        {/* HEADER */}
        <div className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm md:p-8">
          <nav className="text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-slate-900 transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-600 font-medium">Цены</span>
          </nav>

          <div className="flex flex-wrap gap-2 mb-4">
            <Tag>Стоимость до выезда</Tag>
            <Tag>Без скрытых доплат</Tag>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Цены на такси и трансферы
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Стоимость зависит от маршрута, класса авто и условий поездки. Цену рассчитываем индивидуально
            и подтверждаем до выезда — никаких сюрпризов в дороге.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/#order"
              className="btn-primary inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold">
              Рассчитать маршрут
            </Link>
            <Link href="/contacts"
              className="btn-ghost inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold">
              Спросить оператора
            </Link>
          </div>
        </div>

        {/* КЛАССЫ АВТО */}
        <section>
          <h2 className="text-xl font-extrabold text-slate-900 mb-4 px-1">Классы автомобилей</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CAR_CLASSES.map((cls) => (
              <div key={cls.name}
                className={`rounded-3xl border p-5 shadow-sm ${cls.highlight
                  ? "border-blue-400 bg-blue-600 text-white"
                  : "border-blue-100/60 bg-white/82 backdrop-blur-md"}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`text-lg font-extrabold ${cls.highlight ? "text-white" : "text-slate-900"}`}>
                    {cls.name}
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cls.highlight
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
              </div>
            ))}
          </div>
        </section>

        {/* ТАБЛИЦА ЦЕН */}
        <section className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Примерные цены по маршрутам</h2>
          <p className="text-sm text-slate-500 mb-5">
            Ориентиры для расчёта. Точная стоимость подтверждается при оформлении заявки.
          </p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm border-collapse min-w-[560px]">
              <thead>
                <tr className="bg-blue-50 text-left">
                  <th className="px-4 py-3 font-bold text-slate-800 rounded-tl-xl">Маршрут</th>
                  <th className="px-4 py-3 font-bold text-slate-800 text-center">Стандарт</th>
                  <th className="px-4 py-3 font-bold text-slate-800 text-center">Комфорт</th>
                  <th className="px-4 py-3 font-bold text-slate-800 text-center">Бизнес</th>
                  <th className="px-4 py-3 font-bold text-slate-800 text-center rounded-tr-xl">Минивэн</th>
                </tr>
              </thead>
              <tbody>
                {PRICE_TABLE.map((row) => (
                  <tr key={row.route} className="border-b border-blue-50 hover:bg-blue-50/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700">
                      <Link href={row.href} className="hover:text-blue-700 transition-colors hover:underline underline-offset-2">
                        {row.route}
                        {row.km && <span className="ml-1.5 text-xs text-slate-400 font-normal">{row.km} км</span>}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">{row.std}</td>
                    <td className="px-4 py-3 text-center text-slate-600">{row.comfort}</td>
                    <td className="px-4 py-3 text-center text-slate-600">{row.biz}</td>
                    <td className="px-4 py-3 text-center text-slate-600">{row.van}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            * Цены ориентировочные. Финальная стоимость рассчитывается под ваш маршрут и фиксируется до выезда.
          </p>
        </section>

        {/* ЧТО ВЛИЯЕТ НА ЦЕНУ */}
        <section className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-5">Что влияет на стоимость</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FACTORS.map((f) => (
              <div key={f.title} className="rounded-2xl border border-blue-100/60 bg-blue-50/40 p-4">
                <div className="text-sm font-bold text-slate-800 mb-1">{f.title}</div>
                <p className="text-xs leading-5 text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-blue-600 text-white p-5">
            <div className="font-bold mb-1">Как узнать точную цену?</div>
            <p className="text-sm text-blue-100 mb-4">
              Оставьте заявку — оператор рассчитает стоимость и подтвердит её до выезда.
              Никаких счётчиков и доплат в дороге.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/#order"
                className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50 transition-colors">
                Оставить заявку
              </Link>
              <Link href="/contacts"
                className="inline-flex items-center rounded-xl border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                Написать в Telegram
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-5">Вопросы о стоимости</h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <div key={item.question} className="rounded-2xl border border-blue-100/60 bg-blue-50/40 p-4">
                <div className="text-sm font-bold text-slate-800">{item.question}</div>
                <div className="mt-1.5 text-sm leading-6 text-slate-500">{item.answer}</div>
              </div>
            ))}
          </div>
        </section>

        {/* БЛОГ */}
        <section className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900 mb-1">Читайте перед поездкой</h2>
          <p className="text-sm text-slate-500 mb-4">Статьи, которые помогают спланировать маршрут и выбрать формат поездки</p>
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
        </section>

        {/* БЫСТРЫЕ ССЫЛКИ */}
        <section className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900 mb-4">Услуги и маршруты</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            <Link href="/taxi-mezhgorod"
              className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors">
              Такси межгород →
            </Link>
            <Link href="/blog"
              className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              Блог о поездках
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {CORE_SERVICE_LINKS.filter(l => l.href !== "/prices").map((item) => (
              <Link key={item.href} href={item.href}
                className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm hover:bg-blue-50/50 transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </section>

      </main>
    </PageShell>
  );
}
