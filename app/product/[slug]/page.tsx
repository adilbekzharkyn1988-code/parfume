import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { familyColor, brandSlug } from "@/lib/data";
import { fetchProducts, fetchProductBySlug } from "@/contentful/data";
import { absoluteUrl } from "@/lib/site";
import BottleArt from "@/components/BottleArt";
import NotePyramid from "@/components/NotePyramid";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import RichText from "@/components/RichText";
import SeasonalityChart from "@/components/SeasonalityChart";
import AnimatedBar from "@/components/AnimatedBar";
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
  const title = `${product.name} — ${product.brand}`;
  const description = `${product.description} ${product.brand} на распив: оригинал в отливантах 5 и 10 мл. ${product.familyLabel ?? ""} аромат.`;
  const url = `/product/${product.slug}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | JUPARFUME`,
      description,
      url,
      type: "website",
      images: product.image ? [absoluteUrl(product.image)] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | JUPARFUME`,
      description,
    },
  };
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
  const brandHref = `/brand/${brandSlug(product.brand)}`;

  // Product JSON-LD — цена дана диапазоном (5 мл / 10 мл), поэтому
  // используем AggregateOffer с low/highPrice, а не одну фиксированную цену.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: product.description,
    ...(product.image
      ? { image: [/^https?:\/\//.test(product.image) ? product.image : absoluteUrl(product.image)] }
      : {}),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KZT",
      lowPrice: Math.min(product.price5, product.price10),
      highPrice: Math.max(product.price5, product.price10),
      offerCount: 2,
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/product/${product.slug}/`),
    },
    ...(product.reviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviews,
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: genderLabel, item: absoluteUrl(`${genderHref}/`) },
      { "@type": "ListItem", position: 3, name: product.brand, item: absoluteUrl(`${brandHref}/`) },
      { "@type": "ListItem", position: 4, name: product.name, item: absoluteUrl(`/product/${product.slug}/`) },
    ],
  };

  return (
    <main className="container-x py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav className="eyebrow text-stone mb-8 flex flex-wrap items-center gap-2" aria-label="Хлебные крошки">
        <Link href="/" className="hover:text-wine">Главная</Link>
        <span>/</span>
        <Link href={genderHref} className="hover:text-wine">{genderLabel}</Link>
        <span>/</span>
        <Link href={brandHref} className="hover:text-wine">{product.brand}</Link>
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
            <h1 className="font-body font-semibold text-3xl md:text-4xl leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mt-3">
              <Star size={15} className="fill-gold text-gold" />
              <span className="font-mono text-sm">{product.rating}</span>
              <span className="text-sm text-stone">· {product.reviews} отзывов · {product.familyLabel}</span>
            </div>
            <p className="text-ink/70 leading-relaxed mt-4">{product.description}</p>
          </div>

          <ProductPurchasePanel product={product} />

          <div className="grid grid-cols-2 gap-6 pt-2">
            <AnimatedBar value={product.sillage} label="Шлейф" />
            <AnimatedBar value={product.longevity} label="Стойкость" delay={120} />
          </div>

          <div className="md:hidden">
            <SeasonalityChart data={product.seasonality} />
          </div>

        </div>
      </div>

      <div className="hidden md:block mt-10 md:mt-14">
        <SeasonalityChart data={product.seasonality} />
      </div>

      <ProductReviews
        rating={product.rating}
        reviewsCount={product.reviews}
        reviews={product.reviewsList}
      />

      <section className="grid md:grid-cols-2 gap-10 md:gap-14 mt-16 md:mt-20 items-start">
        <div>
          <p className="eyebrow text-wine mb-2">История аромата</p>
          <h2 className="font-display text-2xl md:text-3xl mb-4">Что стоит знать перед покупкой</h2>
          <RichText content={product.story} />
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
