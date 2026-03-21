/**
 * seo-route-client.tsx — Server Component.
 * Рендерит форму заявки для страниц маршрутов.
 */
import { GlassPanel, IconPhone, IconTelegram, PHONE_TEL, TELEGRAM } from "@/app/ui/shared";
import RouteFormIsland from "./route-form-island";

export default function SeoRouteFormClient({
  fromName,
  toName,
}: {
  fromName: string;
  toName: string;
}) {
  return (
    <div id="order" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
      <GlassPanel className="overflow-hidden">
        <div className="border-b border-blue-100/60 p-4">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white/80 px-3 py-2.5 text-sm font-semibold text-blue-800 hover:bg-blue-50 transition-colors"
            >
              <IconPhone className="h-4 w-4 text-blue-500" />Позвонить
            </a>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm"
            >
              <IconTelegram className="h-4 w-4" />Telegram
            </a>
          </div>
          <p className="mt-3 text-sm font-bold text-slate-800">
            {fromName} — {toName}
          </p>
        </div>
        <div className="p-3">
          <RouteFormIsland fromName={fromName} toName={toName} />
        </div>
      </GlassPanel>
    </div>
  );
}
