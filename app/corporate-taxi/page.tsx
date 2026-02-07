import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://vector-rf.ru";

export const metadata: Metadata = {
  title: "Корпоративное такси",
  description:
    "Корпоративные перевозки и трансферы для компаний: договор, безнал, отчётность. Регулярные поездки для сотрудников и гостей.",
  alternates: { canonical: `${SITE_URL}/corporate-taxi` },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight">Корпоративное такси</h1>
        <p className="mt-4 text-slate-700">
          Страница создана для запросов “корпоративное такси”. Основная информация у нас на странице для корпоративных клиентов.
        </p>

        <div className="mt-6 flex gap-2">
          <Link
            href="/corporate"
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white hover:opacity-95"
          >
            Перейти на корпоративную страницу
          </Link>
          <Link
            href="/#order"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold hover:bg-slate-50"
          >
            Оставить заявку
          </Link>
        </div>
      </div>
    </main>
  );
}