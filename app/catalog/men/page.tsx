import type { Metadata } from "next";
import CatalogGrid from "@/components/CatalogGrid";
import { fetchProductsByGender } from "@/contentful/data";

export const metadata: Metadata = {
  title: "Мужская парфюмерия — оригинальные ароматы 5 и 10 мл",
  description:
    "Мужская нишевая парфюмерия на распив: древесные, кожаные, свежие и восточные ароматы. Оригинал, 5 и 10 мл, доставка по Алматы и Казахстану.",
  alternates: { canonical: "/catalog/men/" },
  openGraph: {
    title: "Мужская парфюмерия — оригинальные ароматы 5 и 10 мл | JUPARFUME",
    description:
      "Мужская нишевая парфюмерия на распив: древесные, кожаные, свежие и восточные ароматы. Оригинал, 5 и 10 мл, доставка по Алматы и Казахстану.",
    url: "/catalog/men/",
    type: "website",
  },
};

export default async function MenCatalogPage() {
  const items = await fetchProductsByGender("men");
  return (
    <main className="container-x py-12 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow text-wine mb-2">Каталог · Мужское</p>
        <h1 className="font-display text-4xl md:text-5xl mb-3">Мужская парфюмерия</h1>
        <p className="text-ink/65 leading-relaxed">
          {items.length} ароматов — от свежих цитрусовых до плотных кожаных
          и дымных древесных композиций для вечера.
        </p>
      </header>
      <CatalogGrid products={items} />
    </main>
  );
}
