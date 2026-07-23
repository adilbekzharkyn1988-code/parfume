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

// НОВЫЙ ТИП ДЛЯ ОТЗЫВОВ
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
  // НОВЫЕ ПОЛЯ ДЛЯ FRAGRANTICA
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
  // ПРИМЕР ТОВАРА С ОТЗЫВАМИ
  {
    slug: "noir-cuir",
    brand: "Ombre Rare",
    name: "Noir Cuir",
    gender: "men",
    family: "woody",
    familyLabel: "Древесно-кожаный",
    concentration: "Eau de Parfum",
    description: "Тёмный, обволакивающий аромат...",
    story: "Создан парфюмером...",
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
    // Добавьте это:
    fragranticaRating: 4.25,
    fragranticaReviews: [
      {
        user: "Alex1988",
        text: "Очень глубокий и стойкий аромат кожи. Напоминает старые мастерские.",
        rating: 5
      }
    ]
  },
  // ... остальные ваши товары
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getByGender = (gender: Gender) => products.filter((p) => p.gender === gender);
export const bestsellers = () => products.filter((p) => p.badge === "Хит продаж");
export const newArrivals = () => products.filter((p) => p.badge === "Новинка");
