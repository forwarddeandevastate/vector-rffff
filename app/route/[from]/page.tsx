import { redirect } from "next/navigation";

// Старый URL /route/{from} -> /{from}
export default function Page({ params }: { params: { from: string } }) {
  const from = encodeURIComponent((params.from ?? "").trim());
  redirect(`/${from}`);
}
