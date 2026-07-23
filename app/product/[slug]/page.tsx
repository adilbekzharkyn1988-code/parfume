import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { familyColor } from "@/lib/data";
import { fetchProducts, fetchProductBySlug } from "@/contentful/data";
import BottleArt from "@/components/BottleArt";
import NotePyramid from "@/components/NotePyramid";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import ProductCard from "@/components/ProductCard";
import FragranticaReviews from "@/components/FragranticaReviews"; // 1. Импорт компонента
import { Star } from "lucide-react";

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.brand} | ORIGINE`,
    description: `${product.description} Объём 5 и 10 мл. ${product.familyLabel} аромат от ${product.brand}.`,
  };
}

function Bar({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="eyebrow text-stone">{label}</span>
        <span className="font-mono text-xs text-stone">{value}/5</span>
      </div>
      <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden">
        <div className="h-full bg-wine rounded-full" style={{ width: `${(value / 5) * 100}%` }} />
      </div>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const c = familyColor[product.family];
  const allProducts = await fetchProducts();
  const related = allProducts
    .filter((p) => p.slug !== product.slug && (p.family === product.family || p.gender === product.gender))
    .slice(0, 4);

  const genderLabel = product.gender === "men" ? "Мужское" : product.gender === "women" ? "Женское" : "Унисекс";
  const genderHref = product.gender === "men" ? "/catalog/men" : product.gender === "women" ? "/catalog/women" : "/catalog";

  return (
    <main className="container-x py-10 md:py-14">
      <nav className="eyebrow text-stone mb-8 flex flex-wrap items-center gap-2" aria-label="Хлебные крошки">
        <Link href="/" className="hover:text-wine">Главная</Link>
        <span>/</span>
        <Link href={genderHref} className="hover:text-wine">{genderLabel}</Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 md:gap-14">
        <div
          className="rounded-md overflow-hidden aspect-[4/5] relative"
          style={{ background: c.soft }}
        >
          {product.badge && (
            <span
              className="absolute top-4 left-4 z-10 eyebrow px-3 py-1.5 rounded-full text-ivory"
              style={{ background: c.text }}
            >
              {product.badge}
            </span>
          )}
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <BottleArt family={product.family} className="w-full h-full" />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="eyebrow text-wine mb-2">{product.brand} · {product.concentration}</p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mt-3">
              <Star size={15} className="fill-gold text-gold" />
              <span className="font-mono text-sm">{product.rating}</span>
              <span className="text-sm text-stone">· {product.reviews} отзывов · {product.familyLabel}</span>
            </div>
            <p className="text-ink/70 leading-relaxed mt-4">{product.description}</p>
          </div>

          <ProductPurchasePanel product={product} />

          <div className="grid grid-cols-2 gap-6 pt-2">
            <Bar value={product.sillage} label="Шлейф" />
            <Bar value={product.longevity} label="Стойкость" />
          </div>

          {/* 2. Добавление блока отзывов Fragrantica здесь */}
          <FragranticaReviews 
            rating={product.fragranticaRating} 
            reviews={product.fragranticaReviews} 
          />
        </div>
      </div>

      <section className="grid md:grid-cols-2 gap-10 md:gap-14 mt-16 md:mt-20 items-start">
        <div>
          <p className="eyebrow text-wine mb-2">История аромата</p>
          <h2 className="font-display text-2xl md:text-3xl mb-4">Что стоит знать перед покупкой</h2>
          <p className="text-ink/70 leading-relaxed">{product.story}</p>
        </div>
        <div className="bg-ivory-dim rounded-md p-6 md:p-8">
          <p className="eyebrow text-stone mb-5 text-center">Пирамида нот</p>
          <NotePyramid notes={product.notes} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16 md:mt-20">
          <p className="eyebrow text-wine mb-2">Вам может понравиться</p>
          <h2 className="font-display text-2xl md:text-3xl mb-8">Похожие ароматы</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
