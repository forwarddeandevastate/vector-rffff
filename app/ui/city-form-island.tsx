"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { CarClass, RouteType } from "@/app/lead-form";

const LeadForm = dynamic(() => import("@/app/lead-form"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse rounded-2xl bg-blue-50/60" />,
});

export default function CityFormIsland({
  cityName,
  initialFrom,
}: {
  cityName: string;
  initialFrom: string;
}) {
  const [carClass, setCarClass] = useState<CarClass>("standard");
  const [routeType, setRouteType] = useState<RouteType>("intercity");
  const from = useMemo(() => initialFrom, [initialFrom]);

  return (
    <LeadForm
      carClass={carClass}
      onCarClassChange={setCarClass}
      routeType={routeType}
      onRouteTypeChange={setRouteType}
      initialFrom={from}
    />
  );
}
