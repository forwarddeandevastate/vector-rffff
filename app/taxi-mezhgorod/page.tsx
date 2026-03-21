import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  PageBackground, Header, Footer,
  GlassPanel, Tag, SectionHeading,
  IconPhone, IconTelegram,
  PHONE_DISPLAY, PHONE_TEL, TELEGRAM,
} from "@/app/ui/shared";
import ServiceFormClient from "@/app/ui/service-form-client";
import {
  POPULAR_ROUTE_LINKS, CORE_SERVICE_LINKS, BLOG_COMMERCIAL_LINKS,
} from "@/lib/internal-links";



const SITE_URL = "https://vector-rf.ru";
const PAGE_URL = `${SITE_URL}/taxi-mezhgorod`;

export const metadata: Metadata = {
  title: "Такси межгород по России — заказать 24/7, стоимость до выезда",
  description:
    "Такси межгород: прямые поездки между городами без пересадок. Стандарт, комфорт, бизнес и минивэн. Стоимость фиксируем до выезда, заявка 24/7.",
  alternates: { canonical: "/taxi-mezhgorod" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website", url: PAGE_URL,
    title: "Такси межгород — Вектор РФ",
    description: "Прямые поездки между городами России. Стоимость до выезда, 24/7.",
    siteName: "Вектор РФ", locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Такси межгород — Вектор РФ" }],
  },
};

const faq = [
  {
    q: "Как заказать такси межгород?",
    a: "Оставьте заявку на сайте, позвоните или напишите в Telegram. Оператор перезвонит в течение 15 минут, уточнит маршрут, время и класс авто, после чего подтвердит стоимость.",
  },
  {
    q: "Сколько стоит такси межгород?",
    a: "Стоимость зависит от расстояния и класса авто. Ориентир: Москва — Нижний Новгород от 13 000 ₽, Москва — Казань от 25 000 ₽ (стандарт). Точную цену называем заранее, счётчика нет.",
  },
  {
    q: "За сколько нужно бронировать?",
    a: "Рекомендуем за 1–2 дня, особенно для ранних выездов, праздников и ночных поездок. В обычное время принимаем заявки за несколько часов.",
  },
  {
    q: "Делаете ли остановки в пути?",
    a: "Да. На маршрутах длиннее 4–5 часов предусмотрена одна остановка. Место и время согласовываем при бронировании.",
  },
  {
    q: "Можно ли взять минивэн для группы?",
    a: "Да, минивэн на 6–7 мест доступен для любого маршрута. Укажите количество пассажиров и объём багажа — подберём подходящий вариант.",
  },
  {
    q: "Принимаете ли безнал и делаете документы?",
    a: "Да. Для физических лиц — наличные или перевод. Для организаций — счёт, акт, договор.",
  },
];

export default function TaxiMezhgorodPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Такси межгород", item: PAGE_URL },
    ],
  };
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${PAGE_URL}#service`,
    name: "Такси межгород по России",
    serviceType: ["Такси межгород", "Такси между городами", "Междугороднее такси"],
    url: PAGE_URL,
    areaServed: { "@type": "Country", name: "Россия" },
    provider: { "@type": "Organization", name: "Вектор РФ", url: SITE_URL, telephone: "+78002225650" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Классы автомобилей",
      itemListElement: [
        { "@type": "Offer", name: "Стандарт", description: "Базовый комфорт для 1–3 пассажиров" },
        { "@type": "Offer", name: "Комфорт", description: "Просторный салон, удобно в длинной дороге" },
        { "@type": "Offer", name: "Бизнес", description: "Представительский класс для деловых поездок" },
        { "@type": "Offer", name: "Минивэн", description: "6–7 мест для группы или большого багажа" },
      ],
    },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Script id="ld-taxi-bc" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="ld-taxi-svc" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <Script id="ld-taxi-faq" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <PageBackground />
      <Header />

      <div className="animate-page">
        <main className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-8">

          {/* ── HERO ─────────────────────────────────────────────── */}
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-10 lg:items-start">
            <section>
              <nav className="text-xs text-blue-400/80 mb-4">
                <Link href="/" className="hover:text-blue-600 transition-colors">Главная</Link>
                <span className="mx-2">/</span>
                <span className="text-blue-800/60 font-semibold">Такси межгород</span>
              </nav>

              <div className="flex flex-wrap gap-2 mb-4">
                <Tag>Прямые поездки</Tag>
                <Tag>Без пересадок</Tag>
                <Tag>Стоимость до выезда</Tag>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl leading-tight">
                Такси межгород<br />
                <span className="text-blue-600">по всей России</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Прямые поездки между городами без пересадок и привязки к расписанию.
                Оставьте заявку — уточним маршрут, назовём стоимость и организуем подачу.
                Принимаем заявки 24/7.
              </p>

              {/* Ключевые преимущества — видны поисковику */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { title: "Стоимость фиксируется до выезда", desc: "Цену называем заранее. Никаких счётчиков и доплат в дороге." },
                  { title: "Прямой маршрут без пересадок", desc: "Водитель едет от вашего адреса до адреса назначения — без лишних остановок." },
                  { title: "Классы авто под любой запрос", desc: "Стандарт, комфорт, бизнес или минивэн — выберите под маршрут и состав." },
                  { title: "Заявка за 1 минуту, ответ быстро", desc: "Форма, телефон или Telegram. Перезвоним и подтвердим детали." },
                ].map((item) => (
                  <div key={item.title}
                    className="rounded-2xl border border-blue-100/60 bg-white/80 p-4 backdrop-blur-sm shadow-sm">
                    <div className="text-sm font-extrabold text-slate-800 mb-1">{item.title}</div>
                    <p className="text-xs leading-5 text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#order"
                  className="btn-primary inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold">
                  Оставить заявку
                </a>
                <a href={`tel:${PHONE_TEL}`}
                  className="btn-ghost inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold">
                  {PHONE_DISPLAY}
                </a>
                <a href={TELEGRAM} target="_blank" rel="noreferrer"
                  className="btn-ghost inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
                  <IconTelegram className="h-4 w-4 text-blue-600" />Telegram
                </a>
              </div>
            </section>

            {/* Form */}
            <aside id="order" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
              <ServiceFormClient routeType="intercity" />
            </aside>
          </div>

          {/* ── КАК ЭТО РАБОТАЕТ ─────────────────────────────────── */}
          <section>
            <GlassPanel className="p-6 md:p-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-6">
                Как заказать такси межгород
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { n: "1", t: "Оставьте заявку", d: "На сайте, по телефону или в Telegram. Укажите откуда, куда, дату и количество пассажиров." },
                  { n: "2", t: "Получите стоимость", d: "Оператор перезвонит, уточнит детали и назовёт точную цену — до подачи авто." },
                  { n: "3", t: "Водитель приедет", d: "К нужному адресу в согласованное время. Без опозданий и непонятных звонков." },
                  { n: "4", t: "Доедете напрямую", d: "Без пересадок, ожиданий и попутчиков. Остановки по договорённости." },
                ].map((s) => (
                  <div key={s.n} className="rounded-2xl border border-blue-100/60 bg-white/85 p-5 shadow-sm">
                    <div className="text-2xl font-black text-blue-600 mb-2">{s.n}</div>
                    <div className="text-sm font-extrabold text-slate-900 mb-1">{s.t}</div>
                    <p className="text-xs leading-5 text-slate-500">{s.d}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </section>

          {/* ── КЛАССЫ АВТО ──────────────────────────────────────── */}
          <section>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 mb-4">
              Классы автомобилей для межгорода
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "Стандарт", badge: "Эконом",
                  desc: "Комфортный седан для поездок 1–3 человека с небольшим багажом. Оптимально по цене.",
                  features: ["1–3 пассажира", "1–2 чемодана", "кондиционер"],
                },
                {
                  name: "Комфорт", badge: "Популярный", highlight: true,
                  desc: "Просторный авто бизнес-класса. Мягкий ход, тихий салон. Выбор для длинных маршрутов.",
                  features: ["1–3 пассажира", "большой багажник", "деловые и семейные поездки"],
                },
                {
                  name: "Бизнес", badge: "Премиум",
                  desc: "Mercedes, BMW или аналог. Максимальный комфорт для деловых поездок и VIP-трансферов.",
                  features: ["кожаный салон", "тишина", "встреча с табличкой"],
                },
                {
                  name: "Минивэн", badge: "Группа",
                  desc: "6–7 мест. Для семьи, команды или поездок с большим количеством багажа.",
                  features: ["до 7 пассажиров", "много багажа", "детские кресла"],
                },
              ].map((cls) => (
                <div key={cls.name}
                  className={`rounded-3xl border p-5 shadow-sm ${cls.highlight
                    ? "border-blue-400 bg-blue-600"
                    : "border-blue-100/60 bg-white/82 backdrop-blur-md"}`}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`text-base font-extrabold ${cls.highlight ? "text-white" : "text-slate-900"}`}>
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

          {/* ── ПОПУЛЯРНЫЕ МАРШРУТЫ ──────────────────────────────── */}
          <section>
            <GlassPanel className="p-6 md:p-8">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 mb-2">
                Популярные направления
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                Кликните по маршруту, чтобы узнать подробности и ориентировочную стоимость
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {POPULAR_ROUTE_LINKS.map((r) => (
                  <Link key={r.href} href={r.href}
                    className="flex items-center gap-2 rounded-xl border border-blue-100/60 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                    {r.label}
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/city"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800">
                  Все города и маршруты →
                </Link>
              </div>
            </GlassPanel>
          </section>

          {/* ── FAQ ──────────────────────────────────────────────── */}
          <section>
            <GlassPanel className="p-6 md:p-8">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 mb-5">
                Часто задают о такси межгород
              </h2>
              <div className="grid gap-3">
                {faq.map((f, i) => (
                  <div key={f.q} className="rounded-2xl border border-blue-100/50 bg-white/80 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-xs font-bold text-blue-400 shrink-0 w-5 text-center">{i + 1}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{f.q}</div>
                        <div className="mt-2 text-sm leading-6 text-slate-600">{f.a}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </section>

          {/* ── БЛОГ ─────────────────────────────────────────────── */}
          <section>
            <GlassPanel className="p-6">
              <h2 className="text-base font-extrabold text-slate-900 mb-1">Читайте перед поездкой</h2>
              <p className="text-xs text-slate-400 mb-4">Статьи о том, как выбрать формат и спланировать маршрут</p>
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
            </GlassPanel>
          </section>

          {/* ── ПЕРЕЛИНКОВКА ─────────────────────────────────────── */}
          <section>
            <div className="grid gap-4 md:grid-cols-2">
              <GlassPanel className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Смотрите также</div>
                <div className="flex flex-wrap gap-2">
                  {CORE_SERVICE_LINKS.filter(l => l.href !== "/taxi-mezhgorod").map((item) => (
                    <Link key={item.href} href={item.href}
                      className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </GlassPanel>
              <GlassPanel className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Смежные запросы</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { href: "/taksi-mezhgorod", label: "Заказать такси межгород" },
                    { href: "/transfer-v-aeroport", label: "Трансфер в аэропорт" },
                    { href: "/transfer-iz-aeroporta", label: "Трансфер из аэропорта" },
                    { href: "/minivan-transfer", label: "Минивэн" },
                    { href: "/prices", label: "Цены" },
                    { href: "/contacts", label: "Контакты" },
                    { href: "/blog", label: "Блог" },
                  ].map((l) => (
                    <Link key={l.href} href={l.href}
                      className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </GlassPanel>
            </div>
          </section>

        </main>
      </div>

      <Footer />
    </>
  );
}
