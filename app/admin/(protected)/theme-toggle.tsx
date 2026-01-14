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
        "inline-flex items-center gap-3 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition",
        "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
      )}
      title="Переключить тему"
    >
      <span className="text-zinc-700 dark:text-zinc-200">
        Тема: <span className="font-extrabold">{dark ? "Тёмная" : "Светлая"}</span>
      </span>

      <span
        className={cn(
          "relative h-5 w-9 rounded-full border transition",
          dark ? "border-zinc-700 bg-zinc-900 dark:bg-white" : "border-zinc-300 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40"
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full transition",
            dark ? "left-4 bg-zinc-900 dark:bg-black" : "left-0.5 bg-white dark:bg-zinc-200"
          )}
        />
      </span>
    </button>
  );
}
