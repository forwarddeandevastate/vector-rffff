import { redirect } from "next/navigation";
import DashboardClient from "./ui";
import { requireAdmin } from "@/lib/admin-api";

export default async function DashboardPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login?reason=expired");
  return <DashboardClient />;
}
