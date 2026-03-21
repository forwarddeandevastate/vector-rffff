import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import dynamic from "next/dynamic";
import {
  PageBackground, Header, Footer,
  GlassPanel, Tag,
  IconPhone, IconTelegram,
  PHONE_DISPLAY, PHONE_TEL, TELEGRAM,
} from "@/app/ui/shared";
import {
  POPULAR_ROUTE_LINKS, CORE_SERVICE_LINKS, BLOG_COMMERCIAL_LINKS,
} from "@/lib/internal-links";

const ServiceFormClient = dynamic(() => import("@/app/ui/service-form-client"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-blue-100/60 bg-white/80 p-5 space-y-2">
      <div className="h-4 w-32 bg-blue-50 rounded animate-pulse" />
      <div className="h-10 bg-blue-50 rounded-xl animate-pulse" />
    </div>
  ),
});

const SITE_URL = "https://vector-rf.ru";
const PAGE_URL = `${SITE_URL}/transfer-v-aeroport`;

export const metadata: Metadata = {
  title: "Трансфер в аэропорт — заказать подачу к рейсу 24/7",
  description:
    "Трансфер в аэропорт: подача к дому, офису или отелю ко времени вылета. Встреча с табличкой при прилёте. Комфорт, бизнес, минивэн. Заявка 24/7.",
  alternates: { canonical: "/transfer-v-aeroport" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website", url: PAGE_URL,
    title: "Трансфер в аэропорт — Вектор РФ",
    description: "Подача к рейсу, встреча с табличкой. Стоимость до выезда, 24/7.",
    siteName: "Вектор РФ", locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Трансфер в аэропорт — Вектор РФ" }],
  },
};

const faq = [
  {
    q: "Чем трансфер в аэропорт отличается от обычного такси?",
    a: "Трансфер бронируется заранее: фиксируются время подачи, адрес, класс авто и стоимость. Никаких счётчиков. Водитель приезжает точно к нужному времени, а не «через 10–30 минут».",
  },
  {
    q: "За сколько до рейса нужно выезжать?",
    a: "Для внутренних рейсов — за 2–3 часа до вылета, для международных — за 3–4 часа. Оператор поможет рассчитать время выезда с учётом расстояния, пробок и особенностей маршрута.",
  },
  {
    q: "Можно ли заказать встречу из аэропорта с табличкой?",
    a: "Да. Укажите номер рейса в заявке — водитель отслеживает прилёт в реальном времени, встречает в зале с именной табличкой и ждёт при задержке рейса.",
  },
  {
    q: "Что если рейс задержали?",
    a: "Водитель отслеживает статус рейса и скорректирует время прибытия. Ожидание при задержке включено в стандартный тариф.",
  },
  {
    q: "Можно ли заказать минивэн в аэропорт?",
    a: "Да, минивэн на 6–7 мест доступен для семьи, группы или поездок с большим количеством чемоданов. Укажите количество пассажиров и объём багажа при бронировании.",
  },
  {
    q: "Как оплатить трансфер в аэропорт?",
    a: "Наличными водителю или безналичным переводом. Для организаций — оплата по счёту с договором и закрывающими документами.",
  },
];

export default function TransferVAeroportPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Трансфер в аэропорт", item: PAGE_URL },
    ],
  };
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${PAGE_URL}#service`,
    name: "Трансфер в аэропорт",
    serviceType: ["Трансфер в аэропорт", "Такси в аэропорт", "Аэропортный трансфер"],
    url: PAGE_URL,
    areaServed: { "@type": "Country", name: "Россия" },
    provider: { "@type": "Organization", name: "Вектор РФ", url: SITE_URL, telephone: "+78002225650" },
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
      <Script id="ld-airport-bc" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="ld-airport-svc" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <Script id="ld-airport-faq" type="application/ld+json" strategy="beforeInteractive"
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
                <span className="text-blue-800/60 font-semibold">Трансфер в аэропорт</span>
              </nav>

              <div className="flex flex-wrap gap-2 mb-4">
                <Tag>Подача ко времени рейса</Tag>
                <Tag>Встреча с табличкой</Tag>
                <Tag>Без счётчика</Tag>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl leading-tight">
                Трансфер в аэропорт<br />
                <span className="text-blue-600">и встреча при прилёте</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Подача к дому, офису или отелю ко времени вылета. Встреча в зале прилёта с табличкой.
                Стоимость фиксируем до выезда — цена не меняется в дороге.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { title: "Точная подача к рейсу", desc: "Оператор рассчитает время выезда с учётом пробок, расстояния и регламента аэропорта." },
                  { title: "Встреча с именной табличкой", desc: "Водитель встречает в зале прилёта и ждёт при задержке рейса без доплат." },
                  { title: "Помощь с багажом", desc: "Водитель помогает с погрузкой и выгрузкой чемоданов — дополнительно ничего не нужно просить." },
                  { title: "Любое время суток", desc: "Ночные вылеты, ранние утренние рейсы — принимаем заявки без ограничений по времени." },
                ].map((item) => (
                  <div key={item.title}
                    className="rounded-2xl border border-blue-100/60 bg-white/80 p-4 shadow-sm">
                    <div className="text-sm font-extrabold text-slate-800 mb-1">{item.title}</div>
                    <p className="text-xs leading-5 text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#order"
                  className="btn-primary inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold">
                  Заказать трансфер
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

            <aside id="order" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
              <ServiceFormClient routeType="airport" />
            </aside>
          </div>

          {/* ── ДВА ФОРМАТА: В АЭРОПОРТ И ИЗ АЭРОПОРТА ─────────── */}
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-blue-400 bg-blue-600 p-6 text-white shadow-sm">
              <div className="text-lg font-extrabold mb-2">В аэропорт</div>
              <p className="text-sm text-blue-100 mb-4 leading-6">
                Подача к указанному адресу ко времени вылета. Помогаем рассчитать время выезда
                с учётом пробок и регламента аэропорта. Подходит для ранних рейсов, ночных вылетов
                и поездок с большим багажом.
              </p>
              <ul className="space-y-1.5 mb-5">
                {["Трансфер из любого адреса", "Помощь с расчётом времени выезда", "Комфорт, бизнес и минивэн"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-blue-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/60 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <a href="#order"
                className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50 transition-colors">
                Заказать →
              </a>
            </div>
            <div className="rounded-3xl border border-blue-100/60 bg-white/82 backdrop-blur-md p-6 shadow-sm">
              <div className="text-lg font-extrabold text-slate-900 mb-2">Из аэропорта</div>
              <p className="text-sm text-slate-600 mb-4 leading-6">
                Встреча в зале прилёта с именной табличкой. Водитель отслеживает рейс в реальном времени
                и ждёт при задержке. Удобно для деловых встреч и трансферов с продолжением.
              </p>
              <ul className="space-y-1.5 mb-5">
                {["Отслеживание рейса в реальном времени", "Ожидание при задержке включено", "Везём до любого адреса"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/transfer-iz-aeroporta"
                className="inline-flex items-center rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50 transition-colors">
                Подробнее →
              </Link>
            </div>
          </section>

          {/* ── МАРШРУТЫ ─────────────────────────────────────────── */}
          <section>
            <GlassPanel className="p-6 md:p-8">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 mb-2">
                Популярные маршруты к аэропорту
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                Организуем трансфер в аэропорты России из любого города
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {POPULAR_ROUTE_LINKS.slice(0, 9).map((r) => (
                  <Link key={r.href} href={r.href}
                    className="flex items-center gap-2 rounded-xl border border-blue-100/60 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                    {r.label}
                  </Link>
                ))}
              </div>
            </GlassPanel>
          </section>

          {/* ── FAQ ──────────────────────────────────────────────── */}
          <section>
            <GlassPanel className="p-6 md:p-8">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 mb-5">
                Вопросы о трансфере в аэропорт
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
              <p className="text-xs text-slate-400 mb-4">Как спланировать трансфер и что взять с собой</p>
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
                  {CORE_SERVICE_LINKS.filter(l => l.href !== "/transfer-v-aeroport").map((item) => (
                    <Link key={item.href} href={item.href}
                      className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </GlassPanel>
              <GlassPanel className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Смежные страницы</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { href: "/transfer-iz-aeroporta", label: "Трансфер из аэропорта" },
                    { href: "/taxi-v-aeroport", label: "Такси в аэропорт" },
                    { href: "/taxi-mezhgorod", label: "Такси межгород" },
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
