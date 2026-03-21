"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "./ui-kit";

const ITEMS = [
  { href: "/admin/dashboard", label: "Дашборд",  icon: "📊" },
  { href: "/admin/leads",     label: "Лиды",     icon: "📥" },
  { href: "/admin/reviews",   label: "Отзывы",   icon: "⭐" },
  { href: "/admin/users",     label: "Команда",  icon: "👥" },
  { href: "/admin/audit",     label: "Аудит",    icon: "🔍" },
  { href: "/admin/settings",  label: "Настройки",icon: "⚙️" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {ITEMS.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link key={href} href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
              active
                ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            )}>
            <span aria-hidden>{icon}</span>{label}
          </Link>
        );
      })}
    </nav>
  );
}
