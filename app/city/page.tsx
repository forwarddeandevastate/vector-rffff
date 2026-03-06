import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { buildSeoRoutes, type SeoRoute } from "@/lib/seo-routes";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

// ✅ ВАЖНО: считаем один раз на уровне модуля (не на каждый запрос/рендер)
const SEO_ROUTES = buildSeoRoutes(2000);

export const metadata: Metadata = {
  title: "Каталог маршрутов по России — города и направления | Вектор РФ",
  description:
    "Каталог популярных направлений и городов: междугородние поездки по России. Выберите маршрут и оставьте заявку онлайн — 24/7. Стоимость согласуем заранее.",
  alternates: { canonical: `${SITE_URL}/city` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/city`,
    title: "Каталог маршрутов по России — города и направления | Вектор РФ",
    description:
      "Каталог популярных направлений: выбирайте маршрут и оставляйте заявку. Комфорт, бизнес, минивэн. 24/7.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Каталог направлений | Вектор РФ",
    description: "Популярные маршруты и города по России. Заявка онлайн 24/7.",
    images: ["/og.jpg"],
  },
};

// fallback: "rostov-na-donu" -> "Rostov Na Donu"
function safePretty(slug: string) {
  const s = (slug ?? "").trim();
  if (!s) return "Город";
  const decoded = (() => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  })();

  return decoded
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Мини-маппинг для самых частых — остальные через safePretty
const CITY_MAP: Record<string, string> = {
  moskva: "Москва",
  "sankt-peterburg": "Санкт-Петербург",
  "nizhniy-novgorod": "Нижний Новгород",
  kazan: "Казань",
  samara: "Самара",
  saratov: "Саратов",
  volgograd: "Волгоград",
  voronezh: "Воронеж",
  krasnodar: "Краснодар",
  "rostov-na-donu": "Ростов-на-Дону",
  sochi: "Сочи",
  tula: "Тула",
  ryazan: "Рязань",
  smolensk: "Смоленск",
  tver: "Тверь",
  yaroslavl: "Ярославль",
  kaliningrad: "Калининград",
  "velikiy-novgorod": "Великий Новгород",
  pskov: "Псков",
  astrakhan: "Астрахань",

  // МО
  balashikha: "Балашиха",
  khimki: "Химки",
  podolsk: "Подольск",
  mytishchi: "Мытищи",
  korolev: "Королёв",
  lyubertsy: "Люберцы",
  domodedovo: "Домодедово",

  // новые территории
  donetsk: "Донецк",
  lugansk: "Луганск",
  mariupol: "Мариуполь",
  melitopol: "Мелитополь",
  kherson: "Херсон",
};

function cityName(slug: string) {
  const s = (slug ?? "").trim();
  if (!s) return "Город";
  return CITY_MAP[s] ?? safePretty(s);
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function take<T>(arr: T[], n: number) {
  return arr.length > n ? arr.slice(0, n) : arr;
}

function buildSections(routes: SeoRoute[]) {
  const byFrom = new Map<string, SeoRoute[]>();
  for (const r of routes) {
    const list = byFrom.get(r.from) ?? [];
    list.push(r);
    byFrom.set(r.from, list);
  }

  const priorityFrom: string[] = [
    "moskva",
    "sankt-peterburg",
    "nizhniy-novgorod",
    "kazan",
    "samara",
    "saratov",
    "voronezh",
    "volgograd",
    "rostov-na-donu",
    "krasnodar",
    "sochi",
    "kaliningrad",
    "tula",
    "ryazan",
    "smolensk",
    "tver",
    "yaroslavl",
    "donetsk",
    "lugansk",
    "mariupol",
    "melitopol",
    "kherson",
  ];

  const allFrom = uniq(Array.from(byFrom.keys()));
  const orderedFrom = [
    ...priorityFrom.filter((x) => byFrom.has(x)),
    ...allFrom.filter((x) => !priorityFrom.includes(x)).sort(),
  ];

  return orderedFrom.map((from) => ({
    from,
    routes: byFrom.get(from) ?? [],
  }));
}

function PillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm hover:bg-zinc-50"
    >
      {children}
    </Link>
  );
}

export default function Page() {
  const routes = SEO_ROUTES;

  // не делаем 2000 ссылок на одной странице
  const routesForCatalog = routes.slice(0, 1000);

  const sections = buildSections(routesForCatalog);
  const quick = take(routesForCatalog, 36);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Каталог маршрутов", item: `${SITE_URL}/city` },
    ],
  };

  // ✅ Каталог ссылок как ItemList (помогает Яндексу понять “страница-справочник”)
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Каталог маршрутов — Вектор РФ",
    itemListOrder: "https://schema.org/ItemListUnordered",
    numberOfItems: routesForCatalog.length,
    itemListElement: routesForCatalog.slice(0, 200).map((r, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/route/${r.from}/${r.to}`,
      name: `${cityName(r.from)} — ${cityName(r.to)}`,
    })),
  };

  return (
    <main className="min-h-screen text-zinc-900">
      <Script
        id="ld-city-breadcrumbs"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="ld-city-itemlist"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* фон как на главной */}
      <div className="fixed inset-0 -z-20 bg-[#f3f7ff]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_50%_-10%,rgba(56,189,248,0.25),transparent_60%),radial-gradient(900px_520px_at_12%_18%,rgba(59,130,246,0.14),transparent_55%),radial-gradient(900px_520px_at_88%_20%,rgba(99,102,241,0.12),transparent_55%)]" />
      <div className="fixed inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white/70 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-600">Каталог маршрутов</div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Города и направления по России
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                Выберите направление и оставьте заявку. Мы согласуем стоимость до подачи автомобиля.
                Классы: Стандарт / Комфорт / Бизнес / Минивэн. Работаем 24/7.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/intercity-taxi"
                className="rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
              >
                Межгород (услуга)
              </Link>
              <Link
                href="/#order"
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Оставить заявку
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-extrabold text-zinc-900">Популярные направления</div>
            <p className="mt-1 text-sm text-zinc-600">
              Быстрые ссылки на частые маршруты. Открывайте страницу и оставляйте заявку.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {quick.map((r) => {
                const href = `/route/${r.from}/${r.to}`;
                return (
                  <PillLink key={`${r.from}__${r.to}`} href={href}>
                    {cityName(r.from)} — {cityName(r.to)}
                  </PillLink>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {sections.map((sec) => {
            const links = take(sec.routes, 60);

            return (
              <section
                key={sec.from}
                className="rounded-3xl border border-zinc-200 bg-white/75 p-6 shadow-sm backdrop-blur md:p-8"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight">
                      Направления из: {cityName(sec.from)}
                    </h2>
                    <div className="mt-1 text-sm text-zinc-600">
                      Популярные маршруты (часть). Полный список — в sitemap и по внутренним ссылкам.
                    </div>
                  </div>

                  <div className="text-xs text-zinc-500">
                    Показано: {links.length} из {sec.routes.length}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {links.map((r) => {
                    const href = `/route/${r.from}/${r.to}`;
                    return (
                      <PillLink key={`${r.from}__${r.to}`} href={href}>
                        {cityName(r.from)} — {cityName(r.to)}
                      </PillLink>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="text-lg font-extrabold tracking-tight">Не нашли направление?</div>
          <p className="mt-2 text-sm text-zinc-600">
            Оставьте заявку — уточним маршрут, время и заранее согласуем стоимость.
          </p>
          <div className="mt-4">
            <Link
              href="/#order"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
            >
              Оставить заявку
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}