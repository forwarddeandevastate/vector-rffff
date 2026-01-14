"use client";

import { useEffect, useState } from "react";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("admin_theme");
    const isDark = saved ? saved === "dark" : document.documentElement.classList.contains("dark");
    setDark(isDark);

    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  if (!mounted) return null;

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("admin_theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition",
        "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
      )}
      title="Переключить тему"
    >
      <span aria-hidden>{dark ? "🌙" : "☀️"}</span>
      <span className="hidden sm:inline">{dark ? "Тёмная" : "Светлая"}</span>
    </button>
  );
}
