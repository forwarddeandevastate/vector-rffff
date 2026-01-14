import LeadForm from "./lead-form";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm">
      {children}
    </span>
  );
}

function InfoCard({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
          <span className="text-lg" aria-hidden>
            {icon}
          </span>
        </div>
        <div>
          <div className="text-sm font-extrabold text-zinc-900">{title}</div>
          <div className="mt-1 text-sm leading-6 text-zinc-600">{text}</div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-extrabold tracking-tight text-zinc-900">{value}</div>
      <div className="mt-1 text-sm text-zinc-600">{label}</div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <summary className="cursor-pointer list-none select-none text-sm font-extrabold text-zinc-900">
        <div className="flex items-center justify-between gap-3">
          <span>{q}</span>
          <span className="text-zinc-500 group-open:rotate-45 transition" aria-hidden>
            +
          </span>
        </div>
      </summary>
      <div className="mt-3 text-sm leading-6 text-zinc-600">{a}</div>
    </details>
  );
}

export default function HomePage() {
  // Заглушки — поменяешь на реальные контакты/ссылки
  const PHONE_DISPLAY = "+7 (999) 123-45-67";
  const PHONE_TEL = "+79991234567";
  const WHATSAPP = "https://wa.me/79991234567";
  const TELEGRAM = "https://t.me/"; // можно поставить ссылку на аккаунт/бота

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Topbar */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
              V
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight">Вектор РФ</div>
              <div className="text-xs text-zinc-600">Трансферы и поездки по России</div>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href="#order"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              Оставить заявку
            </a>
            <a
              href="#how"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              Как работаем
            </a>
            <a
              href="#faq"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              Вопросы
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${PHONE_TEL}`}
              className="hidden rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50 md:inline-flex"
              title="Позвонить"
            >
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
        <div className="absolute left-1/2 top-[-140px] -z-10 h-[340px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
          <div className="md:col-span-7">
            <div className="flex flex-wrap gap-2">
              <Pill>🛡️ Проверенные водители</Pill>
              <Pill>🧾 Цена согласуется заранее</Pill>
              <Pill>📍 Город и межгород</Pill>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Надёжный трансфер —{" "}
              <span className="text-indigo-700">без сюрпризов</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-700">
              Оставьте заявку за 1 минуту. Диспетчер уточнит маршрут и время,
              подтвердит стоимость и отправит машину.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Stat value="5–10 мин" label="обычно до связи" />
              <Stat value="24/7" label="приём заявок" />
              <Stat value="0 ₽" label="предоплата (по договорённости)" />
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
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Написать в WhatsApp
              </a>
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Telegram
              </a>
            </div>

            <div className="mt-5 rounded-2xl border border-indigo-100 bg-white/70 p-4 text-sm text-zinc-700 shadow-sm">
              <div className="font-semibold text-zinc-900">Что важно:</div>
              <ul className="mt-2 grid gap-1">
                <li>• Стоимость согласуем до подачи автомобиля.</li>
                <li>• Можно указать багаж, детское кресло, номер рейса.</li>
                <li>• Все заявки фиксируются — ничего не “теряется”.</li>
              </ul>
            </div>
          </div>

          {/* Form card */}
          <div id="order" className="md:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-zinc-900">Заявка на трансфер</div>
                  <div className="mt-1 text-sm text-zinc-600">
                    Заполните форму — мы свяжемся с вами.
                  </div>
                </div>
                <div className="rounded-2xl bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                  1 мин
                </div>
              </div>

              <div className="mt-4">
                <LeadForm />
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
                <div className="font-semibold text-zinc-900">Контакты</div>
                <div className="mt-2 grid gap-2">
                  <a className="hover:underline" href={`tel:${PHONE_TEL}`}>
                    📞 {PHONE_DISPLAY}
                  </a>
                  <a className="hover:underline" href={WHATSAPP} target="_blank" rel="noreferrer">
                    💬 WhatsApp
                  </a>
                  <a className="hover:underline" href={TELEGRAM} target="_blank" rel="noreferrer">
                    ✈️ Telegram
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-zinc-500">
              Нажимая “Отправить заявку”, вы соглашаетесь на обработку персональных данных.
            </div>
          </div>
        </div>
      </section>

      {/* Trust blocks */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold tracking-tight">Почему нам доверяют</h2>
          <p className="mt-2 text-sm text-zinc-600">
            У нас “по-взрослому”: подтверждение, ответственность, прозрачные условия.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <InfoCard
            icon="🧾"
            title="Фиксация заявки"
            text="Заявка сохраняется в системе, диспетчер ведёт её до завершения поездки."
          />
          <InfoCard
            icon="🧑‍✈️"
            title="Диспетчер на связи"
            text="Уточняем детали: адреса, время, класс авто, багаж, детское кресло."
          />
          <InfoCard
            icon="🛡️"
            title="Аккуратная подача"
            text="Подбор автомобиля под задачу. Пунктуальность и вежливое общение."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold tracking-tight">Как мы работаем</h2>
          <p className="mt-2 text-sm text-zinc-600">Простой процесс без лишних звонков туда-сюда.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold text-indigo-700">ШАГ 1</div>
            <div className="mt-1 text-sm font-extrabold">Вы оставляете заявку</div>
            <div className="mt-2 text-sm leading-6 text-zinc-600">
              Укажите маршрут, телефон и пожелания. Это займёт минуту.
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold text-indigo-700">ШАГ 2</div>
            <div className="mt-1 text-sm font-extrabold">Мы подтверждаем детали</div>
            <div className="mt-2 text-sm leading-6 text-zinc-600">
              Диспетчер уточнит время, класс авто, багаж и согласует стоимость.
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold text-indigo-700">ШАГ 3</div>
            <div className="mt-1 text-sm font-extrabold">Подача автомобиля</div>
            <div className="mt-2 text-sm leading-6 text-zinc-600">
              Машина приезжает в назначенное время. Поездка проходит спокойно.
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold tracking-tight">Частые вопросы</h2>
          <p className="mt-2 text-sm text-zinc-600">Коротко отвечаем на то, что обычно спрашивают.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <FAQItem
            q="Когда вы свяжетесь после заявки?"
            a="Обычно в течение 5–10 минут. Если срочно — лучше написать в WhatsApp или Telegram."
          />
          <FAQItem
            q="Как формируется цена?"
            a="Стоимость зависит от маршрута, времени, класса авто и дополнительных условий. Мы согласуем её до подачи автомобиля."
          />
          <FAQItem
            q="Можно ли заказать детское кресло?"
            a="Да. Укажите это в комментарии к заявке — диспетчер подтвердит наличие и условия."
          />
          <FAQItem
            q="Работаете межгород?"
            a="Да. Укажите откуда/куда и ориентировочное время — мы подтвердим поездку."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-zinc-600">
              <div className="font-extrabold text-zinc-900">Вектор РФ</div>
              <div>Трансферы и поездки по России</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={`tel:${PHONE_TEL}`}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50"
              >
                📞 {PHONE_DISPLAY}
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50"
              >
                💬 WhatsApp
              </a>
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50"
              >
                ✈️ Telegram
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
