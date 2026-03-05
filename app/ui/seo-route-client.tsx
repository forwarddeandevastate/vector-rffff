"use client";

import { useState } from "react";
import Link from "next/link";
import LeadForm, { type CarClass, type RouteType } from "../lead-form";
import type { FAQItem } from "@/lib/city-faq";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function SmallBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1.5",
        "text-xs font-semibold text-zinc-800 shadow-sm"
      )}
    >
      {children}
    </span>
  );
}

export default function SeoRouteClient(props: {
  fromSlug: string;
  toSlug: string;
  fromName: string;
  toName: string;
  cityBackHref: string;
  cityBackLabel: string;
  content: string;
  faq: FAQItem[];
  moreFromCity: Array<{ toSlug: string; toName: string }>;
}) {
  const [carClass, setCarClass] = useState<CarClass>("standard");
  const [routeType, setRouteType] = useState<RouteType>("intercity");

  return (
    <div className="min-h-screen text-zinc-900">
      <div className="fixed inset-0 -z-20 bg-[#f3f7ff]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_50%_-10%,rgba(56,189,248,0.35),transparent_60%),radial-gradient(900px_520px_at_12%_18%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(900px_520px_at_88%_20%,rgba(99,102,241,0.14),transparent_55%)]" />
      <div className="fixed inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white/70 to-transparent" />

      <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/65 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="text-sm font-extrabold text-zinc-900 hover:opacity-90">
            Вектор РФ
          </Link>
          <Link
            href={props.cityBackHref}
            className="text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            {props.cityBackLabel}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
              Такси {props.fromName} — {props.toName}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Прямая поездка без пересадок. Стоимость согласуем заранее. Работаем 24/7.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <SmallBadge>Подтверждение цены до поездки</SmallBadge>
              <SmallBadge>Комфорт / бизнес / минивэн</SmallBadge>
              <SmallBadge>Заявка онлайн</SmallBadge>
            </div>

            <div className="mt-8 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="text-sm font-extrabold text-zinc-900">Описание маршрута</div>
              <p className="mt-3 text-sm leading-6 text-zinc-700">{props.content}</p>
            </div>

            <div className="mt-8 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="text-sm font-extrabold text-zinc-900">Ещё маршруты из {props.fromName}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {props.moreFromCity.map((p) => (
                  <Link
                    key={p.toSlug}
                    href={`/${props.fromSlug}/${p.toSlug}`}
                    className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm hover:bg-zinc-50"
                  >
                    {props.fromName} — {p.toName}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="text-sm font-extrabold text-zinc-900">FAQ</div>
              <div className="mt-4 space-y-4">
                {props.faq.map((f, idx) => (
                  <div key={idx} className="rounded-2xl border border-zinc-200 bg-white/70 p-4">
                    <div className="text-sm font-semibold text-zinc-900">{f.question}</div>
                    <div className="mt-2 text-sm leading-6 text-zinc-600">{f.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-white/85 shadow-xl backdrop-blur">
              <div className="border-b border-zinc-200 p-5">
                <div className="text-sm font-extrabold text-zinc-900">Заявка на маршрут</div>
                <div className="mt-1 text-sm text-zinc-600">
                  Укажите контакты — подтвердим стоимость и подачу авто.
                </div>
              </div>

              <div className="p-5">
                <LeadForm
                  carClass={carClass}
                  onCarClassChange={setCarClass}
                  routeType={routeType}
                  onRouteTypeChange={setRouteType}
                  initialFrom={props.fromName}
                  initialTo={props.toName}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
