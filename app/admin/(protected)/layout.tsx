import type { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const name = process.env.ADMIN_COOKIE_NAME || "admin_token";
  const cookieStore = await cookies();
  const token = cookieStore.get(name)?.value;

  if (!token) redirect("/admin/login");

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
          borderBottom: "1px solid #eee",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ fontWeight: 900 }}>Админ-панель</div>

          <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/admin/leads">Лиды</Link>
            <Link href="/admin/users">Пользователи</Link>
            <Link href="/admin/settings">Настройки сайта</Link>
          </nav>

          <LogoutButton />
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>{children}</main>
    </div>
  );
}
