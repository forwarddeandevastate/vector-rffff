import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "/taxi-mezhgorod" },
};

export default function Page() {
  permanentRedirect("/taxi-mezhgorod");
}
