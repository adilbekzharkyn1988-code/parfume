"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, familyColor } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import BottleArt from "./BottleArt";
import { Heart } from "lucide-react";

export default function BestsellerCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  const c = familyColor[product.family];

  return (
    <div className="group flex flex-col shrink-0 snap-start w-[42%] sm:w-[200px] md:w-[220px]">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden rounded-xl"
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

      <Link href={`/product/${product.slug}`} className="mt-3 flex flex-col gap-1">
        <h3 className="font-display text-base leading-snug line-clamp-2 min-h-[2.6em]">
          {product.brand}
          <br />
          {product.name}
        </h3>
        <p className="eyebrow text-stone text-[10px]">{product.concentration}</p>
        <p className="font-mono text-sm text-ink/80 mt-0.5">
          от {formatPrice(product.price5)}
          <span className="text-ink/45"> / 5мл</span>
        </p>
      </Link>
    </div>
  );
}
