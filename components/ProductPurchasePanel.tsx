"use client";

import { useState } from "react";
import { Product } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { Minus, Plus } from "lucide-react";

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const [volume, setVolume] = useState<"5" | "10">("5");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const unitPrice = volume === "5" ? product.price5 : product.price10;
  const totalPrice = unitPrice * qty;
  const perMl5 = product.price5 / 5;
  const perMl10 = product.price10 / 10;
  const savingsPct = Math.round((1 - perMl10 / perMl5) * 100);

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      addItem({ slug: product.slug, name: product.name, brand: product.brand, volume, price: unitPrice });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="rounded-md border border-ink/12 p-6 md:p-7 bg-paper flex flex-col gap-6">
      <div>
        <p className="eyebrow text-stone mb-2">Выберите объём</p>
        <div className="grid grid-cols-2 gap-3">
          {(["5", "10"] as const).map((v) => {
            const p = v === "5" ? product.price5 : product.price10;
            return (
              <button
                key={v}
                onClick={() => setVolume(v)}
                aria-pressed={volume === v}
                className="rounded-md border px-4 py-3 text-left transition-colors"
                style={{
                  borderColor: volume === v ? "#6E2A3B" : "rgba(28,23,18,0.15)",
                  background: volume === v ? "rgba(110,42,59,0.06)" : "transparent",
                }}
              >
                <p className="font-display text-lg leading-none" style={{ color: "#1C1712" }}>{v} мл</p>
                <p className="font-mono text-sm mt-1.5" style={{ color: "rgba(28,23,18,0.6)" }}>{formatPrice(p)}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="eyebrow text-stone">Количество</p>
        <div className="flex items-center gap-3 border border-ink/15 rounded-full px-2 py-1.5">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Уменьшить количество"
            className="p-1 hover:text-wine transition-colors"
          >
            <Minus size={15} />
          </button>
          <span className="font-mono w-5 text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(9, q + 1))}
            aria-label="Увеличить количество"
            className="p-1 hover:text-wine transition-colors"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      <div className="divider-line" />

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow text-stone mb-1">Итого</p>
          <p className="font-display text-2xl sm:text-3xl whitespace-nowrap">{formatPrice(totalPrice)}</p>
        </div>
        <button
          onClick={handleAdd}
          className="eyebrow rounded-full px-4 py-3 text-[10px] sm:px-7 sm:py-4 sm:text-[11px] bg-wine text-ivory hover:bg-wine-dark transition-colors shrink-0 whitespace-nowrap"
        >
          {added ? "Добавлено ✓" : "Добавить в корзину"}
        </button>
      </div>
      <p className="text-[11px] text-stone -mt-2">
        Прототип: оплата не подключена, оформление демонстрационное
      </p>
    </div>
  );
}
