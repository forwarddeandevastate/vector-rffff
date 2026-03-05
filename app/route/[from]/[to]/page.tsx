import { redirect } from "next/navigation";

// Старые URL вида /route/{from}/{to} перенаправляем на новый формат /{from}/{to}
export default function Page({ params }: { params: { from: string; to: string } }) {
  const from = encodeURIComponent((params.from ?? "").trim());
  const to = encodeURIComponent((params.to ?? "").trim());
  redirect(`/${from}/${to}`);
}
