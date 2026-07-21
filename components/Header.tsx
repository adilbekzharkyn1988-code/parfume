"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog/women", label: "Женское" },
  { href: "/catalog/men", label: "Мужское" },
  { href: "/articles", label: "Журнал" },
];

export default function Header() {
  const { count, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-ink text-ivory border-b border-line-light">
      <div className="container-x flex items-center justify-between h-16 md:h-[70px]">
        <Link href="/" className="font-display text-2xl tracking-tight">
          ORIGINE
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="eyebrow text-ivory/75 hover:text-gold-soft transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 eyebrow text-ivory/90 hover:text-gold-soft transition-colors"
            aria-label="Открыть корзину"
          >
            <ShoppingBag size={19} />
            <span className="hidden sm:inline">Корзина</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-wine text-ivory rounded-full text-[10px] w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center font-mono">
                {count}
              </span>
            )}
          </button>
          <button
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Открыть меню"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-line-light bg-ink">
          <div className="container-x flex flex-col py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 border-b border-line-light/60 eyebrow text-ivory/85"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
