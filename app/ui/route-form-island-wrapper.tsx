"use client";

import { useEffect, useState } from "react";
import RouteFormIsland from "./route-form-island";

export default function RouteFormIslandWrapper({
  fromName,
  toName,
}: {
  fromName: string;
  toName: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 bg-white/0">
      <RouteFormIsland fromName={fromName} toName={toName} />
    </div>
  );
}
