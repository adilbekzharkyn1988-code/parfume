import type { Metadata } from "next";
import CatalogGrid from "@/components/CatalogGrid";
import { getByGender } from "@/lib/data";

export const metadata: Metadata = {
  title: "Женская парфюмерия — оригинальные ароматы 5 и 10 мл | ORIGINE",
  description:
    "Женские нишевые ароматы: цветочные, гурманские и пудровые композиции. Объём 5 и 10 мл, доставка по России.",
};

export default function WomenCatalogPage() {
  const items = getByGender("women");
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
