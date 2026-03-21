"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { CarClass, RouteType } from "./lead-form";
import { cn } from "@/lib/cn";
import {
  GlassPanel, IconPhone, IconTelegram,
  PHONE_TEL, TELEGRAM,
} from "@/app/ui/shared";

const LeadForm = dynamic(() => import("./lead-form"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse rounded-2xl bg-blue-50/60" />,
});

function RouteTypeBtn({ title, desc, active, onClick }: {
  title: string; desc: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-2xl border p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
        active
          ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-200/60"
          : "border-blue-100/60 bg-white/70 backdrop-blur-sm hover:border-blue-300 hover:bg-white/90"
      )}
    >
      <div className={cn("text-sm font-bold", active ? "text-white" : "text-slate-800")}>{title}</div>
      <div className={cn("mt-1 text-xs leading-5", active ? "text-blue-100" : "text-slate-500")}>{desc}</div>
    </button>
  );
}

export default function HomePageInteractive() {
  const [carClass, setCarClass] = useState<CarClass>("standard");
  const [routeType, setRouteType] = useState<RouteType>("intercity");
  const formRef = useRef<HTMLDivElement | null>(null);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:gap-10 lg:items-start">
      {/* ── ЛЕВАЯ КОЛОНКА: выбор типа + CTA ──────────────────── */}
      <div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <RouteTypeBtn title="Межгород" desc="Между городами"
            active={routeType === "intercity"} onClick={() => { setRouteType("intercity"); scrollToForm(); }} />
          <RouteTypeBtn title="Аэропорт" desc="Под время рейса"
            active={routeType === "airport"} onClick={() => { setRouteType("airport"); scrollToForm(); }} />
          <RouteTypeBtn title="Город" desc="По городу"
            active={routeType === "city"} onClick={() => { setRouteType("city"); scrollToForm(); }} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={scrollToForm}
            className="btn-primary inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold"
          >
            Оставить заявку
          </button>
          <a
            href={`tel:${PHONE_TEL}`}
            className="btn-ghost inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold"
          >
            8 800 222-56-50
          </a>
        </div>
      </div>

      {/* ── ПРАВАЯ КОЛОНКА: форма ─────────────────────────────── */}
      <div ref={formRef} id="order" className="scroll-mt-24">
        <GlassPanel className="overflow-hidden">
          <div className="border-b border-blue-100/60 p-4">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white/80 px-3 py-2.5 text-sm font-semibold text-blue-800 hover:bg-blue-50 transition-colors"
              >
                <IconPhone className="h-4 w-4 text-blue-500" />Позвонить
              </a>
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm"
              >
                <IconTelegram className="h-4 w-4" />Telegram
              </a>
            </div>
            <p className="mt-3 text-sm font-bold text-slate-800">Заполнить заявку</p>
          </div>
          <div className="p-3">
            <LeadForm
              carClass={carClass}
              onCarClassChange={setCarClass}
              routeType={routeType}
              onRouteTypeChange={setRouteType}
            />
          </div>
          <div className="border-t border-blue-100/50 bg-blue-50/40 px-4 py-3">
            <p className="text-[11px] text-slate-400">
              Нажимая «Отправить», вы соглашаетесь на{" "}
              <a href="/personal-data" className="underline underline-offset-2 hover:text-slate-600">
                обработку персональных данных
              </a>.
            </p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
