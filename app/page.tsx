import { Suspense } from "react";
import LeadForm from "./lead-form";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

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

function IconCall({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.9 5.2 7.7 4c-.5-.5-1.4-.5-1.9 0l-1 1c-.7.7-1 1.7-.8 2.7 1.1 4.9 4.9 8.7 9.8 9.8 1 .2 2-.1 2.7-.8l1-1c.5-.5.5-1.4 0-1.9l-1.2-1.2c-.5-.5-1.2-.6-1.8-.3l-1.3.7c-.5.3-1.1.2-1.5-.2l-2.2-2.2c-.4-.4-.5-1-.2-1.5l.7-1.3c.3-.6.2-1.3-.3-1.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
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

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
      {children}
    </span>
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

function ClassLinkCard({
  href,
  title,
  priceHint,
  features,
  note,
}: {
  href: string;
  title: string;
  priceHint: string;
  features: string[];
  note?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "block rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur transition",
        "hover:border-sky-200/70 hover:bg-white/95",
        "focus:outline-none focus:ring-2 focus:ring-sky-200/80"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-zinc-900">{title}</div>
          <div className="mt-1 text-xs text-zinc-600">{priceHint}</div>
        </div>

        <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-50 ring-1 ring-sky-100">
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
    </a>
  );
}

export default function HomePage() {
  const PHONE_DISPLAY = "+7 (831) 423-39-29";
  const PHONE_TEL = "+78314233929";
  const TELEGRAM = "https://t.me/vector_rf52";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Сколько стоит межгород?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Стоимость зависит от маршрута и класса авто. Заполните заявку — быстро рассчитаем и подтвердим цену.",
        },
      },
      {
        "@type": "Question",
        name: "Можно ли заказать межгород туда-обратно?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да, выберите «Туда-обратно» в форме — согласуем детали обратной поездки.",
        },
      },
      {
        "@type": "Question",
        name: "Работаете с компаниями?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да. Корпоративные перевозки, договор, безнал и закрывающие документы.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen text-zinc-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
            <NavPill href="/reviews">Отзывы</NavPill>
            <NavPill href="#how">Как работаем</NavPill>
            <NavPill href="/faq">Вопросы</NavPill>
            <NavPill href="/contacts">Контакты</NavPill>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${PHONE_TEL}`}
              className={cn(
                "inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-semibold",
                "border border-zinc-200 bg-white/70 shadow-sm backdrop-blur hover:bg-white"
              )}
              title="Позвонить"
              aria-label="Позвонить"
            >
              <IconCall className="h-4 w-4 text-sky-700" />
              <span className="hidden md:inline text-zinc-800">{PHONE_DISPLAY}</span>
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
              Трансфер, которому{" "}
              <span className="bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                доверяют
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-700">
              Межгород по России, город и аэропорты. Подберём авто под задачу и подтвердим цену до поездки.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#order"
                className={cn(
                  "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-extrabold",
                  "bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 text-white shadow-md",
                  "hover:opacity-95"
                )}
              >
                Оставить заявку
              </a>

              <a
                href={`tel:${PHONE_TEL}`}
                className={cn(
                  "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-extrabold",
                  "border border-zinc-200 bg-white/80 shadow-sm backdrop-blur hover:bg-white"
                )}
              >
                Позвонить
              </a>
            </div>
          </div>

          <div id="order" className="md:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur">
              <div className="text-sm font-extrabold text-zinc-900">Заявка на поездку</div>
              <div className="mt-1 text-xs text-zinc-600">
                По умолчанию выбран межгород. Класс и тип поездки можно поменять в форме.
              </div>

              <div className="mt-4">
                <Suspense fallback={<div className="text-sm text-zinc-600">Загружаем форму…</div>}>
                  <LeadForm defaultRouteType="intercity" defaultCarClass="standard" />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="classes" className="mx-auto max-w-6xl px-4 pb-4 pt-2">
        <SectionTitle title="Классы авто" desc="Нажмите на класс — форма откроется с выбранным вариантом." />

        <div className="grid gap-4 md:grid-cols-2">
          <ClassLinkCard
            href="/?class=standard#order"
            title="Стандарт"
            priceHint="Оптимально по цене"
            features={["Комфортная подача", "Подходит для города и межгорода", "Багаж"]}
          />
          <ClassLinkCard
            href="/?class=comfort#order"
            title="Комфорт"
            priceHint="Больше места и тише салон"
            features={["Улучшенный комфорт", "Кондиционер", "Подходит для длительных поездок"]}
          />
          <ClassLinkCard
            href="/?class=business#order"
            title="Бизнес"
            priceHint="Для встреч и важных поездок"
            features={["Водители с опытом", "Строгий внешний вид", "Максимальный комфорт"]}
          />
          <ClassLinkCard
            href="/?class=minivan#order"
            title="Минивэн"
            priceHint="Для семьи и группы"
            features={["Больше пассажиров", "Удобно с багажом", "Трансферы в аэропорт"]}
            note="Нужно больше мест? Укажите в комментарии — подберём вариант."
          />
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-10">
        <SectionTitle title="Как работаем" desc="Быстро, прозрачно и без сюрпризов." />
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="1) Оставляете заявку" text="Укажите маршрут, дату и класс. Мы уточним детали." />
          <Card title="2) Подтверждаем стоимость" text="Согласуем цену и время подачи до поездки." />
          <Card title="3) Поездка" text="Водитель приезжает вовремя. Едете комфортно и безопасно." />
        </div>
      </section>
    </div>
  );
}