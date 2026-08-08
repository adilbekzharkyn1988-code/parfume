import type { Metadata } from "next";
import Link from "next/link";
import { fetchBrands } from "@/contentful/data";

export const metadata: Metadata = {
  title: "Бренды нишевой парфюмерии",
  description:
    "Все парфюмерные дома в каталоге JUPARFUME: оригинальная нишевая парфюмерия на распив, 5 и 10 мл, с доставкой по Алматы и Казахстану.",
  alternates: { canonical: "/brand/" },
};

export default async function BrandIndexPage() {
  const brands = await fetchBrands();

  return (
    <main className="container-x py-12 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow text-wine mb-2">Бренды</p>
        <h1 className="font-display text-4xl md:text-5xl mb-3">Парфюмерные дома</h1>
        <p className="text-ink/65 leading-relaxed">
          {brands.length} брендов нишевой и селективной парфюмерии — оригиналы на распив,
          5 и 10 мл.
        </p>
      </header>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {brands.map((b) => (
          <li key={b.slug}>
            <Link
              href={`/brand/${b.slug}`}
              className="block rounded-md border border-line px-4 py-3 hover:border-wine transition-colors"
            >
              <span className="font-body">{b.name}</span>
              <span className="block text-xs text-stone mt-0.5">{b.count} ароматов</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
