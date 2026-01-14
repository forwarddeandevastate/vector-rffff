import LeadForm from "./lead-form";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500/20",
        className
      )}
      aria-hidden
    >
      {/* Простая “монограмма” */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4.5 6.5l7.5 13 7.5-13"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.7 6.5h10.6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.5 3.75h5A2.75 2.75 0 0 1 17.25 6.5v11A2.75 2.75 0 0 1 14.5 20.25h-5A2.75 2.75 0 0 1 6.75 17.5v-11A2.75 2.75 0 0 1 9.5 3.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M10 17.25h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconWhatsapp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21a9 9 0 0 1-4.07-.97L3.75 21l1.06-3.98A9 9 0 1 1 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 8.9c.2-.5.4-.5.7-.5h.6c.2 0 .4 0 .5.3l.7 1.7c.1.3.1.5-.1.7l-.5.6c-.1.2-.2.4 0 .6.4.8 1.5 1.9 2.3 2.3.2.1.4 0 .6 0l.6-.5c.2-.2.4-.2.7-.1l1.7.7c.3.1.3.3.3.5v.6c0 .3 0 .5-.5.7-.7.3-2.1.5-4.5-1.5-2.0-1.7-3.3-3.9-3.4-4.7-.1-.6.1-1.2.3-1.4Z"
        fill="currentColor"
        opacity="0.18"
      />
    </svg>
  );
}

function IconTelegram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.75 5.6 3.9 12.2c-.8.3-.79 1.44.02 1.72l4.2 1.45 1.6 4.93c.26.8 1.27.95 1.74.27l2.4-3.5 4.1 3.01c.63.46 1.51.12 1.7-.66l2.2-13.96c.13-.83-.7-1.46-1.41-1.18Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.1 15.4 18.4 7.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm">
      {children}
    </span>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-extrabold text-zinc-900">{title}</div>
      <div className="mt-2 text-sm leading-6 text-zinc-600">{text}</div>
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold text-indigo-700">{n}</div>
      <div className="mt-1 text-sm font-extrabold text-zinc-900">{title}</div>
      <div className="mt-2 text-sm leading-6 text-zinc-600">{text}</div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <summary className="cursor-pointer list-none select-none text-sm font-extrabold text-zinc-900">
        <div className="flex items-center justify-between gap-3">
          <span>{q}</span>
          <span className="text-zinc-500 transition group-open:rotate-45" aria-hidden>
            +
          </span>
        </div>
      </summary>
      <div className="mt-3 text-sm leading-6 text-zinc-600">{a}</div>
    </details>
  );
}

export default function HomePage() {
  // Заглушки — поменяешь на реальные
  const PHONE_DISPLAY = "+7 (999) 123-45-67";
  const PHONE_TEL = "+79991234567";
  const WHATSAPP = "https://wa.me/79991234567";
  const TELEGRAM = "https://t.me/";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href="/" className="flex items-center gap-3">
            <LogoMark />
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight">Вектор РФ</div>
              <div className="text-xs text-zinc-600">Трансферы и поездки по России</div>
            </div>
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            <a href="#order" className="rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
              Заявка
            </a>
            <a href="#how" className="rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
              Как работаем
            </a>
            <a href="#faq" className="rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
              Вопросы
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${PHONE_TEL}`}
              className="hidden items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50 md:inline-flex"
              title="Позвонить"
            >
              <IconPhone className="h-4 w-4 text-zinc-700" />
              {PHONE_DISPLAY}
            </a>
            <a
              href="/admin/login"
              className="rounded-xl bg-zinc-900 px-3 py-2 text-sm font-extrabold text-white hover:bg-zinc-800"
            >
              Админка
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-zinc-50 to-zinc-50" />
        <div className="absolute left-1/2 top-[-140px] -z-10 h-[340px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
          <div className="md:col-span-7">
            <div className="flex flex-wrap gap-2">
              <Pill>Проверенные водители</Pill>
              <Pill>Стоимость согласуем заранее</Pill>
              <Pill>Город и межгород</Pill>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Надёжный трансфер —
              <span className="text-indigo-700"> спокойно и точно</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-700">
              Оставьте заявку за 1 минуту. Диспетчер уточнит маршрут и время, подтвердит стоимость и организует подачу.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="text-2xl font-extrabold tracking-tight">5–10 мин</div>
                <div className="mt-1 text-sm text-zinc-600">обычно до связи</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="text-2xl font-extrabold tracking-tight">24/7</div>
                <div className="mt-1 text-sm text-zinc-600">приём заявок</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="text-2xl font-extrabold tracking-tight">Прозрачно</div>
                <div className="mt-1 text-sm text-zinc-600">без сюрпризов</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="#order"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-indigo-500"
              >
                Оставить заявку
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                <IconWhatsapp className="h-4 w-4 text-zinc-700" />
                WhatsApp
              </a>
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                <IconTelegram className="h-4 w-4 text-zinc-700" />
                Telegram
              </a>
            </div>

            <div className="mt-6 rounded-2xl border border-indigo-100 bg-white/70 p-4 text-sm text-zinc-700 shadow-sm">
              <div className="font-semibold text-zinc-900">Как подтверждаем заявку</div>
              <ul className="mt-2 grid gap-1">
                <li>Маршрут и время — фиксируем.</li>
                <li>Стоимость — согласуем до подачи.</li>
                <li>Пожелания — учитываем (багаж, кресло, рейс).</li>
              </ul>
            </div>
          </div>

          {/* Form / Contacts */}
          <div id="order" className="md:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-white shadow-lg">
              <div className="border-b border-zinc-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold text-zinc-900">Заявка на трансфер</div>
                    <div className="mt-1 text-sm text-zinc-600">Заполните форму — мы свяжемся с вами.</div>
                  </div>
                  <div className="rounded-2xl bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                    ~ 1 мин
                  </div>
                </div>
              </div>

              <div className="p-5">
                <LeadForm />
              </div>

              <div className="border-t border-zinc-200 bg-zinc-50 p-5">
                <div className="text-sm font-extrabold text-zinc-900">Контакты</div>

                <div className="mt-3 grid gap-2">
                  <a
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                    href={`tel:${PHONE_TEL}`}
                  >
                    <IconPhone className="h-4 w-4 text-zinc-700" />
                    {PHONE_DISPLAY}
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                      href={WHATSAPP}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconWhatsapp className="h-4 w-4 text-zinc-700" />
                      WhatsApp
                    </a>

                    <a
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                      href={TELEGRAM}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconTelegram className="h-4 w-4 text-zinc-700" />
                      Telegram
                    </a>
                  </div>
                </div>

                <div className="mt-4 text-xs text-zinc-500">
                  Нажимая “Отправить заявку”, вы соглашаетесь на обработку персональных данных.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust blocks */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold tracking-tight">Почему нам доверяют</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Мы работаем прозрачно: подтверждение, контроль заявки, понятные условия.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <InfoCard title="Фиксация заявки" text="Заявка сохраняется, диспетчер ведёт её до завершения поездки." />
          <InfoCard title="Подтверждение деталей" text="Уточняем время, маршрут, класс авто и пожелания по поездке." />
          <InfoCard title="Комфорт и пунктуальность" text="Подбор авто под задачу, спокойная поездка без лишних вопросов." />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold tracking-tight">Как мы работаем</h2>
          <p className="mt-2 text-sm text-zinc-600">Три понятных шага.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Step n="ШАГ 1" title="Оставляете заявку" text="Укажите маршрут, телефон и пожелания — это быстро." />
          <Step n="ШАГ 2" title="Подтверждаем" text="Диспетчер уточнит детали и согласует стоимость." />
          <Step n="ШАГ 3" title="Подача авто" text="Машина приезжает в назначенное время, вы спокойно едете." />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold tracking-tight">Частые вопросы</h2>
          <p className="mt-2 text-sm text-zinc-600">Короткие ответы на популярные вопросы.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <FAQItem
            q="Когда вы свяжетесь после заявки?"
            a="Обычно в течение 5–10 минут. Если срочно — удобнее написать в WhatsApp или Telegram."
          />
          <FAQItem
            q="Как формируется стоимость?"
            a="Зависит от маршрута, времени и класса авто. Стоимость согласуем до подачи автомобиля."
          />
          <FAQItem
            q="Можно ли детское кресло?"
            a="Да. Укажите это в комментарии — диспетчер подтвердит наличие и условия."
          />
          <FAQItem
            q="Работаете межгород?"
            a="Да. Укажите откуда/куда и время — мы подтвердим поездку."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <LogoMark className="h-10 w-10 rounded-2xl" />
              <div className="text-sm text-zinc-600">
                <div className="font-extrabold text-zinc-900">Вектор РФ</div>
                <div>Трансферы и поездки по России</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50"
                href={`tel:${PHONE_TEL}`}
              >
                <IconPhone className="h-4 w-4 text-zinc-700" />
                {PHONE_DISPLAY}
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50"
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
              >
                <IconWhatsapp className="h-4 w-4 text-zinc-700" />
                WhatsApp
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50"
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
              >
                <IconTelegram className="h-4 w-4 text-zinc-700" />
                Telegram
              </a>
            </div>
          </div>

          <div className="mt-6 text-xs text-zinc-500">
            © {new Date().getFullYear()} Вектор РФ. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
