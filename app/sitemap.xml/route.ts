import { NextResponse } from "next/server";

import {
  REVALIDATE_SITEMAP_SECONDS,
  getSitemapIds,
  renderSitemapIndex,
} from "@/lib/sitemap-data";

export const revalidate = REVALIDATE_SITEMAP_SECONDS;

export function GET() {
  const xml = renderSitemapIndex(getSitemapIds());

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, s-maxage=${REVALIDATE_SITEMAP_SECONDS}, stale-while-revalidate=${REVALIDATE_SITEMAP_SECONDS}`,
    },
  });
}
