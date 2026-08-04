import type { Metadata } from "next";
import CatalogGrid from "@/components/CatalogGrid";
import { fetchProducts } from "@/contentful/data";

export const metadata: Metadata = {
  title: "Новинки — новые ароматы в каталоге | JUPARFUME",
  description: "Свежие поступления в каталоге JUPARFUME. Объём 5 и 10 мл.",
};

export default async function NewArrivalsPage() {
  const items = (await fetchProducts()).filter((p) => p.badge === "Новинка");
  return (
    <main className="container-x py-12 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow text-sage mb-2">Каталог · Новинки</p>
        <h1 className="font-display text-4xl md:text-5xl mb-3">Новинки</h1>
        <p className="text-ink/65 leading-relaxed">
          {items.length} ароматов, которые только что появились в каталоге.
        </p>
      </header>
      <CatalogGrid products={items} />
    </main>
  );
}
