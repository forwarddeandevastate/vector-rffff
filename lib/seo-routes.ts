// lib/seo-routes.ts
export type SeoRoute = { from: string; to: string };

/**
 * Города 100k+ (плюс ключевые хабы) — по регионам со скрина.
 * Списки можно расширять/править — это “ядро” для SEO-маршрутов.
 *
 * ВАЖНО: слаг = латиница + дефисы (как у тебя в /route/[from]/[to])
 */
const CITIES: string[] = [
  // --- Хабы федерального уровня ---
  "moskva",
  "sankt-peterburg",
  "nizhniy-novgorod",
  "kazan",
  "samara",
  "saratov",
  "volgograd",
  "krasnodar",
  "rostov-na-donu",
  "voronezh",
  "tula",
  "ryazan",
  "yaroslavl",
  "tver",
  "smolensk",
  "kaliningrad",
  "velikiy-novgorod",
  "pskov",
  "astrakhan",
  "chelyabinsk",
  "novosibirsk",
  "krasnoyarsk",

  // --- Москва и область (крупные города МО) ---
  "balashikha",
  "khimki",
  "podolsk",
  "mytishchi",
  "korolev",
  "lyubertsy",
  "elektrostal",
  "kolomna",
  "odintsovo",
  "krasnogorsk",
  "serpukhov",
  "orekhovo-zuevo",
  "shchyolkovo",
  "ramenskoye",
  "domodedovo",
  "pushkino",
  "zhukovskiy",
  "reutov",
  "noginsk",

  // --- Белгородская область ---
  "belgorod",
  "staryy-oskol",
  "gubkin",

  // --- Брянская область ---
  "bryansk",
  "klintsy",

  // --- Владимирская область ---
  "vladimir",
  "kovrov",
  "murom",

  // --- Воронежская область ---
  "voronezh",

  // --- Ивановская область ---
  "ivanovo",

  // --- Калужская область ---
  "kaluga",
  "obninsk",

  // --- Костромская область ---
  "kostroma",

  // --- Курская область ---
  "kursk",
  "zheleznogorsk-kursk",

  // --- Липецкая область ---
  "lipetsk",
  "yelets",

  // --- Орловская область ---
  "orel",

  // --- Рязанская область ---
  "ryazan",

  // --- Смоленская область ---
  "smolensk",

  // --- Тамбовская область ---
  "tambov",

  // --- Тверская область ---
  "tver",

  // --- Тульская область ---
  "tula",
  "novomoskovsk",

  // --- Ярославская область ---
  "yaroslavl",
  "rybinsk",

  // --- Санкт-Петербург и Ленобласть (из 100k+ фактически СПб) ---
  "sankt-peterburg",

  // --- Архангельская область ---
  "arkhangelsk",
  "severodvinsk",

  // --- Вологодская область ---
  "vologda",
  "cherepovets",

  // --- Калининградская область ---
  "kaliningrad",

  // --- Новгородская область ---
  "velikiy-novgorod",

  // --- Псковская область ---
  "pskov",

  // --- Астраханская область ---
  "astrakhan",

  // --- Волгоградская область ---
  "volgograd",
  "volzhskiy",
  "kamyshin",

  // --- Краснодарский край ---
  "krasnodar",
  "sochi",
  "novorossiysk",
  "armavir",
  "anapa",

  // --- Республика Адыгея ---
  "maykop",

  // --- Ростовская область ---
  "rostov-na-donu",
  "taganrog",
  "shakhty",
  "novocherkassk",
  "volgodonsk",
  "bataysk",
  "kamensk-shakhtinskiy",

  // --- Республика Крым / Севастополь ---
  "simferopol",
  "sevastopol",
  "kerch",
  "evpatoriya",

  // --- Ставропольский край ---
  "stavropol",
  "pyatigorsk",
  "kislovodsk",
  "essentuki",
  "nevinnomyssk",

  // --- Челябинская область ---
  "chelyabinsk",
  "magnitogorsk",
  "zlatoust",
  "miass",
  "kopeysk",

  // --- Новосибирская область ---
  "novosibirsk",
  "berdsk",

  // --- Красноярский край ---
  "krasnoyarsk",
  "norilsk",
  "achinsk",
  "kansk",
  "zheleznogorsk-krasnoyarsk",

  // --- Новые территории (как ты просил) ---
  "donetsk",
  "makeyevka",
  "mariupol",
  "gorlovka",
  "lugansk",
  "melitopol",
  "berdyansk",
  "kherson",
];

/**
 * “Источники” — откуда чаще строить маршруты (сокращаем, чтобы не было мусора).
 * Чем меньше, тем “чище” 2000 маршрутов.
 */
const ORIGINS: string[] = [
  // хабы
  "moskva",
  "sankt-peterburg",
  "nizhniy-novgorod",
  "kazan",
  "samara",
  "saratov",
  "krasnodar",
  "rostov-na-donu",
  "voronezh",
  "volgograd",
  "kaliningrad",
  "chelyabinsk",
  "novosibirsk",
  "krasnoyarsk",

  // важные региональные центры
  "tula",
  "ryazan",
  "yaroslavl",
  "tver",
  "smolensk",
  "kursk",
  "belgorod",
  "lipetsk",
  "bryansk",
  "vladimir",
  "kaluga",
  "arkhangelsk",
  "cherepovets",
  "astrakhan",
  "sochi",
  "novorossiysk",

  // новые территории
  "donetsk",
  "lugansk",
  "melitopol",
  "kherson",
  "mariupol",
];

/**
 * Приоритетные пары (хиты). Сначала они, потом добиваем до лимита генератором.
 */
const PRIORITY_PAIRS: SeoRoute[] = [
  // “классика”
  { from: "moskva", to: "sankt-peterburg" },
  { from: "moskva", to: "nizhniy-novgorod" },
  { from: "moskva", to: "kazan" },
  { from: "moskva", to: "samara" },
  { from: "moskva", to: "saratov" },
  { from: "moskva", to: "voronezh" },
  { from: "moskva", to: "rostov-na-donu" },
  { from: "moskva", to: "krasnodar" },
  { from: "sankt-peterburg", to: "moskva" },

  // юг / курорты
  { from: "rostov-na-donu", to: "krasnodar" },
  { from: "rostov-na-donu", to: "sochi" },
  { from: "krasnodar", to: "sochi" },
  { from: "krasnodar", to: "anapa" },
  { from: "krasnodar", to: "novorossiysk" },

  // крым
  { from: "rostov-na-donu", to: "simferopol" },
  { from: "krasnodar", to: "simferopol" },
  { from: "krasnodar", to: "sevastopol" },

  // новые территории
  { from: "donetsk", to: "rostov-na-donu" },
  { from: "donetsk", to: "moskva" },
  { from: "donetsk", to: "krasnodar" },
  { from: "lugansk", to: "rostov-na-donu" },
  { from: "lugansk", to: "moskva" },
  { from: "mariupol", to: "taganrog" },
  { from: "mariupol", to: "rostov-na-donu" },
  { from: "melitopol", to: "rostov-na-donu" },
  { from: "kherson", to: "simferopol" },
];

function uniqNonEmpty(xs: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of xs) {
    const v = (x ?? "").trim();
    if (!v) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

const CITY_LIST = uniqNonEmpty(CITIES);
const ORIGIN_LIST = uniqNonEmpty(ORIGINS);

/**
 * Генератор уникальных маршрутов (без дублей, без from===to)
 */
export function buildSeoRoutes(limit = 2000): SeoRoute[] {
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

  // 1) приоритет
  for (const r of PRIORITY_PAIRS) {
    push(r);
    if (out.length >= limit) return out;
  }

  // 2) ORIGINS -> все города
  for (const from of ORIGIN_LIST) {
    for (const to of CITY_LIST) {
      push({ from, to });
      if (out.length >= limit) return out;
    }
  }

  // 3) на всякий случай: города -> города (если вдруг не добили)
  for (const from of CITY_LIST) {
    for (const to of CITY_LIST) {
      push({ from, to });
      if (out.length >= limit) return out;
    }
  }

  return out.slice(0, limit);
}

export function buildSeoRouteUrls(baseUrl: string, limit = 2000): string[] {
  const routes = buildSeoRoutes(limit);
  return routes.map((r) => `${baseUrl}/route/${r.from}/${r.to}`);
}