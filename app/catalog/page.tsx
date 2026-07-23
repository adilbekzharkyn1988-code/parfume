import type { Metadata } from "next";
import CatalogGrid from "@/components/CatalogGrid";
import { fetchProducts } from "@/contentful/data";

export const metadata: Metadata = {
  title: "Каталог ароматов — мужская и женская парфюмерия | ORIGINE",
  description:
    "Весь каталог оригинальной нишевой парфюмерии ORIGINE: мужские, женские и унисекс ароматы в объёмах 5 и 10 мл.",
};

export default async function CatalogPage() {
  const products = await fetchProducts();
  return (
    <main className="container-x py-12 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow text-wine mb-2">Каталог</p>
        <h1 className="font-display text-4xl md:text-5xl mb-3">Все ароматы</h1>
        <p className="text-ink/65 leading-relaxed">
          {products.length} ароматов от независимых парфюмерных домов.
          Выбирайте объём 5 или 10 мл прямо в карточке — цена пересчитается
          автоматически.
        </p>
      </header>
      <CatalogGrid products={products} />
    </main>
  );
}
