export type CityLanding = {
  slug: string;
  name: string;
  fromGenitive: string;
  popularTo: string[];
};

type RegionKey =
  | "center"
  | "northwest"
  | "volga"
  | "south"
  | "caucasus"
  | "ural"
  | "siberia"
  | "far-east"
  | "crimea";

type RawCity = {
  slug: string;
  name: string;
  fromGenitive: string;
  region: RegionKey;
};

const NATIONAL_HUBS = [
  "moskva",
  "sankt-peterburg",
  "nizhniy-novgorod",
  "kazan",
  "yekaterinburg",
  "krasnodar",
  "novosibirsk",
] as const;

const REGION_HUBS: Record<RegionKey, string[]> = {
  center: ["moskva", "voronezh", "yaroslavl", "belgorod", "smolensk"],
  northwest: ["sankt-peterburg", "kaliningrad", "arkhangelsk", "vologda", "murmansk"],
  volga: ["nizhniy-novgorod", "kazan", "samara", "saratov", "kirov"],
  south: ["rostov-na-donu", "krasnodar", "volgograd", "sochi", "astrakhan"],
  caucasus: ["pyatigorsk", "mineralnye-vody", "makhachkala", "grozny", "vladikavkaz"],
  ural: ["yekaterinburg", "chelyabinsk", "tyumen", "ufa", "perm"],
  siberia: ["novosibirsk", "omsk", "krasnoyarsk", "irkutsk", "tomsk"],
  "far-east": ["khabarovsk", "vladivostok", "yakutsk", "blagoveshchensk", "chita"],
  crimea: ["simferopol", "sevastopol", "yalta", "kerch", "krasnodar"],
};

const REGION_NEIGHBORS: Record<RegionKey, RegionKey[]> = {
  center: ["northwest", "volga", "south"],
  northwest: ["center", "volga"],
  volga: ["center", "ural", "south"],
  south: ["caucasus", "center", "volga", "crimea"],
  caucasus: ["south", "crimea"],
  ural: ["volga", "siberia"],
  siberia: ["ural", "far-east"],
  "far-east": ["siberia"],
  crimea: ["south", "caucasus"],
};

const RAW_CITIES: RawCity[] = [
  { slug: "moskva", name: "Москва", fromGenitive: "Москвы", region: "center" },
  { slug: "sankt-peterburg", name: "Санкт-Петербург", fromGenitive: "Санкт-Петербурга", region: "northwest" },
  { slug: "nizhniy-novgorod", name: "Нижний Новгород", fromGenitive: "Нижнего Новгорода", region: "volga" },
  { slug: "kazan", name: "Казань", fromGenitive: "Казани", region: "volga" },
  { slug: "yekaterinburg", name: "Екатеринбург", fromGenitive: "Екатеринбурга", region: "ural" },
  { slug: "samara", name: "Самара", fromGenitive: "Самары", region: "volga" },
  { slug: "ufa", name: "Уфа", fromGenitive: "Уфы", region: "ural" },
  { slug: "perm", name: "Пермь", fromGenitive: "Перми", region: "ural" },
  { slug: "chelyabinsk", name: "Челябинск", fromGenitive: "Челябинска", region: "ural" },
  { slug: "tyumen", name: "Тюмень", fromGenitive: "Тюмени", region: "ural" },
  { slug: "omsk", name: "Омск", fromGenitive: "Омска", region: "siberia" },
  { slug: "novosibirsk", name: "Новосибирск", fromGenitive: "Новосибирска", region: "siberia" },
  { slug: "tomsk", name: "Томск", fromGenitive: "Томска", region: "siberia" },
  { slug: "kemerovo", name: "Кемерово", fromGenitive: "Кемерово", region: "siberia" },
  { slug: "novokuznetsk", name: "Новокузнецк", fromGenitive: "Новокузнецка", region: "siberia" },
  { slug: "barnaul", name: "Барнаул", fromGenitive: "Барнаула", region: "siberia" },
  { slug: "krasnoyarsk", name: "Красноярск", fromGenitive: "Красноярска", region: "siberia" },
  { slug: "irkutsk", name: "Иркутск", fromGenitive: "Иркутска", region: "siberia" },
  { slug: "ulan-ude", name: "Улан-Удэ", fromGenitive: "Улан-Удэ", region: "far-east" },
  { slug: "chita", name: "Чита", fromGenitive: "Читы", region: "far-east" },
  { slug: "khabarovsk", name: "Хабаровск", fromGenitive: "Хабаровска", region: "far-east" },
  { slug: "vladivostok", name: "Владивосток", fromGenitive: "Владивостока", region: "far-east" },
  { slug: "yakutsk", name: "Якутск", fromGenitive: "Якутска", region: "far-east" },
  { slug: "blagoveshchensk", name: "Благовещенск", fromGenitive: "Благовещенска", region: "far-east" },
  { slug: "rostov-na-donu", name: "Ростов-на-Дону", fromGenitive: "Ростова-на-Дону", region: "south" },
  { slug: "krasnodar", name: "Краснодар", fromGenitive: "Краснодара", region: "south" },
  { slug: "sochi", name: "Сочи", fromGenitive: "Сочи", region: "south" },
  { slug: "anapa", name: "Анапа", fromGenitive: "Анапы", region: "south" },
  { slug: "novorossiysk", name: "Новороссийск", fromGenitive: "Новороссийска", region: "south" },
  { slug: "stavropol", name: "Ставрополь", fromGenitive: "Ставрополя", region: "south" },
  { slug: "pyatigorsk", name: "Пятигорск", fromGenitive: "Пятигорска", region: "caucasus" },
  { slug: "mineralnye-vody", name: "Минеральные Воды", fromGenitive: "Минеральных Вод", region: "caucasus" },
  { slug: "volgograd", name: "Волгоград", fromGenitive: "Волгограда", region: "south" },
  { slug: "saratov", name: "Саратов", fromGenitive: "Саратова", region: "volga" },
  { slug: "voronezh", name: "Воронеж", fromGenitive: "Воронежа", region: "center" },
  { slug: "belgorod", name: "Белгород", fromGenitive: "Белгорода", region: "center" },
  { slug: "kursk", name: "Курск", fromGenitive: "Курска", region: "center" },
  { slug: "bryansk", name: "Брянск", fromGenitive: "Брянска", region: "center" },
  { slug: "smolensk", name: "Смоленск", fromGenitive: "Смоленска", region: "center" },
  { slug: "kaluga", name: "Калуга", fromGenitive: "Калуги", region: "center" },
  { slug: "tula", name: "Тула", fromGenitive: "Тулы", region: "center" },
  { slug: "ryazan", name: "Рязань", fromGenitive: "Рязани", region: "center" },
  { slug: "orel", name: "Орёл", fromGenitive: "Орла", region: "center" },
  { slug: "lipetsk", name: "Липецк", fromGenitive: "Липецка", region: "center" },
  { slug: "tver", name: "Тверь", fromGenitive: "Твери", region: "center" },
  { slug: "yaroslavl", name: "Ярославль", fromGenitive: "Ярославля", region: "center" },
  { slug: "ivanovo", name: "Иваново", fromGenitive: "Иваново", region: "center" },
  { slug: "kostroma", name: "Кострома", fromGenitive: "Костромы", region: "center" },
  { slug: "vladimir", name: "Владимир", fromGenitive: "Владимира", region: "center" },
  { slug: "tambov", name: "Тамбов", fromGenitive: "Тамбова", region: "center" },
  { slug: "penza", name: "Пенза", fromGenitive: "Пензы", region: "volga" },
  { slug: "ulyanovsk", name: "Ульяновск", fromGenitive: "Ульяновска", region: "volga" },
  { slug: "saransk", name: "Саранск", fromGenitive: "Саранска", region: "volga" },
  { slug: "cheboksary", name: "Чебоксары", fromGenitive: "Чебоксар", region: "volga" },
  { slug: "yoshkar-ola", name: "Йошкар-Ола", fromGenitive: "Йошкар-Олы", region: "volga" },
  { slug: "kirov", name: "Киров", fromGenitive: "Кирова", region: "volga" },
  { slug: "izhevsk", name: "Ижевск", fromGenitive: "Ижевска", region: "ural" },
  { slug: "naberezhnye-chelny", name: "Набережные Челны", fromGenitive: "Набережных Челнов", region: "volga" },
  { slug: "tolyatti", name: "Тольятти", fromGenitive: "Тольятти", region: "volga" },
  { slug: "orenburg", name: "Оренбург", fromGenitive: "Оренбурга", region: "ural" },
  { slug: "magnitogorsk", name: "Магнитогорск", fromGenitive: "Магнитогорска", region: "ural" },
  { slug: "surgut", name: "Сургут", fromGenitive: "Сургута", region: "ural" },
  { slug: "nizhnevartovsk", name: "Нижневартовск", fromGenitive: "Нижневартовска", region: "ural" },
  { slug: "arkhangelsk", name: "Архангельск", fromGenitive: "Архангельска", region: "northwest" },
  { slug: "murmansk", name: "Мурманск", fromGenitive: "Мурманска", region: "northwest" },
  { slug: "petrozavodsk", name: "Петрозаводск", fromGenitive: "Петрозаводска", region: "northwest" },
  { slug: "pskov", name: "Псков", fromGenitive: "Пскова", region: "northwest" },
  { slug: "velikiy-novgorod", name: "Великий Новгород", fromGenitive: "Великого Новгорода", region: "northwest" },
  { slug: "vologda", name: "Вологда", fromGenitive: "Вологды", region: "northwest" },
  { slug: "cherepovets", name: "Череповец", fromGenitive: "Череповца", region: "northwest" },
  { slug: "kaliningrad", name: "Калининград", fromGenitive: "Калининграда", region: "northwest" },
  { slug: "astrakhan", name: "Астрахань", fromGenitive: "Астрахани", region: "south" },
  { slug: "makhachkala", name: "Махачкала", fromGenitive: "Махачкалы", region: "caucasus" },
  { slug: "derbent", name: "Дербент", fromGenitive: "Дербента", region: "caucasus" },
  { slug: "grozny", name: "Грозный", fromGenitive: "Грозного", region: "caucasus" },
  { slug: "nalchik", name: "Нальчик", fromGenitive: "Нальчика", region: "caucasus" },
  { slug: "vladikavkaz", name: "Владикавказ", fromGenitive: "Владикавказа", region: "caucasus" },
  { slug: "maikop", name: "Майкоп", fromGenitive: "Майкопа", region: "caucasus" },
  { slug: "elista", name: "Элиста", fromGenitive: "Элисты", region: "south" },
  { slug: "taganrog", name: "Таганрог", fromGenitive: "Таганрога", region: "south" },
  { slug: "volzhsky", name: "Волжский", fromGenitive: "Волжского", region: "south" },
  { slug: "kurgan", name: "Курган", fromGenitive: "Кургана", region: "ural" },
  { slug: "syktyvkar", name: "Сыктывкар", fromGenitive: "Сыктывкара", region: "northwest" },
  { slug: "nizhny-tagil", name: "Нижний Тагил", fromGenitive: "Нижнего Тагила", region: "ural" },
  { slug: "sevastopol", name: "Севастополь", fromGenitive: "Севастополя", region: "crimea" },
  { slug: "simferopol", name: "Симферополь", fromGenitive: "Симферополя", region: "crimea" },
  { slug: "yalta", name: "Ялта", fromGenitive: "Ялты", region: "crimea" },
  { slug: "kerch", name: "Керчь", fromGenitive: "Керчи", region: "crimea" },
  { slug: "abakan", name: "Абакан", fromGenitive: "Абакана", region: "siberia" },
  { slug: "bratsk", name: "Братск", fromGenitive: "Братска", region: "siberia" },
  { slug: "biysk", name: "Бийск", fromGenitive: "Бийска", region: "siberia" },
  { slug: "novy-urengoy", name: "Новый Уренгой", fromGenitive: "Нового Уренгоя", region: "ural" },
  { slug: "salekhard", name: "Салехард", fromGenitive: "Салехарда", region: "ural" },
  { slug: "orsk", name: "Орск", fromGenitive: "Орска", region: "ural" },
  { slug: "sterlitamak", name: "Стерлитамак", fromGenitive: "Стерлитамака", region: "ural" },
  { slug: "salavat", name: "Салават", fromGenitive: "Салавата", region: "ural" },
  { slug: "miass", name: "Миасс", fromGenitive: "Миасса", region: "ural" },
  { slug: "zlatoust", name: "Златоуст", fromGenitive: "Златоуста", region: "ural" },
  { slug: "kamensk-uralskiy", name: "Каменск-Уральский", fromGenitive: "Каменска-Уральского", region: "ural" },
  { slug: "berezniki", name: "Березники", fromGenitive: "Березников", region: "ural" },
  { slug: "khanty-mansiysk", name: "Ханты-Мансийск", fromGenitive: "Ханты-Мансийска", region: "ural" },
  { slug: "nefteyugansk", name: "Нефтеюганск", fromGenitive: "Нефтеюганска", region: "ural" },
  { slug: "severodvinsk", name: "Северодвинск", fromGenitive: "Северодвинска", region: "northwest" },
  { slug: "kotlas", name: "Котлас", fromGenitive: "Котласа", region: "northwest" },
  { slug: "dzerzhinsk", name: "Дзержинск", fromGenitive: "Дзержинска", region: "volga" },
  { slug: "engels", name: "Энгельс", fromGenitive: "Энгельса", region: "volga" },
  { slug: "balakovo", name: "Балаково", fromGenitive: "Балаково", region: "volga" },
  { slug: "nizhnekamsk", name: "Нижнекамск", fromGenitive: "Нижнекамска", region: "volga" },
  { slug: "angarsk", name: "Ангарск", fromGenitive: "Ангарска", region: "siberia" },
  { slug: "donetsk", name: "Донецк", fromGenitive: "Донецка", region: "south" },
  { slug: "makeyevka", name: "Макеевка", fromGenitive: "Макеевки", region: "south" },
  { slug: "gorlovka", name: "Горловка", fromGenitive: "Горловки", region: "south" },
  { slug: "mariupol", name: "Мариуполь", fromGenitive: "Мариуполя", region: "south" },
  { slug: "lugansk", name: "Луганск", fromGenitive: "Луганска", region: "south" },
  { slug: "melitopol", name: "Мелитополь", fromGenitive: "Мелитополя", region: "south" },
  { slug: "berdyansk", name: "Бердянск", fromGenitive: "Бердянска", region: "south" },
  { slug: "kherson", name: "Херсон", fromGenitive: "Херсона", region: "south" },
];

function uniqueSlugs(items: string[], selfSlug: string, known: Set<string>) {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const item of items) {
    if (!item || item === selfSlug || !known.has(item) || seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }

  return out;
}

function buildPopularTo(city: RawCity, cities: RawCity[]) {
  const known = new Set(cities.map((item) => item.slug));
  const sameRegion = cities.filter((item) => item.region === city.region).map((item) => item.slug);
  const neighborRegions = REGION_NEIGHBORS[city.region].flatMap((region) =>
    cities.filter((item) => item.region === region).map((item) => item.slug)
  );

  const candidates = uniqueSlugs(
    [
      ...sameRegion,
      ...REGION_HUBS[city.region],
      ...neighborRegions,
      ...NATIONAL_HUBS,
    ],
    city.slug,
    known
  );

  return candidates.slice(0, 24);
}

export const CITY_LANDINGS: CityLanding[] = RAW_CITIES.map((city) => ({
  slug: city.slug,
  name: city.name,
  fromGenitive: city.fromGenitive,
  popularTo: buildPopularTo(city, RAW_CITIES),
}));

export const CITY_BY_SLUG = new Map(CITY_LANDINGS.map((city) => [city.slug, city] as const));

export const CITY_NAME_BY_SLUG = new Map<string, string>(
  CITY_LANDINGS.map((city) => [city.slug, city.name] as const)
);

export const CITY_REGION_BY_SLUG = new Map<string, string>(
  RAW_CITIES.map((city) => [city.slug, city.region] as const)
);

export function prettyCityNameFromSlug(slug: string) {
  return (
    CITY_NAME_BY_SLUG.get(slug) ??
    slug
      .split("-")
      .filter(Boolean)
      .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
      .join(" ")
  );
}


export function getAllRouteTargets(fromSlug: string) {
  return CITY_LANDINGS.filter((city) => city.slug !== fromSlug).map((city) => city.slug);
}

export function isValidCitySlug(slug: string) {
  return CITY_BY_SLUG.has(slug);
}

export function isValidRouteSlugs(fromSlug: string, toSlug: string) {
  return fromSlug !== toSlug && CITY_BY_SLUG.has(fromSlug) && CITY_BY_SLUG.has(toSlug);
}
