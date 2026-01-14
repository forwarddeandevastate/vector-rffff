import LeadForm from "./lead-form";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white">
      {children}
    </span>
  );
}

function Card({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-sm font-extrabold tracking-tight">{title}</div>
      <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{text}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-black">
              V
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight">Вектор РФ</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Трансферы и поездки по России</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#form"
              className="hidden rounded-xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 sm:inline-flex"
            >
              Оставить заявку
            </a>
            <a
              href="/admin/login"
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              Вход в админку
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950" />
        <div className="absolute -top-24 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge>Круглосуточно</Badge>
                <Badge>Фиксируем цену до поездки</Badge>
                <Badge>Аэропорты • Межгород</Badge>
              </div>

              <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                Надёжный трансфер
                <br />
                <span className="text-white/80">по России</span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                Оставьте заявку — диспетчер свяжется с вами, уточнит детали и подтвердит поездку.
                Без лишних звонков и переписок.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#form"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-black shadow-sm hover:bg-zinc-200"
                >
                  Оставить заявку
                </a>
                <a
                  href="#how"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Как это работает
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs font-semibold text-white/60">Среднее время ответа</div>
                  <div className="mt-1 text-xl font-extrabold text-white">5–10 мин</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs font-semibold text-white/60">Оплата</div>
                  <div className="mt-1 text-xl font-extrabold text-white">По договорённости</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs font-semibold text-white/60">Классы авто</div>
                  <div className="mt-1 text-xl font-extrabold text-white">Стандарт—Бизнес</div>
                </div>
              </div>
            </div>

            <div id="form" className="lg:justify-self-end">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
                <div className="mb-3 px-2">
                  <div className="text-sm font-extrabold text-white">Заявка на трансфер</div>
                  <div className="mt-1 text-xs text-white/60">
                    Заполните форму — мы свяжемся с вами
                  </div>
                </div>
                <LeadForm />
              </div>

              <div className="mt-3 text-xs text-white/50">
                Отправляя заявку, вы соглашаетесь на обработку персональных данных.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            title="Пунктуально"
            text="Отслеживаем время, уточняем детали и приезжаем заранее."
          />
          <Card
            title="Прозрачно"
            text="Подтверждаем маршрут и цену до поездки — без сюрпризов."
          />
          <Card
            title="Удобно"
            text="Свяжемся любым способом: звонок, WhatsApp, Telegram."
          />
        </div>
      </section>

      {/* How */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-2xl font-extrabold tracking-tight">Как это работает</div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Шаг 1</div>
              <div className="mt-1 text-sm font-extrabold">Оставляете заявку</div>
              <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Маршрут, время, класс авто и комментарий.
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Шаг 2</div>
              <div className="mt-1 text-sm font-extrabold">Диспетчер подтверждает</div>
              <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Мы уточняем детали и фиксируем условия поездки.
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Шаг 3</div>
              <div className="mt-1 text-sm font-extrabold">Поездка</div>
              <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Водитель приезжает вовремя — вы спокойно едете по маршруту.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              © {new Date().getFullYear()} Вектор РФ
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Для связи: WhatsApp / Telegram / телефон
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
