import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import ServicePage from "@/app/ui/service-page";
import { CORE_SERVICE_LINKS, KEYWORD_PAGE_LINKS, BLOG_COMMERCIAL_LINKS } from "@/lib/internal-links";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { KeywordLandingConfig } from "@/lib/keyword-landings";

export function buildKeywordLandingMetadata(config: KeywordLandingConfig): Metadata {
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    keywords: config.keywords,
    alternates: { canonical: config.href },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${config.href}`,
      title: config.metaTitle,
      description: config.metaDescription,
      siteName: SITE_NAME,
      locale: "ru_RU",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${SITE_NAME} — ${config.shortLabel}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: config.metaTitle,
      description: config.metaDescription,
      images: ["/og.jpg"],
    },
  };
}

/** Уникальные supportLinks (фильтруем дубли href) */
function dedupeLinks(links: Array<{ href: string; label: string }>) {
  const seen = new Set<string>();
  return links.filter(({ href }) => {
    if (seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}

function HowItWorks({ shortLabel }: { shortLabel: string }) {
  const steps = [
    { n: "1", title: "Оставьте заявку", text: "На сайте, по телефону или в Telegram — займёт пару минут." },
    { n: "2", title: "Согласуем стоимость", text: "Оператор уточнит маршрут и подтвердит цену до выезда." },
    { n: "3", title: "Водитель подъедет", text: "К нужному адресу в нужное время, без опозданий." },
    { n: "4", title: "Доедете с комфортом", text: "Прямой маршрут без пересадок, выбранный класс авто." },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-8">
      <div className="rounded-3xl border border-blue-100/60 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {shortLabel}: как это устроено
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-blue-100/60 bg-white/85 p-5 shadow-sm">
              <div className="text-2xl font-black text-blue-600">{s.n}</div>
              <div className="mt-2 text-sm font-extrabold text-slate-900">{s.title}</div>
              <p className="mt-1 text-sm leading-5 text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedDirections({ config }: { config: KeywordLandingConfig }) {
  const unique = dedupeLinks(config.supportLinks);
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-blue-100/60 bg-white/70 p-6 shadow-sm backdrop-blur">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Смежные направления</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {unique.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-blue-100/60 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-sky-200 hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-blue-100/60 bg-white/70 p-6 shadow-sm backdrop-blur">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Разделы сайта</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {CORE_SERVICE_LINKS.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm hover:bg-blue-50/50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogBlock({ config }: { config: KeywordLandingConfig }) {
  // Определяем тип услуги, чтобы показать релевантные статьи
  const isAirport = config.slug.includes("aeroport");
  const relevant = BLOG_COMMERCIAL_LINKS.filter((b) =>
    isAirport ? b.service === "airport" || b.service === "intercity" : b.service === "intercity"
  ).slice(0, 3);

  if (!relevant.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-8">
      <div className="rounded-3xl border border-blue-100/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 mb-1">Полезно перед поездкой</h2>
        <p className="text-sm text-slate-500 mb-5">Статьи, которые помогают принять решение</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {relevant.map((b) => (
            <Link
              key={b.href}
              href={b.href}
              className="group rounded-2xl border border-blue-100/60 bg-white/85 p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
            >
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
      </div>
    </section>
  );
}

function PopularRoutes({ config }: { config: KeywordLandingConfig }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8">
      <div className="rounded-3xl border border-blue-100/60 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Популярные маршруты</h2>
        <p className="mt-2 text-sm text-slate-600">
          Выберите направление, чтобы узнать подробности и стоимость поездки.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {config.routeLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-blue-100/60 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-sky-200/80 hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-blue-100/60 bg-white/85 p-5 text-sm leading-6 text-slate-700 shadow-sm">
          Основная страница услуги:{" "}
          <Link href={config.relatedServiceHref} className="font-semibold text-sky-700 hover:text-sky-800 hover:underline">
            {config.relatedServiceLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

function OtherKeywords() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <div className="rounded-3xl border border-blue-100/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900 mb-4">Другие форматы заказа</h2>
        <div className="flex flex-wrap gap-2">
          {KEYWORD_PAGE_LINKS.map((item) => (
            <Link key={item.href} href={item.href}
              className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm hover:bg-blue-50/50">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function KeywordLandingPage({ config }: { config: KeywordLandingConfig }) {
  const canonical = `${SITE_URL}${config.href}`;

  // Все JSON-LD рендерятся на сервере (нет strategy="afterInteractive")
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonical}#service`,
    name: config.shortLabel,
    serviceType: config.serviceType,
    url: canonical,
    areaServed: { "@type": "Country", name: "Россия" },
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      telephone: "+78002225650",
    },
  };

  // Breadcrumb: короткие, естественные названия
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: config.shortLabel, item: canonical },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const routesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Маршруты: ${config.shortLabel}`,
    itemListElement: config.routeLinks.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <>
      {/* Все Schema.org — на сервере, без afterInteractive */}
      <Script id={`${config.slug}-service-jsonld`} type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <Script id={`${config.slug}-breadcrumbs-jsonld`} type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id={`${config.slug}-faq-jsonld`} type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id={`${config.slug}-routes-jsonld`} type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(routesJsonLd) }} />

      <ServicePage
        breadcrumbs={[
          { name: "Главная", href: "/" },
          { name: config.shortLabel, href: config.href },
        ]}
        title={config.heroTitle}
        subtitle={config.heroSubtitle}
        bullets={config.bullets}
        faq={config.faq}
      />

      <HowItWorks shortLabel={config.shortLabel} />
      <BlogBlock config={config} />
      <RelatedDirections config={config} />
      <PopularRoutes config={config} />
      <OtherKeywords />
    </>
  );
}
