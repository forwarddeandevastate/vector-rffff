import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { PageShell, Breadcrumb, GlassPanel, Tag } from "@/app/ui/shared";

const SITE_URL = "https://vector-rf.ru";
const PAGE_URL = `${SITE_URL}/about`;

export const metadata: Metadata = {
  title: "О компании",
  description: "Вектор РФ — сервис поездок и трансферов по России: междугородние маршруты, аэропортные поездки, городские и корпоративные заказы.",
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", url: PAGE_URL, title: "О компании Вектор РФ", description: "Сервис поездок и трансферов по России.", siteName: "Вектор РФ", locale: "ru_RU", images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "О компании Вектор РФ" }] },
  twitter: { card: "summary_large_image", title: "О компании Вектор РФ", description: "Сервис поездок и трансферов по России.", images: ["/og.jpg"] },
};

export default function AboutPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "О компании", item: PAGE_URL },
    ],
  };

  return (
    <>
      <Script id="ld-about-breadcrumbs" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PageShell>
        <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
          <Breadcrumb items={[{ name: "Главная", href: "/" }, { name: "О компании", href: "/about" }]} />

          <div className="mt-6">
            <div className="flex flex-wrap gap-2 mb-5">
              <Tag>Трансферы по России</Tag>
              <Tag>С 2024 года</Tag>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">О компании</h1>
          </div>

          <GlassPanel className="mt-8 p-6 md:p-8">
            <div className="space-y-5 text-base leading-7 text-slate-600">
              <p>
                Вектор РФ — сервис поездок и трансферов по России. Основные направления работы — междугородние маршруты, трансфер в аэропорт, городские поездки и корпоративные заказы.
              </p>
              <p>
                Мы делаем акцент на понятной логистике: заранее согласовываем маршрут, формат поездки и класс автомобиля. На сайте собраны как основные коммерческие страницы, так и посадочные по городам и маршрутам.
              </p>
              <p>
                Сервис подходит для частных поездок, деловых маршрутов, поездок с багажом, семейных выездов и трансферов под конкретное время.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { title: "Межгород", text: "Прямые поездки между городами без пересадок. Уточняем остановки и обратную дорогу." },
                { title: "Аэропорт", text: "Встреча с табличкой, учёт времени рейса, помощь с багажом." },
                { title: "Корпоративным", text: "Поездки сотрудников и гостей, договор, закрывающие документы, безнал." },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-blue-100/60 bg-blue-50/40 p-5">
                  <div className="text-sm font-bold text-blue-800 mb-2">{c.title}</div>
                  <div className="text-sm leading-6 text-slate-600">{c.text}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className="btn-primary inline-flex items-center rounded-xl px-5 py-3 text-sm">Все услуги</Link>
              <Link href="/contacts" className="btn-ghost inline-flex items-center rounded-xl px-5 py-3 text-sm">Контакты</Link>
              <Link href="/" className="btn-ghost inline-flex items-center rounded-xl px-5 py-3 text-sm">Оставить заявку</Link>
            </div>
          </GlassPanel>
        </main>
      </PageShell>
    </>
  );
}
