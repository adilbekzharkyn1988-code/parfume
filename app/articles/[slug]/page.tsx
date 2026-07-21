import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle, products } from "@/lib/data";
import BottleArt from "@/components/BottleArt";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Журнал ORIGINE`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 2);
  const recommendedProducts = products.slice(0, 4);

  return (
    <main>
      <div className="bg-ivory-dim">
        <div className="container-x py-12 md:py-16 max-w-3xl">
          <nav className="eyebrow text-stone mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-wine">Главная</Link>
            <span>/</span>
            <Link href="/articles" className="hover:text-wine">Журнал</Link>
          </nav>
          <p className="eyebrow text-wine mb-3">{article.category} · {article.readTime} · {article.date}</p>
          <h1 className="font-display text-3xl md:text-5xl leading-tight">{article.title}</h1>
          <p className="text-ink/65 mt-4 leading-relaxed">{article.excerpt}</p>
        </div>
      </div>

      <div className="container-x py-10 md:py-14 max-w-3xl">
        <div className="aspect-[21/9] rounded-md overflow-hidden mb-10">
          <BottleArt family={article.cover} className="w-full h-full" />
        </div>

        <article className="flex flex-col gap-5">
          {article.content.map((paragraph, i) => (
            <p key={i} className="text-[17px] leading-[1.75] text-ink/80">
              {paragraph}
            </p>
          ))}
        </article>

        <div className="mt-14 rounded-md bg-ink text-ivory p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="eyebrow text-gold-soft mb-2">Подобрать по теме</p>
            <p className="font-display text-2xl">Посмотрите каталог ароматов</p>
          </div>
          <Link
            href="/catalog"
            className="eyebrow rounded-full px-6 py-3.5 bg-ivory text-ink hover:bg-gold-soft transition-colors shrink-0"
          >
            В каталог
          </Link>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <p className="eyebrow text-wine mb-2">Читать также</p>
            <h2 className="font-display text-2xl mb-6">Другие статьи</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/articles/${a.slug}`}
                  className="group flex flex-col rounded-md border border-ink/10 overflow-hidden bg-paper"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <BottleArt family={a.cover} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <p className="eyebrow text-stone mb-2">{a.category} · {a.readTime}</p>
                    <h3 className="font-display text-lg leading-snug group-hover:text-wine transition-colors">
                      {a.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="container-x pb-16 md:pb-20">
        <p className="eyebrow text-wine mb-2">Из каталога</p>
        <h2 className="font-display text-2xl md:text-3xl mb-8">Может понравиться</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recommendedProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
