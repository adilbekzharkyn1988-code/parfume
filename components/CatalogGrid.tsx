"use client";

import { useMemo, useState } from "react";
import { Product, Family, familyColor } from "@/lib/data";
import ProductCard from "./ProductCard";

const familyLabels: Partial<Record<Family, string>> = {
  woody: "Древесные",
  fresh: "Свежие",
  oriental: "Восточные",
  citrus: "Цитрусовые",
  floral: "Цветочные",
  gourmand: "Гурманские",
  musky: "Мускусные",
  spicy: "Пряные",
};

type Sort = "popular" | "price-asc" | "price-desc" | "new";

export default function CatalogGrid({ products }: { products: Product[] }) {
  const [family, setFamily] = useState<Family | "all">("all");
  const [sort, setSort] = useState<Sort>("popular");

  const availableFamilies = useMemo(
    () => Array.from(new Set(products.map((p) => p.family))),
    [products]
  );

  const filtered = useMemo(() => {
    let list = family === "all" ? products : products.filter((p) => p.family === family);
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price5 - b.price5);
    else if (sort === "price-desc") list.sort((a, b) => b.price5 - a.price5);
    else if (sort === "new") list.sort((a, b) => (b.badge === "Новинка" ? 1 : 0) - (a.badge === "Новинка" ? 1 : 0));
    else list.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
    return list;
  }, [products, family, sort]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFamily("all")}
            className={`eyebrow rounded-full px-4 py-2 border transition-colors ${
              family === "all" ? "bg-ink text-ivory border-ink" : "border-ink/15 text-ink/65 hover:border-ink/40"
            }`}
          >
            Все семейства
          </button>
          {availableFamilies.map((f) => (
            <button
              key={f}
              onClick={() => setFamily(f)}
              className={`eyebrow rounded-full px-4 py-2 border transition-colors ${
                family === f ? "text-ivory border-transparent" : "border-ink/15 text-ink/65 hover:border-ink/40"
              }`}
              style={family === f ? { background: familyColor[f].text } : {}}
            >
              {familyLabels[f]}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <span className="eyebrow text-stone">Сортировка</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="border border-ink/15 rounded-full px-3 py-2 bg-paper text-sm font-mono"
          >
            <option value="popular">Популярные</option>
            <option value="new">Сначала новинки</option>
            <option value="price-asc">Дешевле сначала</option>
            <option value="price-desc">Дороже сначала</option>
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="text-stone py-16 text-center">В этой категории пока нет ароматов.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
