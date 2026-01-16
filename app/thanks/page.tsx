import Link from "next/link";

export const metadata = {
  title: "Заявка отправлена — Вектор РФ",
  description: "Спасибо! Мы получили вашу заявку и скоро свяжемся с вами.",
};

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50">
      {/* Top header bar */}
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 shadow-sm ring-1 ring-sky-200">
              <div className="absolute -right-6 -top-6 h-12 w-12 rounded-full bg-white/20" />
              <div className="absolute bottom-2 left-2 h-2 w-2 rounded-full bg-white/80" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-blue-700">
                Вектор РФ
              </div>
              <div className="text-xs text-slate-500">Трансферы и поездки по России</div>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            На главную
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Card */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-sky-100 blur-2xl" />
              <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-blue-100 blur-2xl" />

              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-sm ring-1 ring-sky-200">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>

                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                      Спасибо! Заявка отправлена
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                      Мы получили вашу заявку. Обычно связываемся в течение{" "}
                      <span className="font-semibold text-slate-900">5–15 минут</span> (в рабочее время).
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-500">Статус</div>
                    <div className="mt-1 text-sm font-bold text-slate-900">Принято</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-500">Проверка</div>
                    <div className="mt-1 text-sm font-bold text-slate-900">Диспетчер</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-500">Далее</div>
                    <div className="mt-1 text-sm font-bold text-slate-900">Подтверждение</div>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-95"
                  >
                    Вернуться на главную
                  </Link>
                  <Link
                    href="/#request"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Отправить ещё одну заявку
                  </Link>
                </div>

                <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">
                    Если нужно срочно — напишите нам
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Мы быстрее ответим в мессенджере. Укажите, что заявка уже отправлена на сайте.
                  </p>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <a
                      href="https://wa.me/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      WhatsApp
                    </a>
                    <a
                      href="https://t.me/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      Telegram
                    </a>
                    <a
                      href="tel:+7"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      Позвонить
                    </a>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    *Ссылки на контакты можно подключить к вашим SiteSettings — скажешь, и я сделаю.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Side info */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                Что будет дальше
              </h2>

              <ul className="mt-4 space-y-4 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-600" />
                  Уточним детали маршрута и время подачи.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-600" />
                  Подтвердим стоимость и класс авто.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-600" />
                  Зафиксируем заказ и пришлём подтверждение.
                </li>
              </ul>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  Важно
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Если вы указали неверный номер или мессенджер — отправьте заявку ещё раз
                  или свяжитесь с нами напрямую.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/#faq"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Частые вопросы
                </Link>
                <Link
                  href="/#how"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Как мы работаем
                </Link>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-700 to-sky-600 p-6 text-white shadow-sm sm:p-8">
              <div className="text-sm font-semibold text-white/90">Вектор РФ</div>
              <div className="mt-2 text-xl font-extrabold tracking-tight">
                Спокойно, вовремя, по делу.
              </div>
              <p className="mt-2 text-sm text-white/90">
                Работаем аккуратно, подтверждаем детали и держим связь.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-500 sm:px-6">
          © {new Date().getFullYear()} Вектор РФ — трансферы и поездки по России
        </div>
      </footer>
    </div>
  );
}
