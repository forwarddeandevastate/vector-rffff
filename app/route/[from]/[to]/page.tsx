import type { Metadata } from "next";
import Link from "next/link";
import ServicePage from "../../../ui/service-page";
import { buildSeoRoutes } from "@/lib/seo-routes";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

/**
 * ВАЖНО:
 * Не генерим 2000 маршрутов на каждый запрос/рендер.
 * Считаем один раз на уровне модуля и дальше только фильтруем.
 */
const SEO_ROUTES = buildSeoRoutes(2000);
const SEO_SET = new Set(SEO_ROUTES.map((r) => `${r.from}__${r.to}`));

/**
 * Пререндерим часть маршрутов (ускоряет ботов и людей на популярных направлениях).
 * Можно увеличить/уменьшить. 600 — нормальный компромисс.
 */
export function generateStaticParams() {
  return SEO_ROUTES.slice(0, 600).map((r) => ({ from: r.from, to: r.to }));
}

function safePretty(slug: string) {
  const s = (slug ?? "").trim();
  if (!s) return "Город";

  const decoded = (() => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  })();

  return decoded
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// slug -> русское имя
const CITY_MAP: Record<string, string> = {
  moskva: "Москва",
  "sankt-peterburg": "Санкт-Петербург",
  "nizhniy-novgorod": "Нижний Новгород",
  kazan: "Казань",
  samara: "Самара",
  saratov: "Саратов",
  volgograd: "Волгоград",
  krasnodar: "Краснодар",
  "rostov-na-donu": "Ростов-на-Дону",
  voronezh: "Воронеж",
  tula: "Тула",
  ryazan: "Рязань",
  yaroslavl: "Ярославль",
  tver: "Тверь",
  smolensk: "Смоленск",
  kaliningrad: "Калининград",
  "velikiy-novgorod": "Великий Новгород",
  pskov: "Псков",
  astrakhan: "Астрахань",
  chelyabinsk: "Челябинск",
  novosibirsk: "Новосибирск",
  krasnoyarsk: "Красноярск",

  balashikha: "Балашиха",
  khimki: "Химки",
  podolsk: "Подольск",
  mytishchi: "Мытищи",
  korolev: "Королёв",
  lyubertsy: "Люберцы",
  elektrostal: "Электросталь",
  kolomna: "Коломна",
  odintsovo: "Одинцово",
  krasnogorsk: "Красногорск",
  serpukhov: "Серпухов",
  "orekhovo-zuevo": "Орехово-Зуево",
  shchyolkovo: "Щёлково",
  ramenskoye: "Раменское",
  domodedovo: "Домодедово",
  pushkino: "Пушкино",
  zhukovskiy: "Жуковский",
  reutov: "Реутов",
  noginsk: "Ногинск",

  belgorod: "Белгород",
  "staryy-oskol": "Старый Оскол",
  gubkin: "Губкин",

  bryansk: "Брянск",
  klintsy: "Клинцы",

  vladimir: "Владимир",
  kovrov: "Ковров",
  murom: "Муром",

  ivanovo: "Иваново",

  kaluga: "Калуга",
  obninsk: "Обнинск",

  kostroma: "Кострома",

  kursk: "Курск",
  "zheleznogorsk-kursk": "Железногорск",

  lipetsk: "Липецк",
  yelets: "Елец",

  orel: "Орёл",

  tambov: "Тамбов",

  arkhangelsk: "Архангельск",
  severodvinsk: "Северодвинск",

  vologda: "Вологда",
  cherepovets: "Череповец",

  volzhskiy: "Волжский",
  kamyshin: "Камышин",

  sochi: "Сочи",
  novorossiysk: "Новороссийск",
  armavir: "Армавир",
  anapa: "Анапа",

  maykop: "Майкоп",

  taganrog: "Таганрог",
  shakhty: "Шахты",
  novocherkassk: "Новочеркасск",
  volgodonsk: "Волгодонск",
  bataysk: "Батайск",
  "kamensk-shakhtinskiy": "Каменск-Шахтинский",

  simferopol: "Симферополь",
  sevastopol: "Севастополь",
  kerch: "Керчь",
  evpatoriya: "Евпатория",

  stavropol: "Ставрополь",
  pyatigorsk: "Пятигорск",
  kislovodsk: "Кисловодск",
  essentuki: "Ессентуки",
  nevinnomyssk: "Невинномысск",

  magnitogorsk: "Магнитогорск",
  zlatoust: "Златоуст",
  miass: "Миасс",
  kopeysk: "Копейск",

  berdsk: "Бердск",

  norilsk: "Норильск",
  achinsk: "Ачинск",
  kansk: "Канск",
  "zheleznogorsk-krasnoyarsk": "Железногорск",

  donetsk: "Донецк",
  makeyevka: "Макеевка",
  mariupol: "Мариуполь",
  gorlovka: "Горловка",
  lugansk: "Луганск",
  melitopol: "Мелитополь",
  berdyansk: "Бердянск",
  kherson: "Херсон",
};

function cityName(slug: string) {
  const s = (slug ?? "").trim();
  if (!s) return "Город";
  return CITY_MAP[s] ?? safePretty(s);
}

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type Props = {
  params: { from: string; to: string };
};

function isKnownRoute(from: string, to: string) {
  return SEO_SET.has(`${from}__${to}`);
}

function getRelatedLinks(from: string, to: string, limit = 25) {
  const fromLinks = SEO_ROUTES.filter((r) => r.from === from && r.to !== to)
    .slice(0, limit)
    .map((r) => ({
      href: `/route/${r.from}/${r.to}`,
      label: `${cityName(r.from)} — ${cityName(r.to)}`,
      key: `${r.from}__${r.to}`,
    }));

  const toLinks = SEO_ROUTES.filter((r) => r.to === to && r.from !== from)
    .slice(0, limit)
    .map((r) => ({
      href: `/route/${r.from}/${r.to}`,
      label: `${cityName(r.from)} — ${cityName(r.to)}`,
      key: `${r.from}__${r.to}`,
    }));

  return { fromLinks, toLinks };
}

function RelatedLinksBlock({
  title,
  desc,
  links,
}: {
  title: string;
  desc: string;
  links: Array<{ href: string; label: string; key: string }>;
}) {
  if (!links.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">{title}</h2>
        <p className="mt-2 text-sm text-zinc-600">{desc}</p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className={cn(
                "rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-semibold",
                "text-zinc-800 shadow-sm backdrop-blur hover:bg-white hover:border-sky-200/80"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function SeoTextBlock({ from, to, known }: { from: string; to: string; known: boolean }) {
  // Лёгкая вариативность, чтобы страницы не были «одинаковые до буквы»
  const variants = [
    {
      p1: `Такси ${from} — ${to} — удобный способ добраться без пересадок и ожиданий. Мы организуем междугородние поездки с предварительным согласованием стоимости и подбором подходящего класса автомобиля.`,
      p2: `Трансфер из ${from} в ${to} подходит для командировок, семейных поездок и поездок с багажом. Стоимость подтверждаем заранее — до подачи автомобиля.`,
    },
    {
      p1: `Междугороднее такси ${from} — ${to} удобно, когда важны время и комфорт. Мы согласуем маршрут, подачу и цену заранее, чтобы поездка прошла спокойно.`,
      p2: `Поездка ${from} — ${to} возможна в классах Стандарт, Комфорт, Бизнес и Минивэн. Укажите пожелания (багаж, кресло, остановки) — мы всё учтём при подтверждении.`,
    },
    {
      p1: `Трансфер ${from} — ${to} без пересадок: заберём по адресу и довезём до точки назначения. Заявка оформляется онлайн за 1 минуту.`,
      p2: `Такси из ${from} в ${to} можно заказать заранее на нужную дату и время. Мы подтверждаем стоимость до подачи и фиксируем заявку.`,
    },
  ];

  // детерминированный выбор по маршруту
  const idx = (from.length + to.length) % variants.length;
  const v = variants[idx];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">
          Междугороднее такси {from} — {to}
        </h2>

        <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-700">
          <p>{v.p1}</p>
          <p>{v.p2}</p>

          <p>
            Мы работаем 24/7: после заявки уточняем детали и подтверждаем подачу. Можно добавить остановки по пути и
            выбрать класс автомобиля под вашу задачу.
          </p>

          <p>
            Заказать такси {from} — {to} можно онлайн.{" "}
            {known
              ? "Маршрут популярный — подскажем оптимальное время выезда и нюансы по дороге."
              : "Если маршрут редкий — мы уточним возможность поездки и предложим варианты."}
          </p>

          <p className="text-xs text-zinc-500">
            Семантика: междугородний трансфер, поездка на автомобиле, водитель с опытом, аренда авто с водителем,
            поездка без пересадок.
          </p>
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fromTitle = cityName(params.from);
  const toTitle = cityName(params.to);

  const url = `${SITE_URL}/route/${params.from}/${params.to}`;
  const known = isKnownRoute(params.from, params.to);

  return {
    title: `Такси ${fromTitle} — ${toTitle} | Межгород | Вектор РФ`,
    description: `Междугороднее такси ${fromTitle} — ${toTitle}. Комфорт, бизнес, минивэн. Стоимость согласуем заранее. Онлайн-заявка 24/7.`,
    alternates: { canonical: url },

    // ✅ неизвестные пары: noindex (но follow, чтобы вес по внутренним ссылкам проходил)
    robots: known
      ? { index: true, follow: true }
      : {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        },

    openGraph: {
      type: "website",
      url,
      title: `Такси ${fromTitle} — ${toTitle} | Вектор РФ`,
      description: `Поездка ${fromTitle} — ${toTitle}: согласуем стоимость заранее. Онлайн-заявка 24/7.`,
      siteName: SITE_NAME,
      locale: "ru_RU",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Такси ${fromTitle} — ${toTitle} | Вектор РФ`,
      description: `Междугородний трансфер ${fromTitle} — ${toTitle}. Онлайн-заявка 24/7.`,
      images: ["/og.jpg"],
    },
  };
}

export default function Page({ params }: Props) {
  const known = isKnownRoute(params.from, params.to);

  const from = cityName(params.from);
  const to = cityName(params.to);

  const canonical = `${SITE_URL}/route/${params.from}/${params.to}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Такси ${from} — ${to}`,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: { "@type": "Country", name: "Россия" },
    serviceType: ["Междугороднее такси", "Трансфер между городами"],
    url: canonical,
  };

  const { fromLinks, toLinks } = getRelatedLinks(params.from, params.to, 25);

  return (
    <>
      {/* ✅ SEO: JSON-LD в HTML сразу */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ✅ Дополнительная страховка: noindex прямо в HTML для неизвестных пар */}
      {!known && <meta name="robots" content="noindex, follow" />}

      <ServicePage
        breadcrumbs={[
          { name: "Главная", href: "/" },
          { name: `${from} — ${to}`, href: `/route/${params.from}/${params.to}` },
        ]}
        title={`Такси ${from} — ${to}`}
        subtitle={
          known
            ? `Междугородняя поездка ${from} — ${to}. Подбор класса авто, согласование маршрута и стоимости заранее. Работаем 24/7.`
            : `Маршрут ${from} — ${to}. Оставьте заявку — мы подтвердим возможность поездки и согласуем стоимость.`
        }
        bullets={[
          `Поездка ${from} — ${to} на комфортном автомобиле`,
          "Комфорт / Бизнес / Минивэн",
          "Стоимость согласуем до подачи автомобиля",
          "Можно указать остановки и пожелания",
          "Работаем 24/7, заявка онлайн за 1 минуту",
        ]}
        faq={[
          {
            q: "Можно ли заказать поездку заранее?",
            a: "Да. Укажите дату и время — мы зафиксируем заявку и подтвердим подачу автомобиля.",
          },
          {
            q: "Можно ли добавить остановки по пути?",
            a: "Да. Просто напишите остановки в комментарии — мы учтём это при согласовании стоимости.",
          },
          {
            q: "Какие классы доступны?",
            a: "Стандарт, Комфорт, Бизнес и Минивэн. Выберите класс в форме — мы подтвердим доступность.",
          },
        ]}
      />

      {/* ✅ Массовый SEO-блок (уникализируется вариациями) */}
      <SeoTextBlock from={from} to={to} known={known} />

      {/* ✅ Усиленная перелинковка */}
      <RelatedLinksBlock
        title={`Популярные направления из ${from}`}
        desc="Ещё маршруты из этого города (внутренние ссылки помогают индексации)."
        links={fromLinks}
      />

      <RelatedLinksBlock
        title={`Популярные направления в ${to}`}
        desc="Ещё маршруты в этот город."
        links={toLinks}
      />
    </>
  );
}