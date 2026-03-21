/**
 * static-form-fields.tsx — Server Component.
 * HTML-скелет полей формы — виден боту, краулеру, до JS.
 * После гидрации перекрывается реальной LeadForm через CityFormIsland.
 * 
 * Использование: рендерить рядом с CityFormIsland/RouteFormIsland
 * с aria-hidden="true" на статике после mount клиента.
 */

export default function StaticFormFields({
  fromValue = "",
  toValue = "",
}: {
  fromValue?: string;
  toValue?: string;
}) {
  return (
    <div className="space-y-3" aria-label="Форма заявки">
      {/* Откуда */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Откуда</label>
        <div className="w-full rounded-xl border border-blue-100/60 bg-white/80 px-3 py-2.5 text-sm min-h-[40px] text-slate-500">
          {fromValue || "Город или адрес отправления"}
        </div>
      </div>

      {/* Куда */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Куда</label>
        <div className="w-full rounded-xl border border-blue-100/60 bg-white/80 px-3 py-2.5 text-sm min-h-[40px] text-slate-500">
          {toValue || "Город или адрес назначения"}
        </div>
      </div>

      {/* Имя + Телефон */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Ваше имя</label>
          <div className="w-full rounded-xl border border-blue-100/60 bg-white/80 px-3 py-2.5 text-sm text-slate-400">
            Имя
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Телефон</label>
          <div className="w-full rounded-xl border border-blue-100/60 bg-white/80 px-3 py-2.5 text-sm text-slate-400">
            +7 (___) ___-__-__
          </div>
        </div>
      </div>

      {/* Кнопка — неактивная, видна как элемент страницы */}
      <div className="w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-extrabold text-white opacity-50">
        Рассчитать стоимость и заказать
      </div>
    </div>
  );
}
