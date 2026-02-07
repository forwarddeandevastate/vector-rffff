import Link from "next/link";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function ServicePage({
  title,
  subtitle,
  bullets,
  faq,
  primaryCtaText = "Оставить заявку",
  primaryCtaHref = "/#order",
  secondaryCtaText = "Позвонить",
  secondaryCtaHref = "tel:+78314233929",
  breadcrumbs = [{ name: "Главная", href: "/" }],
}: {
  title: string;
  subtitle: string;
  bullets: string[];
  faq: Array<{ q: string; a: string }>;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  breadcrumbs?: Array<{ name: string; href: string }>;
}) {
  return (
    <main className="min-h-screen text-zinc-900">
      <div className="fixed inset-0 -z-20 bg-[#f3f7ff]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_50%_-10%,rgba(56,189,248,0.35),transparent_60%),radial-gradient(900px_520px_at_12%_18%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(900px_520px_at_88%_20%,rgba(99,102,241,0.14),transparent_55%)]" />
      <div className="fixed inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white/70 to-transparent" />

      <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/65 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div
              className={cn(
                "relative grid h-11 w-11 place-items-center rounded-2xl",
                "bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600",
                "text-white shadow-sm ring-1 ring-white/20"
              )}
              aria-hidden
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4.5 6.5l7.5 13 7.5-13"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.7 6.5h10.6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="leading-tight">
              <div
                className={cn(
                  "text-[15px] font-black tracking-tight",
                  "bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent"
                )}
              >
                Вектор РФ
              </div>
              <div className="text-xs text-zinc-600">Трансферы и поездки по России</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={secondaryCtaHref}
              className={cn(
                "inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-semibold",
                "border border-zinc-200 bg-white/70 shadow-sm backdrop-blur hover:bg-white"
              )}
            >
              {secondaryCtaText}
            </a>
            <a
              href={primaryCtaHref}
              className={cn(
                "inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-extrabold text-white shadow-sm",
                "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:opacity-95"
              )}
            >
              {primaryCtaText}
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <nav className="text-sm text-zinc-600">
          {breadcrumbs.map((b, i) => (
            <span key={b.href}>
              <Link href={b.href} className="hover:text-zinc-900">
                {b.name}
              </Link>
              {i < breadcrumbs.length - 1 ? <span className="mx-2">/</span> : null}
            </span>
          ))}
        </nav>

        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">{subtitle}</p>

        <div className="mt-7 grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="text-sm font-extrabold text-zinc-900">Почему выбирают нас</div>
            <ul className="mt-4 grid gap-2 text-sm text-zinc-700">
              {bullets.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                  <span className="leading-6">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={primaryCtaHref}
                className={cn(
                  "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold text-white shadow-sm",
                  "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:opacity-95"
                )}
              >
                {primaryCtaText}
              </a>
              <a
                href="/#classes"
                className={cn(
                  "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold",
                  "border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
                )}
              >
                Классы авто
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="text-sm font-extrabold text-zinc-900">Частые вопросы</div>
            <div className="mt-4 grid gap-3">
              {faq.map((item) => (
                <details
                  key={item.q}
                  className="rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm"
                >
                  <summary className="cursor-pointer text-sm font-extrabold text-zinc-900">
                    {item.q}
                  </summary>
                  <div className="mt-2 text-sm leading-6 text-zinc-700">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-extrabold text-zinc-900">Полезные страницы</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link className="rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold hover:bg-white" href="/city-transfer">
              Город
            </Link>
            <Link className="rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold hover:bg-white" href="/airport-transfer">
              Аэропорт
            </Link>
            <Link className="rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold hover:bg-white" href="/intercity-taxi">
              Межгород
            </Link>
            <Link className="rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold hover:bg-white" href="/minivan-transfer">
              Минивэн
            </Link>
            <Link className="rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold hover:bg-white" href="/corporate">
              Корпоративным
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white/65 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-xs text-zinc-500">© {new Date().getFullYear()} Вектор РФ.</div>
        </div>
      </footer>
    </main>
  );
}