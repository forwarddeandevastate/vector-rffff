/**
 * home-page-static-form.tsx — Server Component.
 * Статичная HTML-версия формы заявки — видна боту, Googlebot, до гидрации.
 * Даёт правильный LCP, видимость полей формы в HTML.
 * После гидрации HomePageInteractive берёт управление через suppressHydrationWarning.
 */

import { GlassPanel, IconPhone, IconTelegram, PHONE_TEL, PHONE_DISPLAY, TELEGRAM } from "@/app/ui/shared";

export default function HomePageStaticForm() {
  return (
    <div id="order-static" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start" aria-hidden="false">
      <GlassPanel className="overflow-hidden">
        {/* Кнопки связи — видимы сразу */}
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
          <p className="mt-3 text-sm font-bold text-slate-800">Оставить заявку</p>
        </div>

        {/* Статичные поля формы — видны в HTML, индексируются */}
        <div className="p-4 space-y-3">
          {/* Тип маршрута */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "intercity", label: "Межгород",  desc: "Между городами" },
              { value: "airport",   label: "Аэропорт",  desc: "Под рейс" },
              { value: "city",      label: "По городу", desc: "Поездки по городу" },
            ].map((t) => (
              <div
                key={t.value}
                className={`rounded-xl border p-2.5 text-center cursor-pointer text-xs font-semibold ${
                  t.value === "intercity"
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-blue-100/60 bg-white/70 text-slate-700"
                }`}
              >
                <div className="font-bold">{t.label}</div>
                <div className="text-[10px] mt-0.5 opacity-75">{t.desc}</div>
              </div>
            ))}
          </div>

          {/* Откуда / Куда */}
          <div className="grid gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Откуда</label>
              <div className="w-full rounded-xl border border-blue-100/60 bg-white/80 px-3 py-2.5 text-sm text-slate-400">
                Город или адрес отправления
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Куда</label>
              <div className="w-full rounded-xl border border-blue-100/60 bg-white/80 px-3 py-2.5 text-sm text-slate-400">
                Город или адрес назначения
              </div>
            </div>
          </div>

          {/* Имя / Телефон */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Имя</label>
              <div className="w-full rounded-xl border border-blue-100/60 bg-white/80 px-3 py-2.5 text-sm text-slate-400">
                Ваше имя
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Телефон</label>
              <div className="w-full rounded-xl border border-blue-100/60 bg-white/80 px-3 py-2.5 text-sm text-slate-400">
                +7 (___) ___-__-__
              </div>
            </div>
          </div>

          {/* Кнопка отправки */}
          <div
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-extrabold text-white opacity-60"
            aria-label="Отправить заявку"
          >
            Получить стоимость и заказать
          </div>

          <p className="text-[10px] text-slate-400 text-center">
            Стоимость подтверждаем до выезда · Работаем 24/7
          </p>
        </div>
      </GlassPanel>
    </div>
  );
}
