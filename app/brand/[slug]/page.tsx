import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBrands, fetchProductsByBrandSlug } from "@/contentful/data";
import { absoluteUrl } from "@/lib/site";
import ProductCard from "@/components/ProductCard";

export async function generateStaticParams() {
  const brands = await fetchBrands();
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brands = await fetchBrands();
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) return {};
  return {
    title: `${brand.name} — купить оригинальную парфюмерию | JUPARFUME`,
    description: `Ароматы ${brand.name}: оригинальная парфюмерия на распив, 5 и 10 мл, с доставкой по Алматы и Казахстану. ${brand.count} ароматов в наличии.`,
    alternates: { canonical: `/brand/${slug}/` },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brands = await fetchBrands();
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) notFound();

  const products = await fetchProductsByBrandSlug(slug);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${brand.name} — JUPARFUME`,
    url: absoluteUrl(`/brand/${slug}/`),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/product/${p.slug}/`),
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Бренды", item: absoluteUrl("/brand/") },
      { "@type": "ListItem", position: 3, name: brand.name, item: absoluteUrl(`/brand/${slug}/`) },
    ],
  };

  return (
    <main className="container-x py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="eyebrow text-stone mb-8 flex flex-wrap items-center gap-2" aria-label="Хлебные крошки">
        <Link href="/" className="hover:text-wine">Главная</Link>
        <span>/</span>
        <Link href="/brand" className="hover:text-wine">Бренды</Link>
        <span>/</span>
        <span className="text-ink">{brand.name}</span>
      </nav>

      <header className="mb-10 max-w-2xl">
        <p className="eyebrow text-wine mb-2">Бренд</p>
        <h1 className="font-display text-4xl md:text-5xl mb-3">{brand.name}</h1>
        <p className="text-ink/65 leading-relaxed">
          Оригинальная парфюмерия {brand.name} на распив — {brand.count}{" "}
          {brand.count === 1 ? "аромат" : "ароматов"} в объёме 5 и 10 мл, с доставкой по Алматы и Казахстану.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </main>
  );
}
