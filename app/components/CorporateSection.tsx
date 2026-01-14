export default function CorporateSection() {
  return (
    <section
      id="corporate"
      className="mt-10 rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-10"
    >
      <div className="flex flex-col gap-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-900">
          Для юридических лиц
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
          Корпоративные трансферы и обслуживание компаний
        </h2>

        <p className="max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
          Работаем с организациями по договору: трансферы сотрудников, встреча гостей, регулярные поездки,
          межгород и аэропорты. Подготовим КП под ваши маршруты и объёмы.
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="text-sm font-bold text-zinc-900">Договор и закрывающие</div>
            <div className="mt-1 text-xs leading-5 text-zinc-600">
              Договор, счёт, акт/УПД, безналичный расчёт
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="text-sm font-bold text-zinc-900">Персональный менеджер</div>
            <div className="mt-1 text-xs leading-5 text-zinc-600">
              Быстро подтверждаем заявки и маршруты
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="text-sm font-bold text-zinc-900">Отчётность</div>
            <div className="mt-1 text-xs leading-5 text-zinc-600">
              Реестр поездок, аналитика, выгрузка по запросу
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="text-sm font-bold text-zinc-900">Гибкие условия</div>
            <div className="mt-1 text-xs leading-5 text-zinc-600">
              Фиксация тарифов на объём / индивидуальные условия
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-sky-200/70 bg-sky-50/60 p-4">
          <div className="text-sm font-bold text-sky-900">Что нужно для КП</div>
          <ul className="mt-2 grid gap-2 text-xs text-zinc-700 sm:grid-cols-2">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-sky-600" />
              Города/маршруты и примерный объём поездок
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-sky-600" />
              Классы авто и требования (кресла/багаж/встреча)
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-sky-600" />
              Оплата по безналу / пост-оплата / лимиты
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-sky-600" />
              Контакты ответственного лица
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <a
            href="#lead"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-5 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
          >
            Запросить КП / оставить заявку
          </a>

          <a
            href="mailto:admin@vectorrf.ru?subject=%D0%9A%D0%9F%20%D0%B4%D0%BB%D1%8F%20%D1%8E%D1%80%D0%BB%D0%B8%D1%86%20(%D0%92%D0%B5%D0%BA%D1%82%D0%BE%D1%80%20%D0%A0%D0%A4)"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-bold text-zinc-800 hover:bg-white/70"
          >
            Написать на почту
          </a>
        </div>

        <div className="mt-2 text-[11px] leading-5 text-zinc-500">
          * Почту и контакты позже можно подтянуть из SiteSettings.
        </div>
      </div>
    </section>
  );
}
