import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-static";

const BASE = "https://vector-rf.ru";

export function GET() {
  const body = `User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

# Яндекс: чистим мусорные параметры
Clean-param: etext / 
Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content / 
Clean-param: gclid&yclid&fbclid / 

Host: vector-rf.ru
Sitemap: ${BASE}/sitemap.xml
Sitemap: ${BASE}/sitemap-yandex.xml
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}