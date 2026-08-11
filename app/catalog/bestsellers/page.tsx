import type { Metadata } from "next";
import CatalogGrid from "@/components/CatalogGrid";
import { fetchProducts } from "@/contentful/data";

export const metadata: Metadata = {
  title: "Хиты продаж — самые популярные ароматы | JUPARFUME",
  description: "Ароматы с наибольшим спросом у покупателей JUPARFUME. Объём 5 и 10 мл.",
  alternates: { canonical: "/catalog/bestsellers/" },
};

export default async function BestsellersPage() {
  const items = (await fetchProducts()).filter((p) => p.badge === "Хит продаж");
  return (
    <main className="container-x py-12 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow text-wine mb-2">Каталог · Хиты продаж</p>
        <h1 className="font-display text-4xl md:text-5xl mb-3">Хиты продаж</h1>
        <p className="text-ink/65 leading-relaxed">
          {items.length} ароматов, которые чаще всего выбирают наши покупатели.
        </p>
      </header>
      <CatalogGrid products={items} />
    </main>
  );
}
