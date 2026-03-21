"use client";

import { useEffect, useState } from "react";
import CityFormIsland from "./city-form-island";

/**
 * CityFormIslandWrapper — client component.
 * До гидрации: invisible (статика видна через SSR).
 * После гидрации: показывается поверх статичных полей.
 */
export default function CityFormIslandWrapper({
  cityName,
  initialFrom,
}: {
  cityName: string;
  initialFrom: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 bg-white/0">
      <CityFormIsland cityName={cityName} initialFrom={initialFrom} />
    </div>
  );
}
