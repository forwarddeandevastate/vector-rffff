"use client";

import { useRef, useState } from "react";
import LeadForm, { type CarClass, type RouteType } from "./lead-form";

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
      <div className="text-xs text-zinc-600">
        Трансферы и поездки по России
      </div>
    </div>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M9.5 3.75h5A2.75 2.75 0 0 1 17.25 6.5v11A2.75 2.75 0 0 1 14.5 20.25h-5A2.75 2.75 0 0 1 6.75 17.5v-11A2.75 2.75 0 0 1 9.5 3.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M10 17.25h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconWhatsapp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21a9 9 0 0 1-4.07-.97L3.75 21l1.06-3.98A9 9 0 1 1 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconTelegram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M20.75 5.6 3.9 12.2c-.8.3-.79 1.44.02 1.72l4.2 1.45 1.6 4.93c.26.8 1.27.95 1.74.27l2.4-3.5 4.1 3.01c.63.46 1.51.12 1.7-.66l2.2-13.96c.13-.83-.7-1.46-1.41-1.18Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function HomePage() {
  const PHONE_DISPLAY = "+7 (999) 123-45-67";
  const PHONE_TEL = "+79991234567";
  const WHATSAPP = "https://wa.me/79991234567";
  const TELEGRAM = "https://t.me/";

  const [selectedClass, setSelectedClass] =
    useState<CarClass>("standard");
  const [selectedRouteType, setSelectedRouteType] =
    useState<RouteType>("city");

  const orderRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900">
      <header className="sticky top-0 z-20 bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark />
            <Wordmark />
          </div>

          <div className="flex gap-2">
            <a
              href={`tel:${PHONE_TEL}`}
              className="text-sm font-semibold"
            >
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight">
            Трансфер, которому{" "}
            <span className="text-blue-600">доверяют</span>
          </h1>

          <p className="mt-4 text-zinc-600 max-w-md">
            Город, межгород, аэропорты. Оставьте заявку — мы
            свяжемся с вами и подтвердим стоимость.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setSelectedRouteType("city")}
              className="px-4 py-2 rounded-xl bg-white border"
            >
              Город
            </button>
            <button
              onClick={() => setSelectedRouteType("intercity")}
              className="px-4 py-2 rounded-xl bg-white border"
            >
              Межгород
            </button>
            <button
              onClick={() => setSelectedRouteType("airport")}
              className="px-4 py-2 rounded-xl bg-white border"
            >
              Аэропорт
            </button>
          </div>
        </div>

        <div ref={orderRef} id="order">
          <div className="rounded-3xl bg-white border shadow p-5">
            <h2 className="font-bold text-lg mb-2">
              Заявка на трансфер
            </h2>

            <LeadForm
              carClass={selectedClass}
              onCarClassChange={setSelectedClass}
              routeType={selectedRouteType}
              onRouteTypeChange={setSelectedRouteType}
            />

            <div className="mt-4 text-xs text-zinc-500">
              Нажимая «Отправить», вы соглашаетесь на обработку
              персональных данных
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} Вектор РФ
        </div>
      </footer>
    </div>
  );
}
