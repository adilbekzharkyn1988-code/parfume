"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { X, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, total } = useCart();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-ink/50 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-paper shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-ink/10">
          <h2 className="font-display text-xl">Корзина</h2>
          <button onClick={closeCart} aria-label="Закрыть корзину">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-stone">
              <p className="font-display text-lg text-ink">Пока пусто</p>
              <p className="text-sm">Загляните в каталог — соберём аромат для настроения.</p>
              <Link
                href="/catalog"
                onClick={closeCart}
                className="mt-3 eyebrow rounded-full px-4 py-2.5 bg-ink text-ivory"
              >
                В каталог
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.slug + item.volume}
                  className="flex items-center justify-between gap-3 pb-4 border-b border-ink/10"
                >
                  <div>
                    <p className="eyebrow text-stone">{item.brand}</p>
                    <p className="font-display text-lg leading-tight">{item.name}</p>
                    <p className="text-xs text-ink/60 mt-0.5">
                      {item.volume} мл · × {item.qty}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-mono text-sm">{formatPrice(item.price * item.qty)}</p>
                    <button
                      onClick={() => removeItem(item.slug, item.volume)}
                      className="text-stone hover:text-wine transition-colors"
                      aria-label={`Убрать ${item.name} из корзины`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-ink/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-stone">Итого</span>
              <span className="font-display text-2xl">{formatPrice(total)}</span>
            </div>
            <button className="eyebrow w-full rounded-full py-3.5 bg-wine text-ivory hover:bg-wine-dark transition-colors">
              Оформить заказ
            </button>
            <p className="text-[11px] text-stone text-center">
              Прототип: оплата и доставка не подключены
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
