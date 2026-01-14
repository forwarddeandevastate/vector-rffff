"use client";

import { useRef, useState } from "react";
import LeadForm from "./lead-form";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type CarClass = "standard" | "comfort" | "business" | "minivan";

function LogoMark() {
  return (
    <div
      className={cn(
        "relative grid h-11 w-11 place-items-center rounded-2xl",
        "bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600",
        "text-white shadow-sm ring-1 ring-white/20"
      )}
      aria-hidden
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4.5 6.5l7.5 13 7.5-13"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6.7 6.5h10.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Wordmark() {
  return (
    <div className="leading-tight">
      <div
        className={cn(
          "text-[15px] font-black tracking-tight",
          "bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent"
        )}
      >
        Вектор РФ
      </div>
      <div className="text-xs text-zinc-600">Трансферы и поездки по России</div>
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
        opacity="0.14"
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
      <path d="M8.1 15.4 18.4 7.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function NavPill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold",
        "text-zinc-700 hover:text-zinc-900",
        "border border-zinc-200 bg-white/70 backdrop-blur shadow-sm",
        "hover:bg-white"
      )}
    >
      {children}
    </a>
  );
}

function SectionTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">{title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{desc}</p>
    </div>
  );
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="text-sm font-extrabold text-zinc-900">{title}</div>
      <div className="mt-2 text-sm leading-6 text-zinc-600">{text}</div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
      {children}
    </span>
  );
}

function ClassCardButton({
  title,
  priceHint,
  features,
  note,
  active,
  onClick,
}: {
  title: string;
  priceHint: string;
  features: string[];
  note?: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur transition w-full",
        "focus:outline-none focus:ring-2 focus:ring-sky-200/80",
        active
          ? "border-sky-300 ring-2 ring-sky-200/70 shadow-md bg-white"
          : "border-zinc-200 hover:border-sky-200/70 hover:bg-white/90"
      )}
      aria-pressed={active ? "true" : "false"}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-zinc-900">{title}</div>
          <div className="mt-1 text-xs text-zinc-600">{priceHint}</div>
        </div>

        <div
          className={cn(
            "grid h-9 w-9 place-items-center rounded-xl ring-1",
            active ? "bg-sky-100 ring-sky-200" : "bg-sky-50 ring-sky-100"
          )}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600" />
        </div>
      </div>

      <ul className="mt-4 grid gap-2 text-sm text-zinc-700">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
            <span className="leading-6">{f}</span>
          </li>
        ))}
      </ul>

      {note ? <div className="mt-4 text-xs text-zinc-500">{note}</div> : null}
    </button>
  );
}

export default function HomePage() {
  const PHONE_DISPLAY = "+7 (999) 123-45-67";
  const PHONE_TEL = "+79991234567";
  const WHATSAPP = "https://wa.me/79991234567";
  const TELEGRAM = "https://t.me/";

  const [selectedClass, setSelectedClass] = useState<CarClass>("standard");
  const orderRef = useRef<HTMLDivElement | null>(null);

  function scrollToOrder() {
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function pickClass(v: CarClass, scrollToForm = true) {
    setSelectedClass(v);
    if (scrollToForm) scrollToOrder();
  }

  return (
    <div className="min-h-screen text-zinc-900">
      <div className="fixed inset-0 -z-20 bg-[#f3f7ff]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_50%_-10%,rgba(56,189,248,0.35),transparent_60%),radial-gradient(900px_520px_at_12%_18%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(900px_520px_at_88%_20%,rgba(99,102,241,0.14),transparent_55%)]" />
      <div className="fixed inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white/70 to-transparent" />

      <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/65 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href="/" className="flex items-center gap-3">
            <LogoMark />
            <Wordmark />
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            <NavPill href="#order">Заявка</NavPill>
            <NavPill href="#classes">Классы</NavPill>
            <NavPill href="#how">Как работаем</NavPill>
            <NavPill href="#faq">Вопросы</NavPill>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${PHONE_TEL}`}
              className={cn(
                "hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold md:inline-flex",
                "border border-zinc-200 bg-white/70 shadow-sm backdrop-blur hover:bg-white"
              )}
              title="Позвонить"
            >
              <IconPhone className="h-4 w-4 text-sky-700" />
              <span className="text-zinc-800">{PHONE_DISPLAY}</span>
            </a>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-semibold",
                "border border-zinc-200 bg-white/70 shadow-sm backdrop-blur hover:bg-white"
              )}
              title="WhatsApp"
            >
              <IconWhatsapp className="h-4 w-4 text-sky-700" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <a
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-semibold",
                "border border-zinc-200 bg-white/70 shadow-sm backdrop-blur hover:bg-white"
              )}
              title="Telegram"
            >
              <IconTelegram className="h-4 w-4 text-sky-700" />
              <span className="hidden sm:inline">Telegram</span>
            </a>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-12 md:py-14">
          <div className="md:col-span-7">
            <div className="flex flex-wrap gap-2">
              <Badge>Проверенные водители</Badge>
              <Badge>Фиксация заявки</Badge>
              <Badge>Стоимость заранее</Badge>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Трансфер, которому
              <span className="bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                {" "}
                доверяют
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-700">
              Оставьте заявку за 1 минуту. Мы уточним детали, подтвердим стоимость и организуем подачу автомобиля.
            </p>

            {/* КАРТОЧКИ: по клику скролл к заявке */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={scrollToOrder}
                className="rounded-2xl border border-zinc-200 bg-white/80 p-4 text-left shadow-sm backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200/80"
              >
                <div className="text-sm font-extrabold text-zinc-900">Город</div>
                <div className="mt-1 text-sm text-zinc-600">Встреча и поездки по городу</div>
              </button>

              <button
                type="button"
                onClick={scrollToOrder}
                className="rounded-2xl border border-zinc-200 bg-white/80 p-4 text-left shadow-sm backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200/80"
              >
                <div className="text-sm font-extrabold text-zinc-900">Межгород</div>
                <div className="mt-1 text-sm text-zinc-600">Трансферы между городами</div>
              </button>

              <button
                type="button"
                onClick={scrollToOrder}
                className="rounded-2xl border border-zinc-200 bg-white/80 p-4 text-left shadow-sm backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200/80"
              >
                <div className="text-sm font-extrabold text-zinc-900">Аэропорты</div>
                <div className="mt-1 text-sm text-zinc-600">Встреча по времени прилёта</div>
              </button>
            </div>

            {/* ГАРАНТИИ: по клику скролл к заявке */}
            <button
              type="button"
              onClick={scrollToOrder}
              className="mt-6 w-full rounded-2xl border border-sky-200/70 bg-white/70 p-4 text-left shadow-sm backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200/80"
            >
              <div className="text-sm font-extrabold text-zinc-900">Гарантии</div>
              <div className="mt-2 grid gap-2 text-sm text-zinc-700">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                  <span>Стоимость согласуем до подачи автомобиля.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                  <span>Заявка фиксируется — ничего не теряется.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                  <span>Учитываем пожелания: багаж, кресло, рейс, остановки.</span>
                </div>
              </div>
            </button>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={scrollToOrder}
                className={cn(
                  "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold text-white shadow-sm",
                  "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:opacity-95"
                )}
              >
                Оставить заявку
              </button>

              <a
                href="#classes"
                className={cn(
                  "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold",
                  "border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
                )}
              >
                Выбрать класс авто
              </a>
            </div>
          </div>

          <div id="order" ref={orderRef} className="md:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-white/85 shadow-xl backdrop-blur">
              <div className="border-b border-zinc-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold text-zinc-900">Заявка на трансфер</div>
                    <div className="mt-1 text-sm text-zinc-600">Заполните форму — мы свяжемся с вами.</div>
                  </div>
                  <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                    ~ 1 мин
                  </div>
                </div>
              </div>

              <div className="p-5">
                <LeadForm carClass={selectedClass} onCarClassChange={(v) => pickClass(v, false)} />
              </div>

              <div className="border-t border-zinc-200 bg-white/70 p-5">
                <div className="text-sm font-extrabold text-zinc-900">Связаться напрямую</div>
                <div className="mt-3 grid gap-2">
                  <a
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                      "border border-zinc-200 bg-white/80 shadow-sm backdrop-blur hover:bg-white"
                    )}
                    href={`tel:${PHONE_TEL}`}
                  >
                    <IconPhone className="h-4 w-4 text-sky-700" />
                    {PHONE_DISPLAY}
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      className={cn(
                        "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                        "border border-zinc-200 bg-white/80 shadow-sm backdrop-blur hover:bg-white"
                      )}
                      href={WHATSAPP}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconWhatsapp className="h-4 w-4 text-sky-700" />
                      WhatsApp
                    </a>

                    <a
                      className={cn(
                        "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                        "border border-zinc-200 bg-white/80 shadow-sm backdrop-blur hover:bg-white"
                      )}
                      href={TELEGRAM}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconTelegram className="h-4 w-4 text-sky-700" />
                      Telegram
                    </a>
                  </div>
                </div>

                <div className="mt-4 text-xs text-zinc-500">
                  Нажимая “Отправить заявку”, вы соглашаетесь на обработку персональных данных.
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div className="text-sm font-extrabold text-zinc-900">Что можно указать в заявке</div>
              <div className="mt-2 grid gap-2 text-sm text-zinc-700">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                  <span>Номер рейса / время прилёта</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                  <span>Детское кресло / бустер</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                  <span>Багаж и дополнительные остановки</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionTitle
          title="Сервис без лишних вопросов"
          desc="Собираем детали, подтверждаем и ведём заявку до завершения поездки."
        />
        <div className="grid gap-3 md:grid-cols-3">
          <Card title="Фиксация заявки" text="Каждая заявка сохраняется в системе и контролируется диспетчером." />
          <Card title="Подтверждение стоимости" text="Стоимость согласуем до подачи автомобиля — заранее и прозрачно." />
          <Card title="Удобная связь" text="Можно оставить заявку или написать напрямую в мессенджер." />
        </div>
      </section>

      <section id="classes" className="mx-auto max-w-6xl px-4 pb-12">
        <SectionTitle title="Классы авто" desc="Нажмите на карточку — класс подставится в форму и подсветится." />

        <div className="grid gap-3 md:grid-cols-2">
          <ClassCardButton
            title="Стандарт"
            priceHint="Оптимально для города"
            features={[
              "Базовый комфорт, аккуратная подача",
              "Подходит для 1–3 пассажиров",
              "Хороший выбор для коротких поездок",
            ]}
            note="Точную стоимость подтверждаем до подачи."
            active={selectedClass === "standard"}
            onClick={() => pickClass("standard", true)}
          />

          <ClassCardButton
            title="Комфорт"
            priceHint="Чаще выбирают для аэропортов"
            features={[
              "Больше пространства и мягче ход",
              "Удобно с багажом",
              "Подходит для деловых и семейных поездок",
            ]}
            note="Можно указать пожелания: детское кресло, остановки."
            active={selectedClass === "comfort"}
            onClick={() => pickClass("comfort", true)}
          />

          <ClassCardButton
            title="Бизнес"
            priceHint="Максимально спокойно и представительно"
            features={[
              "Повышенный комфорт и тишина в салоне",
              "Подходит для встреч и важных поездок",
              "Акцент на сервис и пунктуальность",
            ]}
            note="Уточняем детали заранее и фиксируем заявку."
            active={selectedClass === "business"}
            onClick={() => pickClass("business", true)}
          />

          <ClassCardButton
            title="Минивэн"
            priceHint="Когда нужно больше мест"
            features={[
              "Для семьи/компании и большого багажа",
              "Подходит для 4–7 пассажиров",
              "Удобно на межгород и в аэропорт",
            ]}
            note="Сообщите количество пассажиров и багаж — подберём вариант."
            active={selectedClass === "minivan"}
            onClick={() => pickClass("minivan", true)}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-sky-200/70 bg-white/70 p-4 shadow-sm backdrop-blur">
          <div className="text-sm font-extrabold text-zinc-900">Подсказка</div>
          <div className="mt-2 text-sm leading-6 text-zinc-700">
            Можно выбрать класс в форме или нажать на карточку — мы синхронизируем выбор автоматически.
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
        <SectionTitle title="Как работаем" desc="Три шага — и поездка организована." />
        <div className="grid gap-3 md:grid-cols-3">
          <Card title="1. Заявка" text="Заполните маршрут и контакт — это занимает минуту." />
          <Card title="2. Подтверждение" text="Уточним детали и подтвердим стоимость." />
          <Card title="3. Подача" text="Автомобиль приезжает в назначенное время." />
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-6xl px-4 pb-12">
        <SectionTitle title="Частые вопросы" desc="Короткие ответы на популярные вопросы." />
        <div className="grid gap-3 md:grid-cols-2">
          <details className="group rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur">
            <summary className="cursor-pointer list-none select-none text-sm font-extrabold text-zinc-900">
              <div className="flex items-center justify-between gap-3">
                <span>Когда вы свяжетесь после заявки?</span>
                <span className="text-zinc-500 transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </div>
            </summary>
            <div className="mt-3 text-sm leading-6 text-zinc-600">
              Обычно в течение 5–10 минут. Если срочно — лучше написать в мессенджер.
            </div>
          </details>

          <details className="group rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur">
            <summary className="cursor-pointer list-none select-none text-sm font-extrabold text-zinc-900">
              <div className="flex items-center justify-between gap-3">
                <span>Как формируется стоимость?</span>
                <span className="text-zinc-500 transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </div>
            </summary>
            <div className="mt-3 text-sm leading-6 text-zinc-600">
              Зависит от маршрута, времени и класса авто. Стоимость подтверждаем до подачи.
            </div>
          </details>

          <details className="group rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur">
            <summary className="cursor-pointer list-none select-none text-sm font-extrabold text-zinc-900">
              <div className="flex items-center justify-between gap-3">
                <span>Можно ли детское кресло?</span>
                <span className="text-zinc-500 transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </div>
            </summary>
            <div className="mt-3 text-sm leading-6 text-zinc-600">
              Да. Укажите это в комментарии к заявке — подтвердим наличие и условия.
            </div>
          </details>

          <details className="group rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur">
            <summary className="cursor-pointer list-none select-none text-sm font-extrabold text-zinc-900">
              <div className="flex items-center justify-between gap-3">
                <span>Работаете межгород?</span>
                <span className="text-zinc-500 transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </div>
            </summary>
            <div className="mt-3 text-sm leading-6 text-zinc-600">
              Да. Укажите откуда/куда и ориентировочное время — подтвердим поездку.
            </div>
          </details>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white/65 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <LogoMark />
              <Wordmark />
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white"
                href={`tel:${PHONE_TEL}`}
              >
                <IconPhone className="h-4 w-4 text-sky-700" />
                {PHONE_DISPLAY}
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white"
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
              >
                <IconWhatsapp className="h-4 w-4 text-sky-700" />
                WhatsApp
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white"
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
              >
                <IconTelegram className="h-4 w-4 text-sky-700" />
                Telegram
              </a>
            </div>
          </div>

          <div className="mt-6 text-xs text-zinc-500">© {new Date().getFullYear()} Вектор РФ. Все права защищены.</div>
        </div>
      </footer>
    </div>
  );
}
