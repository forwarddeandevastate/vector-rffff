// lib/seo-routes.ts
export type SeoRoute = { from: string; to: string };

/**
 * Города (и крупные пригороды/города-спутники) из регионов на скриншоте,
 * ориентир: население ~100k+.
 *
 * СЛАГИ: латиница + дефисы, как у тебя в проекте.
 */
const CITIES_100K: string[] = [
  // Москва и МО
  "moskva",
  "balashikha",
  "khimki",
  "podolsk",
  "mytishchi",
  "korolyov",
  "lyubertsy",
  "elektrostal",
  "kolomna",
  "odintsovo",
  "domodedovo",
  "krasnogorsk",
  "serpukhov",
  "ramenskoye",
  "dolgoprudny",
  "pushkino",
  "zhukovskiy",
  "orekhovo-zuevo",
  "shchyolkovo",
  "noginsk",

  // Белгородская область
  "belgorod",
  "staryy-oskol",
  "gubkin",

  // Брянская область
  "bryansk",

  // Владимирская область
  "vladimir",
  "kovrov",
  "murom",

  // Воронежская область
  "voronezh",

  // Ивановская область
  "ivanovo",
  "kineshma",

  // Калужская область
  "kaluga",
  "obninsk",

  // Костромская область
  "kostroma",

  // Курская область
  "kursk",
  "zheleznogorsk-kursk",

  // Липецкая область
  "lipetsk",
  "yelets",

  // Орловская область
  "orel",

  // Рязанская область
  "ryazan",

  // Смоленская область
  "smolensk",

  // Тамбовская область
  "tambov",

  // Тверская область
  "tver",

  // Тульская область
  "tula",
  "novomoskovsk",

  // Ярославская область
  "yaroslavl",
  "rybinsk",

  // Санкт-Петербург и ЛО (в ЛО 100k+ городов мало; СПб точно нужен)
  "sankt-peterburg",

  // Архангельская область
  "arkhangelsk",
  "severodvinsk",

  // Вологодская область
  "vologda",
  "cherepovets",

  // Калининградская область
  "kaliningrad",

  // Новгородская область
  "velikiy-novgorod",

  // Псковская область
  "pskov",

  // Астраханская область
  "astrakhan",

  // Волгоградская область
  "volgograd",
  "volzhskiy",
  "kamyshin",

  // Краснодарский край
  "krasnodar",
  "sochi",
  "novorossiysk",
  "armavir",

  // Республика Адыгея
  "maykop",

  // Ростовская область
  "rostov-na-donu",
  "taganrog",
  "shakhty",
  "novocherkassk",
  "volgodonsk",
  "bataysk",
  "kamensk-shakhtinsky",

  // Красноярский край
  "krasnoyarsk",
  "norilsk",
  "achinsk",
  "kansk",

  // Новосибирская область
  "novosibirsk",
  "berdsk",

  // Ставропольский край
  "stavropol",
  "pyatigorsk",
  "kislovodsk",
  "essentuki",
  "nevinnomyssk",

  // Челябинская область
  "chelyabinsk",
  "magnitogorsk",
  "zlatoust",
  "miass",
  "kopeysk",
];

/**
 * Новые территории РФ (как ты просил) — держим отдельным блоком,
 * они добавляются в "источники" и в приоритетные пары.
 */
const NEW_TERRITORIES: string[] = [
  // ДНР
  "donetsk",
  "makeyevka",
  "mariupol",
  "gorlovka",
  "enakiyevo",
  "khartsyzk",

  // ЛНР
  "lugansk",
  "alchevsk",
  "krasnodon",
  "severodonetsk",

  // Запорожье
  "melitopol",
  "berdyansk",
  "tokmak",

  // Херсон
  "kherson",
  "genichesk",
  "skadovsk",
];

/**
 * Приоритетные пары — хиты (новые территории + юг + столицы).
 * Остальное добиваем генератором.
 */
const PRIORITY_PAIRS: SeoRoute[] = [
  // ДНР
  { from: "donetsk", to: "rostov-na-donu" },
  { from: "donetsk", to: "moskva" },
  { from: "donetsk", to: "voronezh" },
  { from: "donetsk", to: "krasnodar" },
  { from: "donetsk", to: "taganrog" },
  { from: "makeyevka", to: "rostov-na-donu" },
  { from: "makeyevka", to: "moskva" },
  { from: "mariupol", to: "rostov-na-donu" },
  { from: "mariupol", to: "taganrog" },
  { from: "mariupol", to: "krasnodar" },

  // ЛНР
  { from: "lugansk", to: "rostov-na-donu" },
  { from: "lugansk", to: "moskva" },
  { from: "lugansk", to: "voronezh" },
  { from: "lugansk", to: "krasnodar" },
  { from: "alchevsk", to: "rostov-na-donu" },
  { from: "krasnodon", to: "rostov-na-donu" },

  // Запорожье
  { from: "melitopol", to: "rostov-na-donu" },
  { from: "melitopol", to: "krasnodar" },
  { from: "berdyansk", to: "rostov-na-donu" },
  { from: "berdyansk", to: "krasnodar" },

  // Херсон
  { from: "kherson", to: "krasnodar" },
  { from: "genichesk", to: "rostov-na-donu" },

  // “классика”
  { from: "moskva", to: "sankt-peterburg" },
  { from: "rostov-na-donu", to: "moskva" },
  { from: "krasnodar", to: "moskva" },
  { from: "voronezh", to: "moskva" },
  { from: "belgorod", to: "moskva" },
];

/**
 * Хабы — куда часто едут (берём весь пул 100k+ + часть “новых территорий” как направления).
 */
const HUBS: string[] = Array.from(
  new Set([
    ...CITIES_100K,
    // чтобы “новые территории” могли быть “куда”
    ...NEW_TERRITORIES,
  ])
);

/**
 * Источники — откуда едут (пул 100k+ + новые территории).
 */
const ORIGINS: string[] = Array.from(new Set([...CITIES_100K, ...NEW_TERRITORIES]));

/**
 * Генерируем ровно N уникальных маршрутов.
 * Важно: убираем дубли, не делаем from === to.
 */
export function buildSeoRoutes(limit = 500): SeoRoute[] {
  const out: SeoRoute[] = [];
  const seen = new Set<string>();

  const push = (r: SeoRoute) => {
    if (!r.from || !r.to) return;
    if (r.from === r.to) return;
    const key = `${r.from}__${r.to}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(r);
  };

  // 1) приоритетные
  for (const r of PRIORITY_PAIRS) {
    push(r);
    if (out.length >= limit) return out;
  }

  // 2) ORIGINS -> HUBS (самое главное для SEO)
  for (const from of ORIGINS) {
    for (const to of HUBS) {
      push({ from, to });
      if (out.length >= limit) return out;
    }
  }

  // 3) запасной добив: HUBS -> HUBS
  for (const from of HUBS) {
    for (const to of HUBS) {
      push({ from, to });
      if (out.length >= limit) return out;
    }
  }

  return out.slice(0, limit);
}

export function buildSeoRouteUrls(baseUrl: string, limit = 500): string[] {
  const routes = buildSeoRoutes(limit);
  return routes.map((r) => `${baseUrl}/route/${r.from}/${r.to}`);
}