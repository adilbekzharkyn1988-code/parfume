import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/data";
import BottleArt from "@/components/BottleArt";

export const metadata: Metadata = {
  title: "Журнал ORIGINE — гиды по парфюмерии и трендам",
  description:
    "Статьи о парфюмерии: как устроена ароматическая пирамида, как выбрать объём, тренды сезона и как отличить оригинал от подделки.",
};

export default function ArticlesPage() {
  return (
    <main className="container-x py-12 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow text-wine mb-2">Журнал</p>
        <h1 className="font-display text-4xl md:text-5xl mb-3">Читать и разбираться</h1>
        <p className="text-ink/65 leading-relaxed">
          Гиды по парфюмерии от команды ORIGINE: как устроен аромат, как
          выбрать объём и не ошибиться с подделкой.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/articles/${a.slug}`}
            className="group flex flex-col rounded-md border border-ink/10 overflow-hidden bg-paper"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <BottleArt family={a.cover} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <p className="eyebrow text-stone mb-2">{a.category} · {a.readTime} · {a.date}</p>
              <h2 className="font-display text-xl leading-snug group-hover:text-wine transition-colors">
                {a.title}
              </h2>
              <p className="text-sm text-ink/65 mt-2 line-clamp-3">{a.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
