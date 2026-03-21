"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { GlassPanel, IconPhone, IconTelegram, PHONE_TEL, TELEGRAM } from "@/app/ui/shared";
import type { CarClass, RouteType } from "@/app/lead-form";

const LeadForm = dynamic(() => import("@/app/lead-form"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse rounded-2xl bg-blue-50/60" />,
});

export default function ServiceFormClient({ routeType: initialRouteType }: {
  routeType: "city" | "airport" | "intercity";
}) {
  const [carClass, setCarClass] = useState<CarClass>("standard");
  const [routeType, setRouteType] = useState<RouteType>(
    initialRouteType === "intercity" ? "intercity"
    : initialRouteType === "airport" ? "airport"
    : "city"
  );

  return (
    <GlassPanel className="overflow-hidden">
      <div className="border-b border-blue-100/60 p-4">
        <div className="grid grid-cols-2 gap-2">
          <a href={`tel:${PHONE_TEL}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white/80 px-3 py-2.5 text-sm font-semibold text-blue-800 hover:bg-blue-50 transition-colors">
            <IconPhone className="h-4 w-4 text-blue-500" />Позвонить
          </a>
          <a href={TELEGRAM} target="_blank" rel="noreferrer"
            className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm">
            <IconTelegram className="h-4 w-4" />Telegram
          </a>
        </div>
        <div className="mt-3 text-sm font-bold text-slate-800">Заполнить заявку</div>
      </div>
      <div className="p-3">
        <LeadForm
          carClass={carClass}
          onCarClassChange={setCarClass}
          routeType={routeType}
          onRouteTypeChange={setRouteType}
        />
      </div>
    </GlassPanel>
  );
}
