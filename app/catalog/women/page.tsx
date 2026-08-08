import type { Metadata } from "next";
import CatalogGrid from "@/components/CatalogGrid";
import { fetchProductsByGender } from "@/contentful/data";

export const metadata: Metadata = {
  title: "Женская парфюмерия — оригинальные ароматы 5 и 10 мл | JUPARFUME",
  description:
    "Женская нишевая парфюмерия на распив: цветочные, гурманские и пудровые ароматы. Оригинал, 5 и 10 мл, доставка по Алматы и Казахстану.",
};

export default async function WomenCatalogPage() {
  const items = await fetchProductsByGender("women");
  return (
    <main className="container-x py-12 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow text-wine mb-2">Каталог · Женское</p>
        <h1 className="font-display text-4xl md:text-5xl mb-3">Женская парфюмерия</h1>
        <p className="text-ink/65 leading-relaxed">
          {items.length} ароматов — от лёгких цветочных букетов до тёплых
          гурманских композиций для холодного сезона.
        </p>
      </header>
      <CatalogGrid products={items} />
    </main>
  );
}
