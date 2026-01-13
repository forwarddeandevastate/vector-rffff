import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminJwt } from "@/lib/auth";
import AdminShell from "./shell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const name = process.env.ADMIN_COOKIE_NAME || "admin_token";

  const cookieStore = await cookies();          // ✅ важно
  const token = cookieStore.get(name)?.value;

  if (!token) redirect("/admin/login");

  try {
    await verifyAdminJwt(token);
  } catch {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
