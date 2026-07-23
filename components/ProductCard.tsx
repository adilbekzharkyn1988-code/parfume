"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, familyColor } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import BottleArt from "./BottleArt";
import { Star } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const [volume, setVolume] = useState<"5" | "10">("5");
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const c = familyColor[product.family];

  const price = volume === "5" ? product.price5 : product.price10;
  const perMl5 = product.price5 / 5;
  const perMl10 = product.price10 / 10;
  const savingsPct = Math.round((1 - perMl10 / perMl5) * 100);

  function handleAdd() {
    addItem({ slug: product.slug, name: product.name, brand: product.brand, volume, price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="group flex flex-col rounded-md border border-ink/10 bg-paper overflow-hidden transition-shadow hover:shadow-[0_8px_28px_-12px_rgba(28,23,18,0.35)]">
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
            <h3 className="font-display text-xl leading-tight mt-0.5 hover:text-wine transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-1 text-xs text-stone">
          <Star size={13} className="fill-gold text-gold" />
          <span className="font-mono">{product.rating}</span>
          <span>· {product.reviews} отзывов</span>
        </div>

        <p className="text-sm text-ink/70 leading-snug line-clamp-2">{product.description}</p>

        <div className="mt-auto pt-2 flex flex-col gap-3">
          <div className="flex rounded-full border border-ink/15 p-0.5 w-fit">
            {(["5", "10"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVolume(v)}
                aria-pressed={volume === v}
                className="px-3 py-1 rounded-full text-xs font-mono transition-colors"
                style={{
                  background: volume === v ? "#1C1712" : "transparent",
                  color: volume === v ? "#F6F1E9" : "#1C1712",
                  opacity: volume === v ? 1 : 0.6,
                }}
              >
                {v} мл
              </button>
            ))}
          </div>

          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="font-display text-lg leading-none">{formatPrice(price)}</p>
              {volume === "10" && (
                <p className="text-[11px] text-sage mt-1">
                  выгода {savingsPct}% за мл
                </p>
              )}
            </div>
            <button
              onClick={handleAdd}
              className="eyebrow rounded-full px-4 py-2.5 bg-wine text-ivory hover:bg-wine-dark transition-colors whitespace-nowrap"
            >
              {added ? "Добавлено ✓" : "В корзину"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
