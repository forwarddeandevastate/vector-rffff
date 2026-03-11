import { NextResponse } from "next/server";

import {
  REVALIDATE_SITEMAP_SECONDS,
  getSitemapEntriesById,
  getSitemapIds,
  renderUrlSet,
} from "@/lib/sitemap-data";

export const revalidate = REVALIDATE_SITEMAP_SECONDS;

export function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return context.params.then(({ id }) => {
    if (!getSitemapIds().includes(id)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const xml = renderUrlSet(getSitemapEntriesById(id));

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": `public, s-maxage=${REVALIDATE_SITEMAP_SECONDS}, stale-while-revalidate=${REVALIDATE_SITEMAP_SECONDS}`,
      },
    });
  });
}
