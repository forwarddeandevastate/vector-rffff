import type { Metadata } from "next";
import CityPageClient from "./CityPageClient";

export const metadata: Metadata = {
  title: "Трансферы по городу — Вектор РФ",
  description:
    "Трансферы и поездки по городу: стандарт, комфорт, бизнес, минивэн. Стоимость согласуем заранее. Заявка онлайн 24/7.",
  alternates: { canonical: "https://vector-rf.ru/city" },
  openGraph: {
    title: "Трансферы по городу — Вектор РФ",
    description:
      "Поездки по городу: стандарт, комфорт, бизнес, минивэн. Стоимость заранее. Заявка онлайн 24/7.",
    url: "https://vector-rf.ru/city",
    type: "website",
  },
};

export default function Page() {
  return <CityPageClient />;
}