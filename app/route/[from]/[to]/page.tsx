import { notFound, permanentRedirect } from "next/navigation";

import { isValidRouteSlugs } from "@/lib/city-landings";

function normalizeSlug(input: string) {
  const raw = (input ?? "").trim();
  let s = raw;
  try {
    s = decodeURIComponent(raw);
  } catch {}
  return s.trim().toLowerCase().replace(/[—–-−]/g, "-").replace(/-+/g, "-");
}

// Старые URL вида /route/{from}/{to} держим только как permanent redirect.
// Невалидные и технические адреса вроде /route/undefined/undefined отдаём как 404,
// чтобы они не лезли в индекс и не портили качество кластера.
export default async function Page({ params }: { params: Promise<{ from: string; to: string }> | { from: string; to: string } }) {
  const resolved = await Promise.resolve(params as any);
  const from = normalizeSlug(resolved.from);
  const to = normalizeSlug(resolved.to);

  if (!isValidRouteSlugs(from, to)) {
    notFound();
  }

  permanentRedirect(`/${encodeURIComponent(from)}/${encodeURIComponent(to)}`);
}
