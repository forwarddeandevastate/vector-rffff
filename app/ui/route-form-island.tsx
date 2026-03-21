"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { CarClass, RouteType } from "@/app/lead-form";

const LeadForm = dynamic(() => import("@/app/lead-form"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse rounded-2xl bg-blue-50/60" />,
});

export default function RouteFormIsland({
  fromName,
  toName,
}: {
  fromName: string;
  toName: string;
}) {
  const [carClass, setCarClass] = useState<CarClass>("standard");
  const [routeType, setRouteType] = useState<RouteType>("intercity");

  return (
    <LeadForm
      carClass={carClass}
      onCarClassChange={setCarClass}
      routeType={routeType}
      onRouteTypeChange={setRouteType}
      initialFrom={fromName}
      initialTo={toName}
    />
  );
}
