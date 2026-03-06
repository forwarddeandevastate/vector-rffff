import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";

import SeoRouteClient from "@/app/ui/seo-route-client";
import { CITY_BY_SLUG, CITY_LANDINGS, prettyCityNameFromSlug } from "@/lib/city-landings";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildRouteMetadata } from "@/lib/seo";
import { CITY_CONTENT } from "@/lib/city-content";
import { type FAQItem } from "@/lib/city-faq";

function normalizeSlug(input: string) {
  const raw = (input ?? "").trim();
  let s = raw;
  try {
    s = decodeURIComponent(raw);
  } catch {
    // ignore
  }
  s = s
    .trim()
    .toLowerCase()
    .replace(/[—–-−]/g, "-")
    .replace(/-+/g, "-");
  return s;
}

export async function generateMetadata({
  params,
}: {
  params: { city: string; to: string };
}): Promise<Metadata> {
  const fromSlug = normalizeSlug(params.city);
  const toSlug = normalizeSlug(params.to);

  const fromCity = CITY_BY_SLUG.get(fromSlug);
  if (!fromCity) return { robots: { index: false, follow: false } };

  const validTo = new Set(fromCity.popularTo.map(normalizeSlug));
  if (!validTo.has(toSlug)) return { robots: { index: false, follow: false } };

  return buildRouteMetadata({
    fromSlug: fromCity.slug,
    fromName: fromCity.name,
    toSlug,
    toName: prettyCityNameFromSlug(toSlug),
  });
}

export function generateStaticParams() {
  return CITY_LANDINGS.flatMap((city) => city.popularTo.map((to) => ({ city: city.slug, to })));
}

export default function Page({ params }: { params: { city: string; to: string } }) {
  const fromSlug = normalizeSlug(params.city);
  const toSlug = normalizeSlug(params.to);

  const fromCity = CITY_BY_SLUG.get(fromSlug);
  if (!fromCity) return notFound();

  const toName = prettyCityNameFromSlug(toSlug);

  const baseCityText =
    CITY_CONTENT[fromCity.slug] ??
    `Организуем трансфер из ${fromCity.fromGenitive}. Стоимость согласуем заранее, подача по времени.`;

  const content = `${baseCityText}\n\nМаршрут ${fromCity.name} — ${toName} часто выбирают как такси межгород для личных поездок, командировок, встреч и трансфера между городами без пересадок. Подберём класс авто, согласуем цену заранее и оформим заявку на нужное время.`;

  const keywordText = [
    `Такси ${fromCity.name} — ${toName} подойдёт, если нужно междугороднее такси без пересадок и ожиданий. Машину можно заказать заранее на удобное время, а стоимость поездки согласуется до выезда.`,
    `По направлению ${fromCity.name} — ${toName} часто заказывают такси межгород для семейных поездок, командировок, поездок с багажом и трансфера до гостиницы, вокзала или адреса прибытия.`,
    `Если нужен трансфер в аэропорт или из аэропорта, можно оформить отдельную заявку через сервис аэропортных поездок. Для междугороднего маршрута ${fromCity.name} — ${toName} доступны стандарт, комфорт, бизнес и минивэн.`,
  ];

  const faq: FAQItem[] = [
    {
      question: `Сколько стоит такси ${fromCity.name} — ${toName}?`,
      answer: "Стоимость зависит от расстояния, времени подачи и класса авто. Итоговую цену подтверждаем заранее до поездки.",
    },
    {
      question: `Можно ли заказать междугороднее такси ${fromCity.name} — ${toName} заранее?`,
      answer: "Да, можно оформить заказ заранее на нужную дату и время. Подачу согласуем до поездки.",
    },
    {
      question: `Подходит ли маршрут ${fromCity.name} — ${toName} как такси межгород?`,
      answer: "Да, это прямой междугородний маршрут без пересадок. Можно выбрать стандарт, комфорт, бизнес или минивэн.",
    },
    {
      question: "Можно ли заказать трансфер в аэропорт отдельно?",
      answer: "Да, для поездок в аэропорт и из аэропорта есть отдельная услуга. Если нужен именно аэропортный трансфер, оформим его отдельно.",
    },
  ];

  const moreFromCity = fromCity.popularTo
    .filter((s) => s !== toSlug)
    .slice(0, 10)
    .map((s) => ({ toSlug: s, toName: prettyCityNameFromSlug(s) }));

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: fromCity.name, path: `/${fromCity.slug}` },
    { name: toName, path: `/${fromCity.slug}/${toSlug}` },
  ]);

  const faqJsonLd = buildFaqJsonLd(faq);

  const moreRoutesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Ещё маршруты из ${fromCity.name}`,
    itemListElement: moreFromCity.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${fromCity.name} — ${item.toName}`,
      url: `https://vector-rf.ru/${fromCity.slug}/${item.toSlug}`,
    })),
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Такси ${fromCity.name} — ${toName}`,
    serviceType: "Междугороднее такси",
    provider: {
      "@type": "LocalBusiness",
      name: "Вектор РФ",
      telephone: "+78314233929",
      areaServed: "Россия",
      url: `https://vector-rf.ru/${fromCity.slug}/${toSlug}`,
    },
    areaServed: [fromCity.name, toName],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `https://vector-rf.ru/${fromCity.slug}/${toSlug}`,
      availableLanguage: "ru",
    },
    description: `Маршрут ${fromCity.name} — ${toName}: такси межгород, междугороднее такси и трансфер между городами по предварительной заявке.`,
  };

  const keywordsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Запросы по маршруту ${fromCity.name} — ${toName}`,
    itemListElement: [
      `такси ${fromCity.name} ${toName}`,
      `междугороднее такси ${fromCity.name} ${toName}`,
      `такси межгород ${fromCity.name} ${toName}`,
      `трансфер ${fromCity.name} ${toName}`,
    ].map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
    })),
  };

  return (
    <>
      <Script
        id={`ld-route-breadcrumbs-${fromCity.slug}-${toSlug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <Script
        id={`ld-route-faq-${fromCity.slug}-${toSlug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id={`ld-route-more-${fromCity.slug}-${toSlug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(moreRoutesJsonLd) }}
      />
      <Script
        id={`ld-route-service-${fromCity.slug}-${toSlug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id={`ld-route-keywords-${fromCity.slug}-${toSlug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(keywordsJsonLd) }}
      />

      <SeoRouteClient
        fromSlug={fromCity.slug}
        cityBackHref={`/${fromCity.slug}`}
        cityBackLabel={`← Из ${fromCity.fromGenitive}`}
        fromName={fromCity.name}
        toSlug={toSlug}
        toName={toName}
        content={content}
        keywordText={keywordText}
        faq={faq}
        moreFromCity={moreFromCity}
      />
    </>
  );
}
