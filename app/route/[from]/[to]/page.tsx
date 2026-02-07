import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

function prettifyCity(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

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

function cityName(slug: string) {
  return CITY_MAP[slug] ?? prettifyCity(slug);
}

type Props = {
  params: {
    from: string;
    to: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const from = cityName(params.from);
  const to = cityName(params.to);
  const url = `${SITE_URL}/route/${params.from}/${params.to}`;

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
  };
}

export default function Page({ params }: Props) {
  const from = cityName(params.from);
  const to = cityName(params.to);
  const canonical = `${SITE_URL}/route/${params.from}/${params.to}`;

  const PHONE_DISPLAY = "+7 (831) 423-39-29";
  const PHONE_TEL = "+78314233929";
  const TELEGRAM = "https://t.me/vector_rf52";

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
      {/* JSON-LD без next/script, просто обычный <script> */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-14">
        <nav className="text-sm text-slate-600">
          <Link className="hover:underline" href="/">
            Главная
          </Link>{" "}
          <span className="text-slate-400">/</span>{" "}
          <span className="text-slate-900 font-semibold">{from} — {to}</span>
        </nav>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
          Такси {from} — {to}
        </h1>

        <p className="mt-4 text-base leading-7 text-slate-700">
          Междугородняя поездка {from} — {to}. Подберём класс авто, согласуем маршрут и стоимость заранее.
          Работаем 24/7.
        </p>

        <ul className="mt-6 grid gap-2 text-sm text-slate-700">
          <li>• Комфорт / Бизнес / Минивэн</li>
          <li>• Стоимость согласуем до подачи автомобиля</li>
          <li>• Можно указать остановки и пожелания</li>
          <li>• Онлайн-заявка за 1 минуту</li>
        </ul>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/#order"
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white hover:opacity-95"
          >
            Оставить заявку
          </Link>

          <a
            href={`tel:${PHONE_TEL}`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold hover:bg-slate-50"
          >
            Позвонить: {PHONE_DISPLAY}
          </a>

          <a
            href={TELEGRAM}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold hover:bg-slate-50"
          >
            Telegram
          </a>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-extrabold">Вопросы</div>
          <div className="mt-3 grid gap-3 text-sm text-slate-700">
            <div>
              <div className="font-semibold">Можно заказать поездку заранее?</div>
              <div className="mt-1">Да. Укажите дату и время — зафиксируем заявку и подтвердим подачу.</div>
            </div>
            <div>
              <div className="font-semibold">Можно добавить остановки по пути?</div>
              <div className="mt-1">Да. Перечислите остановки в комментарии — учтём при согласовании стоимости.</div>
            </div>
            <div>
              <div className="font-semibold">Какие классы доступны?</div>
              <div className="mt-1">Стандарт, Комфорт, Бизнес и Минивэн — подтвердим доступность после заявки.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}