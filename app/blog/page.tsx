import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { PageShell } from "@/app/ui/shared";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog";

const SITE_URL = "https://vector-rf.ru";

export const metadata: Metadata = {
  title: "Блог — советы по трансферам и поездкам по России",
  description:
    "Полезные статьи о межгородских поездках: как заказать такси межгород, выбрать класс авто, сравнить с поездом и правильно спланировать маршрут.",
  alternates: { canonical: "/blog" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Блог Вектор РФ — советы по трансферам и поездкам",
    description: "Статьи о межгородских поездках, трансферах в аэропорт и выборе такси.",
    siteName: "Вектор РФ",
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Блог Вектор РФ" }],
  },,
  twitter: {
    card: "summary_large_image",
    title: "Блог о трансферах и такси — Вектор РФ",
    description: "Советы, сравнения и маршруты: как заказать такси межгород, трансфер в аэропорт и поездки по России.",
    images: ["/og.jpg"],
  },
};

export default function BlogPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Блог", item: `${SITE_URL}/blog` },
    ],
  };

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Блог Вектор РФ",
    url: `${SITE_URL}/blog`,
    description: "Советы по межгородским поездкам и трансферам по России",
    publisher: {
      "@type": "Organization",
      name: "Вектор РФ",
      url: SITE_URL,
    },
    blogPost: BLOG_POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      dateModified: p.updatedAt ?? p.publishedAt,
      description: p.excerpt,
    })),
  };

  const categoryColors: Record<string, string> = {
    sovety: "bg-blue-50 text-blue-700 border-blue-200/60",
    sravneniya: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    marshruty: "bg-sky-50 text-sky-700 border-sky-200/60",
  };

  return (
    <>
      <Script id="ld-blog-breadcrumbs" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="ld-blog" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />

      <PageShell>
        <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-blue-300/80 mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors font-medium">Главная</Link>
            <span className="text-blue-200">/</span>
            <span className="text-blue-800/60 font-semibold">Блог</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {BLOG_CATEGORIES.map((cat) => (
                <span key={cat.slug}
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${categoryColors[cat.slug] ?? "bg-blue-50 text-blue-700 border-blue-200/60"}`}>
                  {cat.label}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Блог о поездках и трансферах
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600 max-w-2xl">
              Советы пассажирам, сравнения способов добраться и разборы популярных маршрутов по России.
            </p>
          </div>

          {/* Articles grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group rounded-3xl border border-blue-100/70 bg-white/82 backdrop-blur-md shadow-sm p-6 hover:shadow-md hover:border-blue-200 transition-all">

                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${categoryColors[post.categorySlug] ?? "bg-blue-50 text-blue-700 border-blue-200/60"}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-400">{post.readTime} мин. чтения</span>
                </div>

                <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug mb-3">
                  {post.title}
                </h2>

                <p className="text-sm text-slate-500 leading-6 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <time dateTime={post.publishedAt} className="text-xs text-slate-400">
                    {new Date(post.publishedAt).toLocaleDateString("ru-RU", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </time>
                  <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                    Читать →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* SEO links block */}
          <div className="mt-12 rounded-3xl border border-blue-100/70 bg-white/82 backdrop-blur-md shadow-sm p-6 md:p-8">
            <div className="text-sm font-bold text-slate-800 mb-4">Популярные маршруты</div>
            <div className="flex flex-wrap gap-2">
              {[
                { href: "/moskva/nizhniy-novgorod", label: "Москва — Нижний Новгород" },
                { href: "/moskva/kazan", label: "Москва — Казань" },
                { href: "/nizhniy-novgorod/moskva", label: "Нижний Новгород — Москва" },
                { href: "/krasnodar/sochi", label: "Краснодар — Сочи" },
                { href: "/rostov-na-donu/krasnodar", label: "Ростов-на-Дону — Краснодар" },
                { href: "/yekaterinburg/tyumen", label: "Екатеринбург — Тюмень" },
                { href: "/intercity-taxi", label: "Междугороднее такси" },
                { href: "/airport-transfer", label: "Трансфер в аэропорт" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

        </main>
      </PageShell>
    </>
  );
}
