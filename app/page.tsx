"use client";

import { useRef, useState } from "react";
import LeadForm, { type CarClass, type RouteType } from "./lead-form";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function LogoMark() {
  return (
    <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white shadow-sm ring-1 ring-white/20">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4.5 6.5l7.5 13 7.5-13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.7 6.5h10.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Wordmark() {
  return (
    <div className="leading-tight">
      <div className="text-[15px] font-black tracking-tight bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
        Вектор РФ
      </div>
      <div className="text-xs text-zinc-600">Трансферы и поездки по России</div>
    </div>
  );
}

export default function HomePage() {
  const PHONE_DISPLAY = "+7 (999) 123-45-67";
  const PHONE_TEL = "+79991234567";
  const WHATSAPP = "https://wa.me/79991234567";
  const TELEGRAM = "https://t.me/";

  const [selectedClass, setSelectedClass] = useState<CarClass>("standard");
  const [selectedRouteType, setSelectedRouteType] = useState<RouteType>("city");

  const orderRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen text-zinc-900 bg-[#f3f7ff]">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <LogoMark />
            <Wordmark />
          </div>

          <a
            href={`tel:${PHONE_TEL}`}
            className="rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-extrabold text-white shadow"
          >
            Позвонить
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-12">
        <section className="md:col-span-7">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Надёжный трансфер
            <span className="block bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
              по России
            </span>
          </h1>

          <p className="mt-4 text-zinc-700 max-w-xl">
            Город, межгород, аэропорты. Фиксируем цену заранее и сопровождаем поездку до конца.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => orderRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-6 py-4 text-sm font-extrabold text-white shadow"
            >
              Рассчитать стоимость трансфера
            </button>

            <div className="text-xs text-zinc-600 sm:self-center">
              Ответ за 5 минут • Цена фиксируется
            </div>
          </div>
        </section>

        <section ref={orderRef} className="md:col-span-5">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl">
            <div className="mb-4">
              <div className="text-sm font-extrabold">Заявка на трансфер</div>
              <div className="text-xs text-zinc-600">Заполнение ~1 минута</div>
            </div>

            <LeadForm
              carClass={selectedClass}
              onCarClassChange={setSelectedClass}
              routeType={selectedRouteType}
              onRouteTypeChange={setSelectedRouteType}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white/80">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} Вектор РФ
        </div>
      </footer>
    </div>
  );
}
