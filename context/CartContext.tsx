"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// volume === null означает, что позиция попала в корзину через «избранное»
// (нажатие на сердечко) и объём для неё ещё не выбран. Оформить заказ,
// пока в корзине есть такие позиции, нельзя.
export type CartItem = {
  slug: string;
  name: string;
  brand: string;
  volume: "5" | "10" | null;
  price5: number;
  price10: number;
  qty: number;
};

export type FavoriteProduct = {
  slug: string;
  name: string;
  brand: string;
  price5: number;
  price10: number;
};

// Цена за выбранный объём. null — если объём ещё не выбран (позиция из избранного).
export function getUnitPrice(item: CartItem): number | null {
  if (item.volume === "5") return item.price5;
  if (item.volume === "10") return item.price10;
  return null;
}

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // Обычное добавление в корзину с уже выбранным объёмом (со страницы товара) — открывает корзину.
  addItem: (product: FavoriteProduct, volume: "5" | "10", qty?: number) => void;
  // Клик по сердечку: добавляет/убирает позицию БЕЗ объёма, корзину не открывает.
  toggleFavorite: (product: FavoriteProduct) => void;
  isFavorited: (slug: string) => boolean;
  // Выбор объёма прямо в корзине для позиции, добавленной через избранное.
  setItemVolume: (slug: string, volume: "5" | "10") => void;
  removeItem: (slug: string, volume: "5" | "10" | null) => void;
  clearCart: () => void;
  total: number;
  count: number;
  // Сколько позиций всё ещё ждут выбора объёма.
  pendingCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: FavoriteProduct, volume: "5" | "10", qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug && i.volume === volume);
      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug && i.volume === volume ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          price5: product.price5,
          price10: product.price10,
          volume,
          qty,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const toggleFavorite = useCallback((product: FavoriteProduct) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug && i.volume === null);
      if (existing) {
        // повторный клик по сердечку — убираем из корзины
        return prev.filter((i) => !(i.slug === product.slug && i.volume === null));
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          price5: product.price5,
          price10: product.price10,
          volume: null,
          qty: 1,
        },
      ];
    });
    // Корзину намеренно НЕ открываем — товар просто "оседает" в ней.
  }, []);

  const isFavorited = useCallback(
    (slug: string) => items.some((i) => i.slug === slug && i.volume === null),
    [items]
  );

  const setItemVolume = useCallback((slug: string, volume: "5" | "10") => {
    setItems((prev) => {
      const pendingIndex = prev.findIndex((i) => i.slug === slug && i.volume === null);
      if (pendingIndex === -1) return prev;
      const pendingItem = prev[pendingIndex];

      // Если в корзине уже есть эта же позиция с таким объёмом — сливаем количество.
      const matchIndex = prev.findIndex((i) => i.slug === slug && i.volume === volume);
      if (matchIndex !== -1) {
        return prev
          .map((i, idx) => (idx === matchIndex ? { ...i, qty: i.qty + pendingItem.qty } : i))
          .filter((_, idx) => idx !== pendingIndex);
      }

      return prev.map((i, idx) => (idx === pendingIndex ? { ...i, volume } : i));
    });
  }, []);

  const removeItem = useCallback((slug: string, volume: "5" | "10" | null) => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.volume === volume)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, i) => {
    const price = getUnitPrice(i);
    return price ? sum + price * i.qty : sum;
  }, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const pendingCount = items.reduce((sum, i) => sum + (i.volume === null ? i.qty : 0), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        toggleFavorite,
        isFavorited,
        setItemVolume,
        removeItem,
        clearCart,
        total,
        count,
        pendingCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
