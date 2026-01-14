"use client";

import { useState } from "react";
import CorporateSection from "@/app/components/CorporateSection";
import LeadForm, { CarClass, RouteType } from "@/app/lead-form";

export default function HomePage() {
  const [carClass, setCarClass] = useState<CarClass>("standard");
  const [routeType, setRouteType] = useState<RouteType>("city");

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="flex flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-900">
              Вектор РФ • трансферы и поездки
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
              Трансферы по России — город, межгород, аэропорты
            </h1>

            <p className="max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
              Подача машины по времени, фиксируем условия заранее. Для межгорода — автоматический расчёт стоимости по маршруту.
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href="#lead"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/85 px-4 text-sm font-semibold text-zinc-800 hover:bg-white"
              >
                Частным клиентам
              </a>

              <a
                href="#corporate"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-4 text-sm font-semibold text-sky-900 hover:opacity-95"
              >
                Юрлицам
              </a>
            </div>
          </div>
        </header>

        <CorporateSection />

        <section id="lead" className="mt-10">
          <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-10">
            <div className="mb-4">
              <div className="text-xs font-semibold text-zinc-700">Заявка</div>
              <div className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900">
                Оставьте заявку — мы подтвердим поездку
              </div>
              <div className="mt-2 text-sm text-zinc-600">
                Укажите маршрут и контакты. Для межгорода цена считается автоматически.
              </div>
            </div>

            <LeadForm
              carClass={carClass}
              onCarClassChange={setCarClass}
              routeType={routeType}
              onRouteTypeChange={setRouteType}
            />
          </div>
        </section>

        <footer className="mt-10 text-center text-[11px] text-zinc-500">
          © {new Date().getFullYear()} Вектор РФ
        </footer>
      </main>
    </div>
  );
}
