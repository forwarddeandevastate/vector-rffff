// app/route/[from]/[to]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { buildSeoRoutes } from "@/lib/seo-routes";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

function prettifyCity(slug?: string) {
  const s = (slug ?? "").trim();
  if (!s) return "—";
  return s
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Маппинг чтобы города нормально назывались
const CITY_MAP: Record<string, string> = {
  "nizhniy-novgorod": "Нижний Новгород",
  moskva: "Москва",
  "sankt-peterburg": "Санкт-Петербург",
  kazan: "Казань",
  samara: "Самара",
  sochi: "Сочи",
  "rostov-na-donu": "Ростов-на-Дону",
  krasnodar: "Краснодар",
  volgograd: "Волгоград",
  voronezh: "Воронеж",
  belgorod: "Белгород",
  kursk: "Курск",

  // Новые территории
  donetsk: "Донецк",
  makeyevka: "Макеевка",
  mariupol: "Мариуполь",
  gorlovka: "Горловка",
  enakiyevo: "Енакиево",
  khartsyzk: "Харцызск",

  lugansk: "Луганск",
  alchevsk: "Алчевск",
  krasnodon: "Краснодон",
  severodonetsk: "Северодонецк",

  melitopol: "Мелитополь",
  berdyansk: "Бердянск",
  tokmak: "Токмак",

  kherson: "Херсон",
  genichesk: "Геническ",
  skadovsk: "Скадовск",
};

function cityName(slug?: string) {
  const s = (slug ?? "").trim();
  if (!s) return "—";
  return CITY_MAP[s] ?? prettifyCity(s);
}

type Props = { params: { from?: string; to?: string } };

// 500 SEO-маршрутов
export async function generateStaticParams() {
  return buildSeoRoutes(500).map((r) => ({ from: r.from, to: r.to }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fromSlug = params?.from ?? "";
  const toSlug = params?.to ?? "";

  const from = cityName(fromSlug);
  const to = cityName(toSlug);

  const url = `${SITE_URL}/route/${fromSlug}/${toSlug}`;

  return {
    title: `Такси ${from} — ${to} | Межгород | Вектор РФ`,
    description: `Междугороднее такси ${from} — ${to}. Комфорт, бизнес, минивэн. Фиксируем заявку и согласуем стоимость заранее. Онлайн-заявка 24/7.`,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `Такси ${from} — ${to} | Вектор РФ`,
      description: `Поездка ${from} — ${to}: комфортные автомобили, согласуем стоимость заранее. Онлайн-заявка 24/7.`,
      siteName: SITE_NAME,
      locale: "ru_RU",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Такси ${from} — ${to} | Вектор РФ`,
      description: `Междугородний трансфер ${from} — ${to}. Онлайн-заявка 24/7.`,
      images: ["/og.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

export default function Page({ params }: Props) {
  const fromSlug = params?.from ?? "";
  const toSlug = params?.to ?? "";

  const from = cityName(fromSlug);
  const to = cityName(toSlug);

  const canonical = `${SITE_URL}/route/${fromSlug}/${toSlug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Такси ${from} — ${to}`,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: { "@type": "Country", name: "Россия" },
    serviceType: ["Междугороднее такси", "Трансфер между городами"],
    url: canonical,
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-3xl px-4 py-14">
        <div className="text-sm text-slate-600">
          <Link href="/" className="hover:underline">
            Главная
          </Link>{" "}
          / <span className="text-slate-900 font-semibold">{from} — {to}</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
          Такси {from} — {to}
        </h1>

        <p className="mt-4 text-slate-700 leading-7">
          Междугородняя поездка {from} — {to}. Подберём класс авто, уточним маршрут и согласуем стоимость до подачи.
          Работаем 24/7.
        </p>

        <ul className="mt-6 grid gap-2 text-slate-700">
          <li>• Комфорт / Бизнес / Минивэн</li>
          <li>• Стоимость согласуем заранее</li>
          <li>• Можно указать остановки и пожелания</li>
          <li>• Заявка онлайн за 1 минуту</li>
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/#order"
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white hover:opacity-95"
          >
            Оставить заявку
          </Link>
          <Link
            href="/intercity-taxi"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold hover:bg-slate-50"
          >
            Подробнее про межгород
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="font-extrabold">FAQ</div>
          <div className="mt-3 grid gap-4 text-sm text-slate-700">
            <div>
              <div className="font-semibold">Можно ли заказать поездку заранее?</div>
              <div className="mt-1">Да. Укажите дату/время — зафиксируем заявку и подтвердим подачу.</div>
            </div>
            <div>
              <div className="font-semibold">Можно ли добавить остановки по пути?</div>
              <div className="mt-1">Да. Напишите остановки — учтём при согласовании стоимости.</div>
            </div>
            <div>
              <div className="font-semibold">Какие классы доступны?</div>
              <div className="mt-1">Стандарт, Комфорт, Бизнес и Минивэн.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}