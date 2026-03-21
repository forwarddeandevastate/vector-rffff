"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { CarClass, RouteType } from "./lead-form";
import { cn } from "@/lib/cn";
import {
  GlassPanel, IconPhone, IconTelegram,
  PHONE_TEL, PHONE_DISPLAY, TELEGRAM,
} from "@/app/ui/shared";

// LeadForm грузим лениво — только после mount, не блокирует LCP
const LeadForm = dynamic(() => import("./lead-form"), {
  ssr: false,
  loading: () => <div className="h-52 animate-pulse rounded-2xl bg-blue-50/60" />,
});

function RouteTypeBtn({
  title, desc, active, onClick,
}: {
  title: string; desc: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-xl border p-2.5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
        active
          ? "border-blue-500 bg-blue-600 text-white"
          : "border-blue-100/60 bg-white/70 backdrop-blur-sm hover:border-blue-300 hover:bg-white/90"
      )}
    >
      <div className={cn("text-xs font-bold", active ? "text-white" : "text-slate-800")}>{title}</div>
      <div className={cn("mt-0.5 text-[10px] leading-4", active ? "text-blue-100" : "text-slate-500")}>{desc}</div>
    </button>
  );
}

export default function HomePageInteractive() {
  const [mounted, setMounted] = useState(false);
  const [carClass, setCarClass] = useState<CarClass>("standard");
  const [routeType, setRouteType] = useState<RouteType>("intercity");
  const formRef = useRef<HTMLDivElement>(null);

  // Монтируемся только на клиенте
  useEffect(() => {
    setMounted(true);
  }, []);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // До гидрации — невидимы (статичная форма видна через SSR)
  // После гидрации — показываемся и перекрываем статичную форму
  if (!mounted) return null;

  return (
    // Абсолютное позиционирование поверх статичной формы
    <div className="absolute inset-0 z-10">
      <div id="order" className="scroll-mt-24">
        <GlassPanel className="overflow-hidden">
          {/* Шапка: кнопки связи */}
          <div className="border-b border-blue-100/60 p-4">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white/80 px-3 py-2.5 text-sm font-semibold text-blue-800 hover:bg-blue-50 transition-colors"
              >
                <IconPhone className="h-4 w-4 text-blue-500" aria-hidden />
                {PHONE_DISPLAY}
              </a>
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm"
              >
                <IconTelegram className="h-4 w-4" aria-hidden />
                Telegram
              </a>
            </div>
            <p className="mt-3 text-sm font-bold text-slate-800">Оставить заявку</p>
          </div>

          {/* Выбор типа маршрута */}
          <div className="px-4 pt-4">
            <div className="grid grid-cols-3 gap-2">
              <RouteTypeBtn title="Межгород" desc="Между городами"
                active={routeType === "intercity"}
                onClick={() => { setRouteType("intercity"); scrollToForm(); }} />
              <RouteTypeBtn title="Аэропорт" desc="Под рейс"
                active={routeType === "airport"}
                onClick={() => { setRouteType("airport"); scrollToForm(); }} />
              <RouteTypeBtn title="По городу" desc="Поездки"
                active={routeType === "city"}
                onClick={() => { setRouteType("city"); scrollToForm(); }} />
            </div>
          </div>

          {/* Форма */}
          <div className="p-4">
            <LeadForm
              carClass={carClass}
              onCarClassChange={setCarClass}
              routeType={routeType}
              onRouteTypeChange={setRouteType}
            />
          </div>

          {/* Дисклеймер */}
          <div className="border-t border-blue-100/50 bg-blue-50/40 px-4 py-3">
            <p className="text-[10px] text-slate-400 text-center">
              Стоимость подтверждаем до выезда · Работаем 24/7
              {" · "}
              <a href="/personal-data" className="underline underline-offset-2 hover:text-slate-600">
                Конфиденциальность
              </a>
            </p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
