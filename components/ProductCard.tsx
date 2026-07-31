"use client";

import Link from "next/link";
import { Product, familyColor } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import BottleArt from "./BottleArt";
import StarRating from "./StarRating";

export default function ProductCard({ product }: { product: Product }) {
  const c = familyColor[product.family];

  return (
    <div className="group flex flex-col rounded-lg bg-white overflow-hidden shadow-[0_2px_14px_-6px_rgba(28,23,18,0.18)] hover:shadow-[0_8px_28px_-12px_rgba(28,23,18,0.35)] transition-shadow">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden"
        style={{ background: c.soft }}
      >
        {product.badge && (
          <span
            className="absolute top-3 left-3 z-10 eyebrow px-2.5 py-1 rounded-full text-ivory"
            style={{ background: c.text }}
          >
            {product.badge}
          </span>
        )}
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

      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <div>
          <p className="eyebrow text-stone">{product.brand} · {product.familyLabel}</p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-body font-semibold text-lg leading-tight mt-0.5 hover:text-wine transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-1 text-xs text-stone">
          <StarRating rating={product.rating} size={13} />
          <span>· {product.reviews} отзывов</span>
        </div>

        <p className="mt-auto pt-2 font-body font-bold text-2xl leading-none">
          от {formatPrice(product.price5)}
        </p>
      </div>
    </div>
  );
}
