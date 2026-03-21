/**
 * seo-city-client.tsx — Server Component.
 * SSR-обёртка формы для городских страниц.
 * 
 * Что в HTML (видит бот + LCP):
 *   - Кнопки "Позвонить" / "Telegram"
 *   - Статичные поля Откуда/Куда/Имя/Телефон
 *   - Кнопка отправки
 *
 * Что добавляет JS после гидрации:
 *   - CityFormIsland: Google Places autocomplete, расчёт цены, submit
 */
import { GlassPanel, IconPhone, IconTelegram, PHONE_TEL, PHONE_DISPLAY, TELEGRAM } from "@/app/ui/shared";
import StaticFormFields from "./static-form-fields";
import CityFormIslandWrapper from "./city-form-island-wrapper";

export default function SeoCityFormClient({
  cityName,
  initialFrom,
}: {
  cityName: string;
  initialFrom?: string;
}) {
  const from = initialFrom ?? cityName;

  return (
    <div id="order" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
      <GlassPanel className="overflow-hidden">
        {/* Шапка — всегда в SSR */}
        <div className="border-b border-blue-100/60 p-4">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white/80 px-3 py-2.5 text-sm font-semibold text-blue-800 hover:bg-blue-50 transition-colors"
            >
              <IconPhone className="h-4 w-4 text-blue-500" aria-hidden />
              {PHONE_DISPLAY}
            </a>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm"
            >
              <IconTelegram className="h-4 w-4" aria-hidden />
              Telegram
            </a>
          </div>
          <p className="mt-3 text-sm font-bold text-slate-800">
            Заказать такси из {cityName}
          </p>
        </div>

        {/* Тело формы: статика в SSR + интерактив после гидрации */}
        <div className="p-3 relative">
          {/* SSR-скелет полей — виден боту */}
          <StaticFormFields fromValue={from} />
          {/* Client island — монтируется поверх, скрывает скелет */}
          <CityFormIslandWrapper cityName={cityName} initialFrom={from} />
        </div>
      </GlassPanel>
    </div>
  );
}
