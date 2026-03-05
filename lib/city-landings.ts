// lib/city-landings.ts

export type CityLanding = {
  /** URL slug, e.g. /moskva */
  slug: string;
  /** Display name (nominative), e.g. Москва */
  name: string;
  /** Genitive for "из ...", e.g. Москвы */
  fromGenitive: string;
  /** Popular destination slugs (5) */
  popularTo: string[];
};

/**
 * Городские лендинги под рекламу/SEO: /moskva, /kazan, ...
 *
 * ВАЖНО: формы падежей — вручную, чтобы Title/H1 звучали по‑русски.
 */
export const CITY_LANDINGS: CityLanding[] = [
  { slug: "moskva", name: "Москва", fromGenitive: "Москвы", popularTo: ["sankt-peterburg", "nizhniy-novgorod", "tver", "tula", "ryazan"] },
  { slug: "sankt-peterburg", name: "Санкт‑Петербург", fromGenitive: "Санкт‑Петербурга", popularTo: ["moskva", "tver", "yaroslavl", "velikiy-novgorod", "pskov"] },
  { slug: "kazan", name: "Казань", fromGenitive: "Казани", popularTo: ["moskva", "nizhniy-novgorod", "cheboksary", "yoshkar-ola", "samara"] },
  { slug: "nizhniy-novgorod", name: "Нижний Новгород", fromGenitive: "Нижнего Новгорода", popularTo: ["moskva", "kazan", "cheboksary", "ivanovo", "yaroslavl"] },
  { slug: "yekaterinburg", name: "Екатеринбург", fromGenitive: "Екатеринбурга", popularTo: ["chelyabinsk", "tyumen", "perm", "ufa", "kazan"] },
  { slug: "samara", name: "Самара", fromGenitive: "Самары", popularTo: ["tolyatti", "kazan", "ufa", "saratov", "volgograd"] },
  { slug: "rostov-na-donu", name: "Ростов‑на‑Дону", fromGenitive: "Ростова‑на‑Дону", popularTo: ["krasnodar", "voronezh", "volgograd", "stavropol", "sochi"] },
  { slug: "krasnodar", name: "Краснодар", fromGenitive: "Краснодара", popularTo: ["sochi", "rostov-na-donu", "anapa", "novorossiysk", "stavropol"] },
  { slug: "voronezh", name: "Воронеж", fromGenitive: "Воронежа", popularTo: ["moskva", "lipetsk", "kursk", "belgorod", "rostov-na-donu"] },
  { slug: "ufa", name: "Уфа", fromGenitive: "Уфы", popularTo: ["kazan", "samara", "chelyabinsk", "perm", "yekaterinburg"] },
  { slug: "chelyabinsk", name: "Челябинск", fromGenitive: "Челябинска", popularTo: ["yekaterinburg", "ufa", "tyumen", "perm", "kazan"] },
  { slug: "perm", name: "Пермь", fromGenitive: "Перми", popularTo: ["yekaterinburg", "ufa", "chelyabinsk", "tyumen", "kazan"] },
  { slug: "volgograd", name: "Волгоград", fromGenitive: "Волгограда", popularTo: ["saratov", "voronezh", "rostov-na-donu", "samara", "krasnodar"] },
  { slug: "saratov", name: "Саратов", fromGenitive: "Саратова", popularTo: ["samara", "volgograd", "kazan", "ufa", "moskva"] },
  { slug: "tyumen", name: "Тюмень", fromGenitive: "Тюмени", popularTo: ["yekaterinburg", "chelyabinsk", "perm", "ufa", "kazan"] },
  { slug: "yaroslavl", name: "Ярославль", fromGenitive: "Ярославля", popularTo: ["moskva", "ivanovo", "kostroma", "tver", "ryazan"] },
  { slug: "tula", name: "Тула", fromGenitive: "Тулы", popularTo: ["moskva", "ryazan", "kaluga", "orel", "kursk"] },
  { slug: "ryazan", name: "Рязань", fromGenitive: "Рязани", popularTo: ["moskva", "tula", "tver", "ivanovo", "kaluga"] },
  { slug: "tver", name: "Тверь", fromGenitive: "Твери", popularTo: ["moskva", "sankt-peterburg", "smolensk", "yaroslavl", "ryazan"] },
  { slug: "ivanovo", name: "Иваново", fromGenitive: "Иваново", popularTo: ["nizhniy-novgorod", "yaroslavl", "moskva", "kostroma", "ryazan"] },
  { slug: "kaluga", name: "Калуга", fromGenitive: "Калуги", popularTo: ["moskva", "tula", "bryansk", "smolensk", "orel"] },
  { slug: "kostroma", name: "Кострома", fromGenitive: "Костромы", popularTo: ["yaroslavl", "ivanovo", "moskva", "nizhniy-novgorod", "tver"] },
  { slug: "belgorod", name: "Белгород", fromGenitive: "Белгорода", popularTo: ["kursk", "voronezh", "moskva", "lipetsk", "orel"] },
  { slug: "kursk", name: "Курск", fromGenitive: "Курска", popularTo: ["belgorod", "orel", "tula", "voronezh", "moskva"] },
  { slug: "bryansk", name: "Брянск", fromGenitive: "Брянска", popularTo: ["moskva", "smolensk", "kaluga", "orel", "kursk"] },
  { slug: "lipetsk", name: "Липецк", fromGenitive: "Липецка", popularTo: ["voronezh", "moskva", "tula", "ryazan", "kursk"] },
  { slug: "orel", name: "Орёл", fromGenitive: "Орла", popularTo: ["tula", "kursk", "bryansk", "kaluga", "moskva"] },
  { slug: "cheboksary", name: "Чебоксары", fromGenitive: "Чебоксар", popularTo: ["kazan", "nizhniy-novgorod", "yoshkar-ola", "samara", "moskva"] },
  { slug: "yoshkar-ola", name: "Йошкар‑Ола", fromGenitive: "Йошкар‑Олы", popularTo: ["kazan", "cheboksary", "nizhniy-novgorod", "samara", "moskva"] },
  { slug: "smolensk", name: "Смоленск", fromGenitive: "Смоленска", popularTo: ["moskva", "tver", "kaluga", "bryansk", "orel"] },
];

export const CITY_BY_SLUG = new Map(CITY_LANDINGS.map((c) => [c.slug, c] as const));
export const CITY_NAME_BY_SLUG = new Map<string, string>([
  ...CITY_LANDINGS.map((c) => [c.slug, c.name] as const),
  // доп. города, которые встречаются в "популярных" направлениях
  ["tolyatti", "Тольятти"],
  ["stavropol", "Ставрополь"],
  ["sochi", "Сочи"],
  ["anapa", "Анапа"],
  ["novorossiysk", "Новороссийск"],
  ["velikiy-novgorod", "Великий Новгород"],
  ["pskov", "Псков"],
]);

export function prettyCityNameFromSlug(slug: string) {
  return CITY_NAME_BY_SLUG.get(slug) ?? slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}
