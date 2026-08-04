"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Product } from "@/lib/data";
import ProductCard from "./ProductCard";

type Sort = "alphabet" | "popular" | "price-asc" | "price-desc" | "new";

type PricePreset = "all" | "under-15" | "15-30" | "over-30";

const pricePresets: { value: PricePreset; label: string; test: (price5: number) => boolean }[] = [
  { value: "all", label: "Любая цена", test: () => true },
  { value: "under-15", label: "До 15 000 ₸", test: (p) => p < 15000 },
  { value: "15-30", label: "15 000–30 000 ₸", test: (p) => p >= 15000 && p < 30000 },
  { value: "over-30", label: "От 30 000 ₸", test: (p) => p >= 30000 },
];

export default function CatalogGrid({ products }: { products: Product[] }) {
  return (
    <Suspense fallback={<CatalogGridInner products={products} initialBrand="all" />}>
      <CatalogGridWithParams products={products} />
    </Suspense>
  );
}

function CatalogGridWithParams({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get("brand") ?? "all";
  return <CatalogGridInner products={products} initialBrand={initialBrand} />;
}

function CatalogGridInner({
  products,
  initialBrand,
}: {
  products: Product[];
  initialBrand: string;
}) {
  const [brand, setBrand] = useState<string>(initialBrand);
  const [price, setPrice] = useState<PricePreset>("all");
  const [sort, setSort] = useState<Sort>("alphabet");
  const [brandOpen, setBrandOpen] = useState(false);

  const brandCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0], "ru"));
  }, [products]);

  const filtered = useMemo(() => {
    const priceTest = pricePresets.find((p) => p.value === price)?.test ?? (() => true);
    let list = products.filter(
      (p) => (brand === "all" || p.brand === brand) && priceTest(p.price5)
    );
    list = [...list];
    if (sort === "alphabet") {
      list.sort((a, b) =>
        (a.brand + " " + a.name).localeCompare(b.brand + " " + b.name, "ru")
      );
    } else if (sort === "price-asc") list.sort((a, b) => a.price5 - b.price5);
    else if (sort === "price-desc") list.sort((a, b) => b.price5 - a.price5);
    else if (sort === "new") list.sort((a, b) => (b.badge === "Новинка" ? 1 : 0) - (a.badge === "Новинка" ? 1 : 0));
    else list.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
    return list;
  }, [products, brand, price, sort]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {/* Фильтр по бренду */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setBrandOpen((v) => !v)}
              className={`eyebrow min-h-11 flex items-center gap-1.5 rounded-full px-4 border whitespace-nowrap transition-colors ${
                brand !== "all" ? "bg-ink text-ivory border-ink" : "border-ink/15 text-ink/65 hover:border-ink/40"
              }`}
            >
              {brand === "all" ? "Все бренды" : brand}
              <ChevronDown size={14} className={brandOpen ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>

            {brandOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setBrandOpen(false)} />
                <div className="absolute z-30 mt-2 w-64 max-h-80 overflow-y-auto rounded-xl border border-ink/10 bg-paper shadow-[0_10px_40px_-10px_rgba(28,23,18,0.25)] p-1.5">
                  <button
                    onClick={() => {
                      setBrand("all");
                      setBrandOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                      brand === "all" ? "bg-ink text-ivory" : "hover:bg-ink/5"
                    }`}
                  >
                    <span>Все бренды</span>
                    <span className={brand === "all" ? "text-ivory/60" : "text-ink/40"}>{products.length}</span>
                  </button>
                  {brandCounts.map(([b, count]) => (
                    <button
                      key={b}
                      onClick={() => {
                        setBrand(b);
                        setBrandOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                        brand === b ? "bg-ink text-ivory" : "hover:bg-ink/5"
                      }`}
                    >
                      <span className="truncate">{b}</span>
                      <span className={`shrink-0 ml-2 ${brand === b ? "text-ivory/60" : "text-ink/40"}`}>{count}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Пресеты по цене */}
          {pricePresets.map((p) => (
            <button
              key={p.value}
              onClick={() => setPrice(p.value)}
              className={`eyebrow min-h-11 flex items-center rounded-full px-4 border whitespace-nowrap transition-colors ${
                price === p.value ? "bg-ink text-ivory border-ink" : "border-ink/15 text-ink/65 hover:border-ink/40"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm shrink-0">
          <span className="eyebrow text-stone">Сортировка</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="min-h-11 border border-ink/15 rounded-full px-3.5 bg-paper text-sm font-mono"
          >
            <option value="alphabet">По алфавиту</option>
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
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
