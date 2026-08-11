import type { Metadata } from "next";
import CatalogGrid from "@/components/CatalogGrid";
import { fetchProducts } from "@/contentful/data";

export const metadata: Metadata = {
  title: "Наш выбор — рекомендации JUPARFUME",
  description: "Подборка ароматов, которые рекомендует команда JUPARFUME.",
  alternates: { canonical: "/catalog/pick/" },
};

export default async function OurPickPage() {
  const all = await fetchProducts();
  // Пока нет отдельного поля "рекомендуем" в Contentful — берём ароматы
  // без бейджей "Хит продаж"/"Новинка", чтобы не дублировать другие подборки.
  const items = all.filter((p) => p.badge !== "Хит продаж" && p.badge !== "Новинка");
  return (
    <main className="container-x py-12 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow text-wine mb-2">Каталог · Наш выбор</p>
        <h1 className="font-display text-4xl md:text-5xl mb-3">Наш выбор</h1>
        <p className="text-ink/65 leading-relaxed">
          {items.length} ароматов, которые рекомендует команда JUPARFUME.
        </p>
      </header>
      <CatalogGrid products={items} />
    </main>
  );
}
