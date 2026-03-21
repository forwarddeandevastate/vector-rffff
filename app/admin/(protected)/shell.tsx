"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./logout-button";
import ThemeToggle from "./theme-toggle";
import { cn } from "./ui-kit";

type NavItem = { href: string; label: string; icon: string };

const NAV_ITEMS: NavItem[] = [
  { href: "/admin/dashboard", label: "Дашборд", icon: "📊" },
  { href: "/admin/leads",     label: "Лиды",     icon: "📥" },
  { href: "/admin/reviews",   label: "Отзывы",   icon: "⭐" },
  { href: "/admin/users",     label: "Команда",  icon: "👥" },
  { href: "/admin/audit",     label: "Аудит",    icon: "🔍" },
  { href: "/admin/settings",  label: "Настройки",icon: "⚙️" },
];

function NavLink({ href, label, icon, onClick }: NavItem & { onClick?: () => void }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href + "/"))
    || (href === "/admin/leads" && pathname.startsWith("/admin/leads"));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
        active
          ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-black"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      )}
    >
      <span aria-hidden className="text-base">{icon}</span>
      {label}
    </Link>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex shrink-0 items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-black">
              <span className="text-sm font-black">V</span>
            </div>
            <div className="hidden leading-tight sm:block">
              <div className="text-sm font-extrabold tracking-tight">Вектор РФ</div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Админ-панель</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center gap-1 px-2 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
            {/* Мобильное меню */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Меню"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white p-2 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 md:hidden"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
            <nav className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.href} {...item} onClick={() => setMobileOpen(false)} />
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ── Content ─────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
