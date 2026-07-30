import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";

export const metadata: Metadata = {
  title: "Наборы — скоро | JUPARFUME",
  description: "Подарочные наборы ароматов появятся здесь совсем скоро.",
};

export default function SetsCatalogPage() {
  return (
    <main className="container-x py-24 md:py-32 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-ivory-dim flex items-center justify-center mb-6">
        <Gift size={26} className="text-wine" />
      </div>
      <p className="eyebrow text-wine mb-2">Каталог · Наборы</p>
      <h1 className="font-display text-3xl md:text-4xl mb-3">Скоро здесь появятся наборы</h1>
      <p className="text-ink/65 leading-relaxed max-w-md mb-8">
        Мы готовим подборку подарочных наборов ароматов. Загляните позже, а пока
        можно выбрать что-то из полного каталога.
      </p>
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 eyebrow rounded-[10px] px-6 py-4 bg-gold text-ink hover:bg-gold-soft transition-colors"
      >
        Перейти в каталог <ArrowRight size={15} />
      </Link>
    </main>
  );
}
