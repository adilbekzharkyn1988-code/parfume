"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, familyColor } from "@/lib/data";
import { formatPrice, stripBrandPrefix } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import BottleArt from "./BottleArt";
import StarRating from "./StarRating";
import { Heart } from "lucide-react";

export default function BestsellerCard({ product }: { product: Product }) {
  const { toggleFavorite, isFavorited } = useCart();
  const liked = isFavorited(product.slug);
  const c = familyColor[product.family];
  const displayName = stripBrandPrefix(product.name, product.brand);

  return (
    <div className="group flex flex-col shrink-0 snap-start w-[48%] sm:w-[230px] md:w-[250px] bg-white rounded-xl overflow-hidden shadow-[0_2px_14px_-6px_rgba(28,23,18,0.18)]">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden"
        style={{ background: c.soft }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite({
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              price5: product.price5,
              price10: product.price10,
            });
          }}
          aria-label={liked ? "Убрать из избранного" : "В избранное"}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-paper/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
        >
          <Heart
            size={16}
            className={liked ? "fill-wine text-wine" : "text-ink/60"}
          />
        </button>

        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 48vw, (max-width: 768px) 230px, 250px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <BottleArt
            family={product.family}
            className="w-full h-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
      </Link>

      <Link href={`/product/${product.slug}`} className="p-3 flex flex-col gap-0.5">
        <p className="text-xs text-ink/55 tracking-wide truncate">{product.brand}</p>
        <h3 className="font-body font-semibold text-sm md:text-base leading-snug line-clamp-2 min-h-[2.5em]">
          {displayName}
        </h3>
        <StarRating rating={product.rating} size={12} className="mt-1" />
        <p className="font-body font-semibold text-sm text-ink/80 mt-0.5">
          {formatPrice(product.price5)}{" "}
          <span className="font-normal text-xs text-ink/40">от 5мл</span>
        </p>
      </Link>
    </div>
  );
}
