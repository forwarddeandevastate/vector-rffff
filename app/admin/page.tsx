import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вектор РФ — Админ",
  robots: { index: false, follow: false },
};

export default async function AdminIndexPage() {
  const name = process.env.ADMIN_COOKIE_NAME || "admin_token";
  const cookieStore = await cookies();
  const token = cookieStore.get(name)?.value;
  if (!token) redirect("/admin/login");
  redirect("/admin/dashboard");
}
