import { NextResponse } from "next/server";
import { buildSeoRoutes } from "@/lib/seo-routes";

export const runtime = "nodejs";
export const dynamic = "force-static";

const BASE_URL = "https://vector-rf.ru";

// Берём тот же пул маршрутов
const ROUTES = buildSeoRoutes(2000);

function buildXml() {
  const now = new Date().toISOString();

  const urls = ROUTES.map((r) => {
    const loc = `${BASE_URL}/route/${r.from}/${r.to}`;

    return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function GET() {
  const xml = buildXml();

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}