import type { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminNav from "./nav";

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const name = process.env.ADMIN_COOKIE_NAME || "admin_token";
  const cookieStore = await cookies();
  const token = cookieStore.get(name)?.value;

  if (!token) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* top bar */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin/leads" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-black">
              ⚡
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight">Вектор РФ</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Админ-панель</div>
            </div>
          </Link>

          <AdminNav />
        </div>
      </header>

      {/* page */}
      <main className="mx-auto max-w-6xl px-4 py-5">{children}</main>

      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-500 dark:text-zinc-500">
        © {new Date().getFullYear()} Вектор РФ
      </footer>
    </div>
  );
}
