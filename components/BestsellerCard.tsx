"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, familyColor } from "@/lib/data";
import { formatPrice, stripBrandPrefix } from "@/lib/format";
import BottleArt from "./BottleArt";
import { Heart } from "lucide-react";

export default function BestsellerCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
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
            setLiked((v) => !v);
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
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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
        <h3 className="font-display text-sm md:text-base leading-snug line-clamp-2 min-h-[2.5em]">
          {displayName}
        </h3>
        <p className="eyebrow text-stone text-[10px] mt-1">{product.concentration}</p>
        <p className="font-mono text-sm text-ink/80 mt-0.5">
          {formatPrice(product.price5)}{" "}
          <span className="text-xs text-ink/40">от 5мл</span>
        </p>
      </Link>
    </div>
  );
}
