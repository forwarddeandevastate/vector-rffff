import type { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-api";
import { ToastProvider } from "./toast";
import AdminShell from "./shell";

export const metadata: Metadata = {
  title: { default: "Вектор РФ — Админ", template: "%s · Вектор РФ Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login?reason=expired");

  return (
    <ToastProvider>
      <AdminShell>{children}</AdminShell>
    </ToastProvider>
  );
}
