import { redirect } from "next/navigation";

// Старый URL /route/{from} -> /{from}
export default async function Page({ params }: { params: Promise<{ from: string }> }) {
  const resolvedParams = await params;
  const from = encodeURIComponent((resolvedParams.from ?? "").trim());
  redirect(`/${from}`);
}
