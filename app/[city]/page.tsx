import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";

import SeoCityFormClient from "@/app/ui/seo-city-client";
import {
  CITY_BY_SLUG,
  CITY_LANDINGS,
  prettyCityNameFromSlug,
} from "@/lib/city-landings";
import {
  buildBreadcrumbJsonLd,
  buildCityMetadata,
  buildFaqJsonLd,
} from "@/lib/seo";
import { CITY_CONTENT } from "@/lib/city-content";
import { CITY_FAQ } from "@/lib/city-faq";
import {
  CORE_SERVICE_LINKS,
  POPULAR_ROUTE_LINKS,
  BLOG_COMMERCIAL_LINKS,
  TRUST_FACTS,
  TRUST_METRICS,
  NEW_TERRITORIES_LINKS,
} from "@/lib/internal-links";
import {
  PageBackground, Header, Footer, GlassPanel, Tag, SectionHeading,
} from "@/app/ui/shared";

function normalizeSlug(input: string) {
  const raw = (input ?? "").trim();
  let s = raw;
  try { s = decodeURIComponent(raw); } catch {}
  return s.trim().toLowerCase()
    .replace(/[—–-−]/g, "-")
    .replace(/-+/g, "-");
}

export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return CITY_LANDINGS.slice(0, 200).map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }> | { city: string };
}): Promise<Metadata> {
  const resolved = await Promise.resolve(params as any);
  const slug = normalizeSlug(resolved.city);
  const city = CITY_BY_SLUG.get(slug);
  if (!city) return { robots: { index: false, follow: false } };
  return buildCityMetadata({ slug: city.slug, cityName: city.name, fromGenitive: city.fromGenitive });
}

export default async function Page({
  params,
}: {
  params: Promise<{ city: string }> | { city: string };
}) {
  const resolved = await Promise.resolve(params as any);
  const slug = normalizeSlug(resolved.city);
  const city = CITY_BY_SLUG.get(slug);
  if (!city) return notFound();

  const content =
    CITY_CONTENT[city.slug] ??
    `Страница маршрутов из ${city.fromGenitive}. Здесь собраны межгородские поездки, трансферы и популярные направления — с возможностью заранее согласовать маршрут, класс авто и условия. Такой формат удобен для частных поездок, командировок, семейных маршрутов и трансферов на дальние расстояния.`;

  const faq =
    CITY_FAQ[city.slug] ?? [
      {
        question: `Сколько стоит поездка из ${city.fromGenitive}?`,
        answer: "Стоимость зависит от направления, расстояния и класса авто. Итоговую цену фиксируем до выезда.",
      },
      {
        question: `Можно ли заранее заказать такси из ${city.fromGenitive}?`,
        answer: "Да, поездку можно оформить заранее на нужную дату и время. Удобно для дальних маршрутов и аэропортных трансферов.",
      },
      {
        question: `Какие направления из ${city.fromGenitive} доступны?`,
        answer: "На странице собраны популярные маршруты. Также принимаем заявки по любому индивидуальному направлению.",
      },
      {
        question: "Работаете ли вы круглосуточно?",
        answer: "Да, заявки принимаем 24/7 через сайт, телефон и Telegram.",
      },
    ];

  const popular = city.popularTo.slice(0, 18).map((toSlug) => ({
    toSlug,
    toName: prettyCityNameFromSlug(toSlug),
  }));

  // JSON-LD — все на сервере
  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: city.name, path: `/${city.slug}` },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const popularRoutesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Маршруты из ${city.name}`,
    itemListElement: popular.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${city.name} — ${item.toName}`,
      url: `https://vector-rf.ru/${city.slug}/${item.toSlug}`,
    })),
  };
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Такси и трансферы из ${city.name}`,
    serviceType: "Междугороднее такси и трансфер",
    provider: {
      "@type": "LocalBusiness",
      name: "Вектор РФ",
      telephone: "+78002225650",
      url: "https://vector-rf.ru",
    },
    areaServed: city.name,
    description: `Межгородские маршруты и трансферы из ${city.fromGenitive}: прямые поездки без пересадок, подача к адресу, стоимость до выезда.`,
  };

  return (
    <>
      <Script id={`ld-city-bc-${city.slug}`} type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
      <Script id={`ld-city-faq-${city.slug}`} type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id={`ld-city-routes-${city.slug}`} type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(popularRoutesJsonLd) }} />
      <Script id={`ld-city-svc-${city.slug}`} type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      <PageBackground />
      <Header />

      <div className="animate-page">
        <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">

          {/* ── HERO ─────────────────────────────────────────────── */}
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-10 lg:items-start">
            <section>
              {/* Breadcrumb */}
              <nav className="text-xs text-blue-400/80 mb-4">
                <Link href="/" className="hover:text-blue-600 transition-colors">Главная</Link>
                <span className="mx-2">/</span>
                <span className="text-blue-800/60 font-semibold">{city.name}</span>
              </nav>

              <div className="flex flex-wrap gap-2 mb-4">
                <Tag>Межгород</Tag>
                <Tag>Аэропорт</Tag>
                <Tag>Стоимость заранее</Tag>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Такси из {city.fromGenitive} — межгород и трансфер 24/7
              </h1>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Заказать такси из {city.fromGenitive}: прямые поездки между городами, трансфер в аэропорт, минивэн для группы. Стоимость фиксируем до выезда.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a href="#order"
                  className="btn-primary inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold">
                  Оставить заявку
                </a>
                <a href="tel:+78002225650"
                  className="btn-ghost inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold">
                  8 800 222-56-50
                </a>
              </div>

              {/* Метрики */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {TRUST_METRICS.map((item) => (
                  <div key={item.label}
                    className="rounded-2xl border border-blue-100/60 bg-white/80 p-4 backdrop-blur-sm shadow-sm text-center">
                    <div className="text-xl font-black tracking-tight text-blue-700">{item.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Форма — client-компонент */}
            <SeoCityFormClient cityName={city.name} initialFrom={city.name} />
          </div>

          {/* ── ПОПУЛЯРНЫЕ МАРШРУТЫ ──────────────────────────────── */}
          <section className="mt-8">
            <GlassPanel className="p-6">
              <h2 className="text-base font-extrabold text-slate-800 mb-4">
                Популярные направления из {city.name}
              </h2>
              <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {popular.map((p) => (
                  <Link key={p.toSlug} href={`/${city.slug}/${p.toSlug}`}
                    className="flex items-center gap-2 rounded-xl border border-blue-50 bg-white/80 px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                    {city.name} — {p.toName}
                  </Link>
                ))}
              </div>
            </GlassPanel>
          </section>

          {/* ── ГАРАНТИИ ─────────────────────────────────────────── */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {TRUST_FACTS.map((fact) => (
              <div key={fact}
                className="flex items-start gap-2.5 rounded-2xl border border-blue-100/50 bg-white/75 p-4 shadow-sm">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-700">{fact}</span>
              </div>
            ))}
          </div>

          {/* ── УНИКАЛЬНЫЙ КОНТЕНТ ГОРОДА ────────────────────────── */}
          <GlassPanel className="mt-6 p-6 md:p-8">
            <h2 className="text-base font-extrabold text-slate-800 mb-4">
              Такси и трансферы из {city.name}
            </h2>
            <div className="space-y-4">
              {content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean).map((p, i) => (
                <p key={i} className="text-sm leading-6 text-slate-600">{p}</p>
              ))}
            </div>
          </GlassPanel>

          {/* ── ФОРМАТЫ УСЛУГ ────────────────────────────────────── */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: `Межгород из ${city.name}`,
                text: "Прямые поездки до нужного города без пересадок. Согласуем маршрут, класс авто и стоимость.",
                href: "/taxi-mezhgorod",
                cta: "Заказать межгород",
              },
              {
                title: "Трансфер в аэропорт",
                text: "Подача ко времени рейса, встреча с табличкой. Отслеживаем задержки.",
                href: "/transfer-v-aeroport",
                cta: "Трансфер в аэропорт",
              },
              {
                title: "Корпоративным",
                text: "Поездки сотрудников и гостей по договору. Безнал, закрывающие документы.",
                href: "/corporate",
                cta: "Узнать условия",
              },
            ].map((c) => (
              <div key={c.title}
                className="rounded-2xl border border-blue-100/60 bg-white/80 p-5 backdrop-blur-sm shadow-sm">
                <div className="text-sm font-extrabold text-slate-800 mb-2">{c.title}</div>
                <p className="text-xs leading-5 text-slate-600 mb-4">{c.text}</p>
                <Link href={c.href}
                  className="inline-flex items-center rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  {c.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* ── FAQ ──────────────────────────────────────────────── */}
          <GlassPanel className="mt-6 p-6 md:p-8">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 mb-5">
              Вопросы о поездках из {city.name}
            </h2>
            <div className="grid gap-3">
              {faq.map((f, idx) => (
                <div key={idx}
                  className="rounded-2xl border border-blue-100/50 bg-white/80 p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-xs font-bold text-blue-400 shrink-0 w-5 text-center">{idx + 1}</span>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{f.question}</div>
                      <div className="mt-2 text-sm leading-6 text-slate-600">{f.answer}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* ── БЛОГ ─────────────────────────────────────────────── */}
          <GlassPanel className="mt-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-slate-800">Читайте перед поездкой</div>
              <Link href="/blog" className="text-xs font-semibold text-blue-600 hover:text-blue-800">Все статьи →</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {BLOG_COMMERCIAL_LINKS.map((b) => (
                <Link key={b.href} href={b.href}
                  className="group rounded-2xl border border-blue-100/60 bg-white p-3 shadow-sm hover:border-blue-200 transition-all">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1.5 block">Блог</span>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 transition-colors leading-snug">
                    {b.label}
                  </span>
                </Link>
              ))}
            </div>
          </GlassPanel>

          {/* ── ПЕРЕЛИНКОВКА ─────────────────────────────────────── */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <GlassPanel className="p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Услуги</div>
              <div className="flex flex-wrap gap-2 mb-2">
                <a href="/prices" className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors">Цены →</a>
              </div>
              <div className="flex flex-wrap gap-2">
                {CORE_SERVICE_LINKS.map((item) => (
                  <Link key={item.href} href={item.href}
                    className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
            </GlassPanel>
            <GlassPanel className="p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Популярные маршруты</div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_ROUTE_LINKS.slice(0, 8).map((item) => (
                  <Link key={item.href} href={item.href}
                    className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
            </GlassPanel>
          </div>

          {/* Новые регионы */}
          <GlassPanel className="mt-4 p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Новые регионы РФ</div>
            <div className="flex flex-wrap gap-2">
              {NEW_TERRITORIES_LINKS.map((item) => (
                <Link key={item.href} href={item.href}
                  className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </GlassPanel>

        </main>
      </div>

      <Footer />
    </>
  );
}
