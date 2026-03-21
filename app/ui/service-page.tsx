/**
 * service-page.tsx — Server Component.
 * Рендерит весь статичный контент (h1, bullets, FAQ) на сервере.
 * Форма — отдельный lazy client-компонент.
 */
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  PageBackground, Header, Footer,
  GlassPanel, Tag, SectionHeading, Breadcrumb,
  IconPhone, IconTelegram,
  PHONE_DISPLAY, PHONE_TEL, TELEGRAM,
} from "@/app/ui/shared";
import { CORE_SERVICE_LINKS, POPULAR_ROUTE_LINKS } from "@/lib/internal-links";

// Форма — единственный client-компонент на странице
const ServiceFormClient = dynamic(() => import("./service-form-client"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-blue-100/60 bg-white/80 p-5">
      <div className="text-sm font-bold text-slate-800 mb-2">Оставить заявку</div>
      <div className="grid gap-2">
        <a href={`tel:${PHONE_TEL}`}
          className="btn-primary inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm">
          Позвонить
        </a>
        <a href={TELEGRAM} target="_blank" rel="noreferrer"
          className="btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm">
          Telegram
        </a>
      </div>
    </div>
  ),
});

type BreadcrumbItem = { name: string; href: string };
type FAQItem = { q: string; a: string };

function detectRouteType(breadcrumbs: BreadcrumbItem[]): "city" | "airport" | "intercity" {
  const last = breadcrumbs?.[breadcrumbs.length - 1]?.href ?? "";
  if (last.includes("aeroport") || last.includes("airport")) return "airport";
  if (last.includes("mezhgorod") || last.includes("intercity")) return "intercity";
  return "city";
}

export default function ServicePage({
  breadcrumbs,
  title,
  subtitle,
  bullets,
  faq,
}: {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  subtitle: string;
  bullets: string[];
  faq: FAQItem[];
}) {
  const routeType = detectRouteType(breadcrumbs);

  return (
    <div className="min-h-screen">
      <PageBackground />
      <Header />

      <div className="animate-page">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-10 lg:items-start">

            {/* ── LEFT: всё статичное (SSR) ───────────────────── */}
            <section>
              <Breadcrumb items={breadcrumbs} />

              <div className="mt-5 flex flex-wrap gap-2">
                <Tag>Проверенные водители</Tag>
                <Tag>Стоимость до выезда</Tag>
                <Tag>Работаем 24/7</Tag>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">{subtitle}</p>

              {/* Top-3 bullets — крупные карточки */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {bullets.slice(0, 3).map((item) => (
                  <div key={item}
                    className="rounded-2xl border border-blue-100/60 bg-white/80 p-4 backdrop-blur-sm shadow-sm">
                    <div className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      <span className="text-sm font-semibold text-slate-800">{item}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Остальные bullets */}
              {bullets.length > 3 && (
                <div className="mt-3 rounded-2xl border border-blue-100/60 bg-white/70 p-5 backdrop-blur-sm">
                  <ul className="grid gap-2">
                    {bullets.slice(3).map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                <a href="#order"
                  className="btn-primary inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold">
                  Оставить заявку
                </a>
                <a href={`tel:${PHONE_TEL}`}
                  className="btn-ghost inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold">
                  {PHONE_DISPLAY}
                </a>
                <a href={TELEGRAM} target="_blank" rel="noreferrer"
                  className="btn-ghost inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
                  <IconTelegram className="h-4 w-4 text-blue-600" />Telegram
                </a>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href="/prices" className="btn-ghost inline-flex items-center rounded-xl px-4 py-2.5 text-sm">
                  Цены
                </Link>
                <Link href="/reviews" className="btn-ghost inline-flex items-center rounded-xl px-4 py-2.5 text-sm">
                  Отзывы
                </Link>
                <Link href="/faq" className="btn-ghost inline-flex items-center rounded-xl px-4 py-2.5 text-sm">
                  FAQ
                </Link>
              </div>
            </section>

            {/* ── RIGHT: форма (client) ────────────────────────── */}
            <aside id="order" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
              <ServiceFormClient routeType={routeType} />
            </aside>
          </div>

          {/* ── FAQ ─────────────────────────────────────────────── */}
          <section className="mt-10">
            <GlassPanel className="p-6 md:p-8">
              <SectionHeading title="Вопросы и ответы" />
              <div className="grid gap-3">
                {faq.map((x, i) => (
                  <div key={x.q}
                    className="rounded-2xl border border-blue-100/50 bg-white/80 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-xs font-bold text-blue-400 shrink-0 w-5 text-center">
                        {i + 1}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{x.q}</div>
                        <div className="mt-2 text-sm leading-6 text-slate-600">{x.a}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </section>

          {/* ── ПЕРЕЛИНКОВКА ────────────────────────────────────── */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <GlassPanel className="p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
                Услуги
              </div>
              <div className="flex flex-wrap gap-2">
                {CORE_SERVICE_LINKS.map((item) => (
                  <Link key={item.href} href={item.href}
                    className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
            </GlassPanel>
            <GlassPanel className="p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
                Популярные маршруты
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_ROUTE_LINKS.slice(0, 8).map((item) => (
                  <Link key={item.href} href={item.href}
                    className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
            </GlassPanel>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
