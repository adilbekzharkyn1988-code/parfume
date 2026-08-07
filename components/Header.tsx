"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog/women", label: "Женское" },
  { href: "/catalog/men", label: "Мужское" },
  { href: "/catalog/sets", label: "Наборы" },
  { href: "/articles", label: "Журнал" },
];

type SearchItem = { slug: string; name: string; brand: string };

export default function Header({ searchIndex = [] as SearchItem[] }: { searchIndex?: SearchItem[] }) {
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed.length > 0
    ? searchIndex.filter((p) => p.name.toLowerCase().includes(trimmed)).slice(0, 8)
    : [];

  function toggleSearch() {
    setMenuOpen(false);
    setSearchOpen((v) => !v);
  }

  function toggleMenu() {
    setSearchOpen(false);
    setMenuOpen((v) => !v);
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeSearch();
        setMenuOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white text-ink border-b border-line">
      <div className="container-x grid grid-cols-3 items-center h-16 md:h-[70px]">
        <div className="flex items-center justify-start">
          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            className="p-1 -ml-1"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <Link
          href="/"
          id="site-logo"
          className="font-display text-xl md:text-2xl tracking-tight text-center justify-self-center"
        >
          JUPARFUME
        </Link>

        <div className="flex items-center justify-end gap-4">
          <button
            onClick={toggleSearch}
            aria-label={searchOpen ? "Закрыть поиск" : "Открыть поиск"}
            className="p-1"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          <button
            onClick={openCart}
            className="relative flex items-center p-1"
            aria-label="Открыть корзину"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-wine text-ivory rounded-full text-[10px] w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center font-mono">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* HAMBURGER MENU */}
      {menuOpen && (
        <nav className="border-t border-line bg-white">
          <div className="container-x flex flex-col py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 border-b border-line/60 eyebrow text-ink/85 hover:text-wine transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* SEARCH PANEL */}
      {searchOpen && (
        <div className="border-t border-line bg-white">
          <div className="container-x py-4">
            <div className="relative">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Название аромата..."
                className="w-full rounded-full border border-ink/15 bg-paper pl-10 pr-4 py-3 text-base outline-none focus:border-wine transition-colors"
              />
            </div>

            {trimmed.length > 0 && (
              <div className="mt-3 max-h-80 overflow-y-auto flex flex-col">
                {results.length > 0 ? (
                  results.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/product/${p.slug}`}
                      onClick={closeSearch}
                      className="py-3 border-b border-line/60 flex flex-col hover:text-wine transition-colors"
                    >
                      <span className="font-body font-semibold text-sm">{p.name}</span>
                      <span className="text-xs text-ink/60">{p.brand}</span>
                    </Link>
                  ))
                ) : (
                  <p className="py-4 text-sm text-ink/70">Таких ароматов нет</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
