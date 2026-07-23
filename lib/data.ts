export type Family =
  | "woody"
  | "fresh"
  | "oriental"
  | "citrus"
  | "floral"
  | "gourmand"
  | "musky"
  | "spicy";

export type Gender = "men" | "women" | "unisex";

// НОВЫЙ ТИП ДЛЯ ОТЗЫВОВ (Добавлено)
export type ReviewData = {
  user: string;
  text: string;
  rating: number;
};

export type Product = {
  slug: string;
  brand: string;
  name: string;
  gender: Gender;
  family: Family;
  familyLabel: string;
  concentration: string;
  description: string;
  story: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  price5: number;
  price10: number;
  rating: number;
  reviews: number;
  badge?: "Новинка" | "Хит продаж" | "Ограниченная серия";
  sillage: number; // 1-5
  longevity: number; // 1-5
  image?: any;
  // НОВЫЕ ПОЛЯ ДЛЯ FRAGRANTICA (Добавлено)
  fragranticaRating?: number;
  fragranticaReviews?: ReviewData[];
};

export const familyColor: Record<Family, { base: string; soft: string; text: string }> = {
  woody: { base: "#8A6A3D", soft: "#EFE6D6", text: "#5C4726" },
  fresh: { base: "#3E6E6B", soft: "#DEEDEC", text: "#274746" },
  oriental: { base: "#6E2A3B", soft: "#F2DEE2", text: "#5A2230" },
  citrus: { base: "#8B9A34", soft: "#EDF0D8", text: "#57611F" },
  floral: { base: "#A85C74", soft: "#F5E3E8", text: "#7A3C4C" },
  gourmand: { base: "#B08D57", soft: "#F3E9D8", text: "#7A5F35" },
  musky: { base: "#8A8074", soft: "#EEEAE3", text: "#5B564C" },
  spicy: { base: "#A2472B", soft: "#F0E0D6", text: "#6E3019" },
};

export const products: Product[] = [
  // ---------- MEN ----------
  {
    slug: "noir-cuir",
    brand: "Ombre Rare",
    name: "Noir Cuir",
    gender: "men",
    family: "woody",
    familyLabel: "Древесно-кожаный",
    concentration: "Eau de Parfum",
    description:
      "Тёмный, обволакивающий аромат для тех, кто не любит растворяться в толпе. Кожа и дым кедра держатся весь день.",
    story:
      "Создан парфюмером Ателье Дюпре как посвящение старым скакам и седельным мастерским Прованса. Пряный чёрный перец в открытии уступает место благородной коже и тёплой амбре в шлейфе.",
    notes: {
      top: ["чёрный перец", "бергамот"],
      heart: ["кожа", "табачный лист"],
      base: ["ветивер", "кедр", "амбра"],
    },
    price5: 890,
    price10: 1590,
    rating: 4.8,
    reviews: 132,
    badge: "Хит продаж",
    sillage: 4,
    longevity: 5,
  },
  {
    slug: "mer-atlantique",
    brand: "Fleuve",
    name: "Mer Atlantique",
    gender: "men",
    family: "fresh",
    familyLabel: "Свежий морской",
    concentration: "Eau de Toilette",
    description:
      "Солёный бриз, мокрые камни и грейпфрутовая кожура — аромат раннего утра на побережье Атлантики.",
    story:
      "Парфюмер вдохновлялся рассветными пробежками по бретонскому берегу. В основе — минеральный аккорд морской соли, редкий для нишевой парфюмерии.",
    notes: {
      top: ["морская соль", "грейпфрут"],
      heart: ["инжирный лист", "розмарин"],
      base: ["кедр", "белый мускус"],
    },
    price5: 750,
    price10: 1350,
    rating: 4.6,
    reviews: 89,
    sillage: 3,
    longevity: 3,
  },
  {
    slug: "ambre-tabac",
    brand: "Ambre & Cuir",
    name: "Ambre & Tabac",
    gender: "men",
    family: "oriental",
    familyLabel: "Восточный пряный",
    concentration: "Eau de Parfum",
    description:
      "Густой вечерний аромат с нотами табачных листьев, вымоченных в роме, и тёплой смолистой амброй.",
    story:
      "Аромат родился как эксперимент с абсолютом табака — редким и дорогим сырьём, которое парфюмер выдерживал вместе с бобами тонка почти год.",
    notes: {
      top: ["кардамон", "апельсиновая цедра"],
      heart: ["табак", "какао"],
      base: ["амбра", "бобы тонка", "лабданум"],
    },
    price5: 990,
    price10: 1750,
    rating: 4.9,
    reviews: 204,
    badge: "Хит продаж",
    sillage: 5,
    longevity: 5,
  },
  {
    slug: "citron-vetiver",
    brand: "Lumière",
    name: "Citron Vétiver",
    gender: "men",
    family: "citrus",
    familyLabel: "Цитрусово-древесный",
    concentration: "Eau de Toilette",
    description:
      "Бодрящий и лёгкий, как рубашка изо льна в июльскую жару. Идеален для офиса и первого свидания днём.",
    story:
      "Классическая цитрусовая структура, пересобранная с гаитянским ветивером — чтобы аромат не исчезал через час, как это часто бывает с цитрусами.",
    notes: {
      top: ["лимон", "бергамот", "мята"],
      heart: ["петитгрейн", "герань"],
      base: ["ветивер", "кедр"],
    },
    price5: 690,
    price10: 1250,
    rating: 4.5,
    reviews: 61,
    badge: "Новинка",
    sillage: 2,
    longevity: 3,
  },
  {
    slug: "bois-fume",
    brand: "Ombre Rare",
    name: "Bois Fumé",
    gender: "men",
    family: "woody",
    familyLabel: "Дымно-древесный",
    concentration: "Eau de Parfum",
    description:
      "Костёр на берегу озера, смола хвои и дублёная кожа куртки. Плотный, тёплый и очень стойкий.",
    story:
      "Второй аромат линейки Ombre Rare строится вокруг гваяковой смолы — сырья, которое парфюмеры называют «жидким деревом» за его дымную плотность.",
    notes: {
      top: ["можжевельник", "розовый перец"],
      heart: ["гваяковое дерево", "пачули"],
      base: ["ветивер", "смола лабданума"],
    },
    price5: 950,
    price10: 1690,
    rating: 4.7,
    reviews: 77,
    sillage: 4,
    longevity: 5,
  },
  // ---------- WOMEN ----------
  {
    slug: "fleur-sauvage",
    brand: "Maison Verte",
    name: "Fleur Sauvage",
    gender: "women",
    family: "floral",
    familyLabel: "Зелёно-цветочный",
    concentration: "Eau de Parfum",
    description:
      "Полевой букет сразу после дождя — свежесть зелени и хрупкость белых лепестков без единой капли сладости.",
    story:
      "Парфюмер собирал аромат по мотивам ботанического сада под Греноблем, где растёт коллекция диких пионов и жасмина.",
    notes: {
      top: ["зелёный лист", "бергамот"],
      heart: ["пион", "жасмин"],
      base: ["белый мускус", "кедр"],
    },
    price5: 820,
    price10: 1490,
    rating: 4.7,
    reviews: 156,
    badge: "Хит продаж",
    sillage: 3,
    longevity: 4,
  },
  {
    slug: "rose-imperiale",
    brand: "Lumière",
    name: "Rose Impériale",
    gender: "women",
    family: "floral",
    familyLabel: "Розовый благородный",
    concentration: "Eau de Parfum",
    description:
      "Густая, бархатная роза без пудровой старомодности — для тех, кто носит классику по-своему.",
    story:
      "В основе — редкое болгарское розовое масло, которое собирают вручную на рассвете, пока роса не испарилась с лепестков.",
    notes: {
      top: ["малина", "розовый перец"],
      heart: ["болгарская роза", "пион"],
      base: ["пачули", "амбра"],
    },
    price5: 980,
    price10: 1790,
    rating: 4.9,
    reviews: 241,
    badge: "Хит продаж",
    sillage: 4,
    longevity: 5,
  },
  {
    slug: "vanille-blonde",
    brand: "Ambre & Cuir",
    name: "Vanille Blonde",
    gender: "women",
    family: "gourmand",
    familyLabel: "Гурманский ванильный",
    concentration: "Eau de Parfum",
    description:
      "Тёплая ваниль без приторности — скорее кашемировый плед, чем десерт. Идеален для холодного сезона.",
    story:
      "Мадагаскарская ваниль настаивается вместе с овсяным абсолютом — этот приём даёт эффект «съедобной» текстуры без сахарной ноты.",
    notes: {
      top: ["бергамот", "розовый перец"],
      heart: ["орхидея", "овсяный абсолют"],
      base: ["ваниль", "кашемирское дерево", "мускус"],
    },
    price5: 890,
    price10: 1590,
    rating: 4.8,
    reviews: 173,
    sillage: 4,
    longevity: 5,
  },
  {
    slug: "iris-poudre",
    brand: "Maison Verte",
    name: "Iris Poudré",
    gender: "women",
    family: "floral",
    familyLabel: "Пудрово-ирисовый",
    concentration: "Eau de Parfum",
    description:
      "Холодный, немного отстранённый аромат косметической пудры и фиалкового корня — для минималистов.",
    story:
      "Ирисовый корень выдерживают до пяти лет перед дистилляцией — это одно из самых дорогих сырьё в парфюмерии, и в этом аромате его действительно много.",
    notes: {
      top: ["фиалковый лист", "мандарин"],
      heart: ["ирис", "гелиотроп"],
      base: ["белый мускус", "сандал"],
    },
    price5: 950,
    price10: 1690,
    rating: 4.6,
    reviews: 58,
    badge: "Новинка",
    sillage: 2,
    longevity: 4,
  },
  {
    slug: "peche-jasmin",
    brand: "Fleuve",
    name: "Pêche & Jasmin",
    gender: "women",
    family: "floral",
    familyLabel: "Фруктово-цветочный",
    concentration: "Eau de Toilette",
    description:
      "Сочный персик со шлейфом жасминового чая — лёгкий летний аромат для города и путешествий.",
    story:
      "Аромат посвящён утренним рынкам юга Франции: персики в бумажных пакетах и жасминовый чай в маленьких кафе на площади.",
    notes: {
      top: ["персик", "мандарин"],
      heart: ["жасмин", "цветок апельсина"],
      base: ["белый мускус", "ветивер"],
    },
    price5: 690,
    price10: 1250,
    rating: 4.5,
    reviews: 94,
    sillage: 2,
    longevity: 3,
  },
  // ---------- UNISEX ----------
  {
    slug: "musc-blanc",
    brand: "Ombre Rare",
    name: "Musc Blanc",
    gender: "unisex",
    family: "musky",
    familyLabel: "Чистый мускусный",
    concentration: "Eau de Parfum",
    description:
      "Аромат «чистого белья» — минималистичный, почти невесомый, тот, что носят вместо духов, а не поверх них.",
    story:
      "Собран вокруг четырёх видов синтетического мускуса, каждый из которых отвечает за свой оттенок кожи — от тёплого до прозрачно-холодного.",
    notes: {
      top: ["альдегиды", "цитрусы"],
      heart: ["белый мускус", "ирис"],
      base: ["кедр", "амбретта"],
    },
    price5: 790,
    price10: 1420,
    rating: 4.7,
    reviews: 118,
    sillage: 2,
    longevity: 4,
  },
  {
    slug: "santal-epices",
    brand: "Ambre & Cuir",
    name: "Santal & Épices",
    gender: "unisex",
    family: "spicy",
    familyLabel: "Пряно-сандаловый",
    concentration: "Eau de Parfum",
    description:
      "Кремовый сандал и индийские специи — тёплый, обволакивающий аромат без гендерных границ.",
    story:
      "Майсурский сандал, ставший почти легендой из-за истощения плантаций, здесь дополнен более доступным, но не менее выразительным австралийским сортом.",
    notes: {
      top: ["кардамон", "розовый перец"],
      heart: ["сандал", "гвоздика"],
      base: ["амбра", "бобы тонка"],
    },
    price5: 1050,
    price10: 1890,
    rating: 4.9,
    reviews: 187,
    badge: "Ограниченная серия",
    sillage: 4,
    longevity: 5,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getByGender = (gender: Gender) => products.filter((p) => p.gender === gender);
export const bestsellers = () => products.filter((p) => p.badge === "Хит продаж");
export const newArrivals = () => products.filter((p) => p.badge === "Новинка");

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  cover: Family;
  content: string[];
};

export const articles: Article[] = [
  {
    slug: "aromaticheskaya-piramida",
    title: "Топ, сердце и база: как устроена ароматическая пирамида",
    excerpt: "Почему один и тот же парфюм пахнет по-разному утром и вечером — разбираемся в структуре ароматов.",
    category: "Основы",
    readTime: "5 мин",
    date: "2024-03-20",
    cover: "woody",
    content: ["Текст статьи..."],
  },
];
