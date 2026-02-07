// app/faq.tsx
export default function FAQ() {
  const items = [
    {
      q: "Сколько стоит трансфер и как считается цена?",
      a: "Цена зависит от маршрута и класса авто (Стандарт/Комфорт/Бизнес/Минивэн). После заявки мы быстро подтверждаем стоимость и подачу. Без скрытых платежей.",
    },
    {
      q: "Как быстро подаётся машина?",
      a: "По городу — обычно от 15–30 минут (зависит от района и времени). В ensured-время (аэропорт/межгород) — подача к указанному времени.",
    },
    {
      q: "Встречаете в аэропорту с табличкой?",
      a: "Да. Водитель встречает в зоне прилёта с табличкой, помогает с багажом. Можно указать номер рейса в комментарии к заявке.",
    },
    {
      q: "Можно ли заказать межгород туда-обратно?",
      a: "Да, отметь «Туда-обратно» в форме — мы учтём обратную поездку и согласуем детали.",
    },
    {
      q: "Работаете с компаниями?",
      a: "Да. Корпоративные перевозки, поездки сотрудников, трансферы в аэропорт/межгород. Работаем по договору, предоставляем закрывающие документы.",
    },
  ];

  return (
    <section id="faq" className="scroll-mt-28">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Вопросы и ответы
        </h2>
        <p className="mt-2 text-slate-600">
          Коротко о подаче, стоимости и формате поездок.
        </p>

        <div className="mt-8 space-y-3">
          {items.map((it, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="text-base font-semibold text-slate-900">
                  {it.q}
                </span>
                <span className="select-none rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 group-open:hidden">
                  +
                </span>
                <span className="select-none rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hidden group-open:inline">
                  —
                </span>
              </summary>

              <div className="mt-3 text-slate-700 leading-relaxed">{it.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}