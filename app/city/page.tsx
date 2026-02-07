import type { Metadata } from "next";
import CityPageClient from "./CityPageClient";

export const metadata: Metadata = {
  title: "Трансферы по городу | Вектор РФ",
  description:
    "Трансферы по городу: подача по времени, стоимость заранее, комфорт/бизнес/минивэн. Онлайн-заявка 24/7.",
  alternates: { canonical: "/city" },
};

export default function CityPage() {
  return <CityPageClient />;
}