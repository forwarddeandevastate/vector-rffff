import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";

import SeoRouteClient from "@/app/ui/seo-route-client";
import { CITY_BY_SLUG, CITY_LANDINGS, prettyCityNameFromSlug } from "@/lib/city-landings";
import { CITY_CONTENT } from "@/lib/city-content";
import { CITY_FAQ } from "@/lib/city-faq";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

export function generateStaticParams() {
  return CITY_LANDINGS.flatMap((c) => c.popularTo.slice(0, 10).map((to) => ({ city: c.slug, to })));
}

export async function generateMetadata({
  params,
}: {
  params: { city: string; to: string };
}): Promise<Metadata> {
  const fromSlug = (params.city ?? "").trim();
  const toSlug = (params.to ?? "").trim();
  const fromCity = CITY_BY_SLUG.get(fromSlug);
  if (!fromCity) return { robots: { index: false, follow: false } };

  const fromName = fromCity.name;
  const toName = prettyCityNameFromSlug(toSlug);

  const title = `Такси ${fromName} — ${toName} | Междугородний трансфер 24/7 — ${SITE_NAME}`;
  const description = `Заказать такси ${fromName} — ${toName}: прямая поездка без пересадок, стоимость согласуем заранее. Классы авто: стандарт/комфорт/бизнес/минивэн. Заявка онлайн 24/7.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${fromSlug}/${toSlug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${fromSlug}/${toSlug}`,
      title,
      description,
      siteName: SITE_NAME,
      locale: "ru_RU",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.jpg"],
    },
  };
}

export default function Page({ params }: { params: { city: string; to: string } }) {
  const fromSlug = (params.city ?? "").trim();
  const toSlug = (params.to ?? "").trim();
  const fromCity = CITY_BY_SLUG.get(fromSlug);
  if (!fromCity) return notFound();

  const fromName = fromCity.name;
  const toName = prettyCityNameFromSlug(toSlug);

  const baseCityText = CITY_CONTENT[fromSlug] ??
    `Организуем трансфер из ${fromCity.fromGenitive}. Стоимость согласуем заранее, подача по времени.`;

  const content =
    `${baseCityText} ` +
    `Маршрут ${fromName} — ${toName} можно оформить заранее: укажите дату, время и комментарии к поездке — подтвердим стоимость до выезда.`;

  const faq = (CITY_FAQ[fromSlug] ?? []).slice(0, 4);

  const moreFromCity = fromCity.popularTo
    .filter((x) => x !== toSlug)
    .slice(0, 8)
    .map((x) => ({ toSlug: x, toName: prettyCityNameFromSlug(x) }));

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: fromName, item: `${SITE_URL}/${fromSlug}` },
      { "@type": "ListItem", position: 3, name: `${fromName} — ${toName}`, item: `${SITE_URL}/${fromSlug}/${toSlug}` },
    ],
  };

  return (
    <>
      <Script
        id={`ld-route-breadcrumbs-${fromSlug}-${toSlug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <SeoRouteClient
        fromSlug={fromSlug}
        toSlug={toSlug}
        fromName={fromName}
        toName={toName}
        cityBackHref={`/${fromSlug}`}
        cityBackLabel={`← Все маршруты из ${fromCity.fromGenitive}`}
        content={content}
        faq={faq.length ? faq : [{ question: "Цена фиксируется заранее?", answer: "Да, стоимость подтверждаем до поездки." }]}
        moreFromCity={moreFromCity}
      />
    </>
  );
}
