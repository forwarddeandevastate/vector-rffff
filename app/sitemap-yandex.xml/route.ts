import { NextResponse } from "next/server";
import { buildSeoRouteUrls } from "@/lib/seo-routes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_URL = "https://vector-rf.ru";

// лимит Яндекса
const YANDEX_LIMIT = 500;

function xmlEscape(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const now = new Date().toISOString();

  // ✅ важные статические страницы (основные + юридические + хабы)
  const staticUrls = [
    `${BASE_URL}/`,
    `${BASE_URL}/services`,
    `${BASE_URL}/about`,
    `${BASE_URL}/contacts`,

    // услуги (посадочные)
    `${BASE_URL}/city-transfer`,
    `${BASE_URL}/airport-transfer`,
    `${BASE_URL}/intercity-taxi`,
    `${BASE_URL}/minivan-transfer`,
    `${BASE_URL}/corporate-taxi`,
    `${BASE_URL}/corporate`,

    // доверие/контент
    `${BASE_URL}/reviews`,
    `${BASE_URL}/faq`,

    // документы
    `${BASE_URL}/privacy`,
    `${BASE_URL}/agreement`,
    `${BASE_URL}/personal-data`,

    // если реально есть и нужна (иначе удали)
    // `${BASE_URL}/thanks`,
  ];

  // ❌ убрали менее нужное:
  // - `${BASE_URL}/city` (дубль/служебное, обычно не посадочная)

  // SEO-маршруты /route/from/to — добиваем до ровно 500
  const routeCount = Math.max(0, YANDEX_LIMIT - staticUrls.length);
  const routeUrls = buildSeoRouteUrls(BASE_URL, routeCount);

  // ✅ гарантированно ровно 500 (если buildSeoRouteUrls вернул меньше — дополним не сможем, но обычно он генерит много)
  const urls = [...staticUrls, ...routeUrls].slice(0, YANDEX_LIMIT);

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls
      .map((u) => {
        const loc = xmlEscape(u);
        return `<url><loc>${loc}</loc><lastmod>${now}</lastmod></url>`;
      })
      .join("") +
    `</urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}