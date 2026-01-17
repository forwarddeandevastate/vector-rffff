"use client";

import { useRef, useState } from "react";
import LeadForm, { type CarClass, type RouteType } from "./lead-form";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white font-black">
        В
      </div>
      <div className="leading-tight">
        <div className="text-lg font-extrabold text-slate-900">Вектор РФ</div>
        <div className="text-xs text-slate-600">Трансферы по России</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const PHONE_DISPLAY = "+7 (999) 123-45-67";
  const PHONE_TEL = "+79991234567";

  const [carClass, setCarClass] = useState<CarClass>("standard");
  const [routeType, setRouteType] = useState<RouteType>("city");

  const orderRef = useRef<HTMLDivElement | null>(null);

  function scrollToOrder() {
    orderRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <a
            href={`tel:${PHONE_TEL}`}
            className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-100"
          >
            {PHONE_DISPLAY}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight">
            Надёжные трансферы <br /> по России
          </h1>
          <p className="mt-4 text-slate-600">
            Город • Межгород • Аэропорты  
            <br />
            Стоимость подтверждаем заранее
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={scrollToOrder}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white font-bold hover:bg-blue-700"
            >
              Оставить заявку
            </button>
            <a
              href={`tel:${PHONE_TEL}`}
              className="rounded-xl border px-6 py-3 font-semibold"
            >
              Позвонить
            </a>
          </div>
        </div>

        {/* FORM */}
        <div ref={orderRef} className="rounded-2xl border bg-white p-6 shadow">
          <h2 className="text-lg font-extrabold mb-2">Заявка на трансфер</h2>
          <p className="text-sm text-slate-600 mb-4">
            Заполните форму — мы свяжемся с вами
          </p>

          <LeadForm
            carClass={carClass}
            onCarClassChange={setCarClass}
            routeType={routeType}
            onRouteTypeChange={setRouteType}
          />
        </div>
      </section>

      {/* CLASSES */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-2xl font-extrabold mb-6">Классы авто</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["standard", "Стандарт"],
            ["comfort", "Комфорт"],
            ["business", "Бизнес"],
            ["minivan", "Минивэн"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setCarClass(key as CarClass);
                scrollToOrder();
              }}
              className={cn(
                "rounded-xl border p-4 text-left hover:border-blue-500",
                carClass === key && "border-blue-600 bg-blue-50"
              )}
            >
              <div className="font-bold">{label}</div>
              <div className="text-sm text-slate-600 mt-1">
                Выбрать
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Вектор РФ
        </div>
      </footer>
    </div>
  );
}
