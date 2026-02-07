"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import LeadForm, { type CarClass, type RouteType } from "@/app/lead-form";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type Breadcrumb = { name: string; href: string };
type FaqItem = { q: string; a: string };

type Props = {
  breadcrumbs: Breadcrumb[];
  title: string;
  subtitle: string;
  bullets: string[];
  faq: FaqItem[];
};

export default function ServicePage({ breadcrumbs, title, subtitle, bullets, faq }: Props) {
  const PHONE_DISPLAY = "+7 (831) 423-39-29";
  const PHONE_TEL = "+78314233929";
  const TELEGRAM = "https://t.me/vector_rf52";

  // По умолчанию межгород, т.к. страницы /route/* — это межгород
  const [selectedClass, setSelectedClass] = useState<CarClass>("standard");
  const [selectedRouteType, setSelectedRouteType] = useState<RouteType>("intercity");

  const orderRef = useRef<HTMLDivElement | null>(null);

  function scrollToOrder() {
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // На всякий случай: если это не /route/*, можно будет переопределять (но пока оставим так)
  const routeTypeLabel = useMemo(() => {
    switch (selectedRouteType) {
      case "city":
        return "Город";
      case "airport":
        return "Аэропорт";
      case "intercity":
      default:
        return "Межгород";
    }
  }, [selectedRouteType]);

  return (
    <main className="min-h-screen text-zinc-900">
      <div className="fixed inset-0 -z-20 bg-[#f3f7ff]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_50%_-10%,rgba(56,189,248,0.35),transparent_60%),radial-gradient(900px_520px_at_12%_18%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(900px_520px_at_88%_20%,rgba(99,102,241,0.14),transparent_55%)]" />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* breadcrumbs */}
        <nav className="text-sm text-zinc-600">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((b, idx) => (
              <li key={b.href} className="flex items-center gap-2">
                <Link href={b.href} className="hover:text-zinc-900 hover:underline">
                  {b.name}
                </Link>
                {idx < breadcrumbs.length - 1 ? <span className="text-zinc-400">/</span> : null}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 md:grid-cols-12">
          {/* левый блок */}
          <div className="md:col-span-7">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-700">{subtitle}</p>

            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur">
              <div className="text-sm font-extrabold text-zinc-900">Преимущества</div>
              <ul className="mt-3 grid gap-2 text-sm text-zinc-700">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                    <span className="leading-6">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
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
                  href={`tel:${PHONE_TEL}`}
                  className={cn(
                    "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold",
                    "border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
                  )}
                >
                  Позвонить: {PHONE_DISPLAY}
                </a>

                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold",
                    "border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
                  )}
                >
                  Telegram
                </a>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur">
              <div className="text-sm font-extrabold text-zinc-900">Вопросы и ответы</div>
              <div className="mt-4 grid gap-3">
                {faq.map((item) => (
                  <div key={item.q} className="rounded-xl border border-zinc-200 bg-white/80 p-4">
                    <div className="text-sm font-extrabold text-zinc-900">{item.q}</div>
                    <div className="mt-2 text-sm leading-6 text-zinc-700">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* правый блок: форма */}
          <div ref={orderRef} className="md:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-white/85 shadow-xl backdrop-blur">
              <div className="border-b border-zinc-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold text-zinc-900">Заявка на трансфер</div>
                    <div className="mt-1 text-sm text-zinc-600">
                      Тип: <span className="font-semibold">{routeTypeLabel}</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                    ~ 1 мин
                  </div>
                </div>
              </div>

              <div className="p-5">
                <LeadForm
                  carClass={selectedClass}
                  onCarClassChange={setSelectedClass}
                  routeType={selectedRouteType}
                  onRouteTypeChange={setSelectedRouteType}
                />
              </div>

              <div className="border-t border-zinc-200 bg-white/70 p-5">
                <div className="text-sm font-extrabold text-zinc-900">Связаться напрямую</div>
                <div className="mt-3 grid gap-2">
                  <a
                    className={cn(
                      "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold",
                      "border border-zinc-200 bg-white/80 shadow-sm backdrop-blur hover:bg-white"
                    )}
                    href={`tel:${PHONE_TEL}`}
                  >
                    {PHONE_DISPLAY}
                  </a>

                  <a
                    className={cn(
                      "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold",
                      "border border-zinc-200 bg-white/80 shadow-sm backdrop-blur hover:bg-white"
                    )}
                    href={TELEGRAM}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Telegram
                  </a>
                </div>

                <div className="mt-4 text-xs text-zinc-500">
                  Нажимая “Отправить заявку”, вы соглашаетесь на обработку персональных данных.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* нижняя навигация (без “driver” и прочего мусора) */}
        <div className="mt-10 border-t border-zinc-200/70 pt-6 text-sm text-zinc-600">
          <div className="font-semibold text-zinc-700">Услуги</div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/city" className="hover:text-zinc-900 hover:underline">
              Города и маршруты
            </Link>
            <Link href="/city-transfer" className="hover:text-zinc-900 hover:underline">
              Трансфер по городу
            </Link>
            <Link href="/airport-transfer" className="hover:text-zinc-900 hover:underline">
              Трансфер в аэропорт
            </Link>
            <Link href="/intercity-taxi" className="hover:text-zinc-900 hover:underline">
              Междугороднее такси
            </Link>
            <Link href="/minivan-transfer" className="hover:text-zinc-900 hover:underline">
              Минивэн / групповой
            </Link>
            <Link href="/corporate-taxi" className="hover:text-zinc-900 hover:underline">
              Корпоративное такси
            </Link>
            <Link href="/reviews" className="hover:text-zinc-900 hover:underline">
              Отзывы
            </Link>
            <Link href="/corporate" className="hover:text-zinc-900 hover:underline">
              Корпоративным
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}