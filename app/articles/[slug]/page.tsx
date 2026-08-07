import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { fetchArticles, fetchArticleBySlug, fetchProducts } from "@/contentful/data";
import BottleArt from "@/components/BottleArt";
import ProductCard from "@/components/ProductCard";
import RelatedArticlesSlider from "@/components/RelatedArticlesSlider";
import { toPlainText } from "@/lib/format";

export async function generateStaticParams() {
  const articles = await fetchArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${toPlainText(article.title)} | Журнал JUPARFUME`,
    description: toPlainText(article.excerpt),
  };
}

function isRichTextNode(x: unknown): x is { nodeType: string; data?: unknown; content?: unknown[] } {
  return !!x && typeof x === "object" && typeof (x as any).nodeType === "string";
}

function ArticleBody({ content }: { content: unknown }) {
  if (!content) return null;

  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node: any, children: any) => (
        <p className="text-[17px] leading-[1.75] text-ink/80">{children}</p>
      ),
    },
  };

  if (Array.isArray(content)) {
    // Массив плоских строк — старый формат мок-данных.
    if (content.every((item) => typeof item === "string")) {
      return (
        <>
          {(content as string[]).map((paragraph, i) => (
            <p key={i} className="text-[17px] leading-[1.75] text-ink/80">
              {paragraph}
            </p>
          ))}
        </>
      );
    }

    // Массив rich-text узлов (например, несколько параграфов без общей
    // обёртки "document") — оборачиваем в документ и рендерим одним разом.
    const doc = { nodeType: "document", data: {}, content };
    return (
      <div className="flex flex-col gap-5">
        {documentToReactComponents(doc as any, options)}
      </div>
    );
  }

  // Одиночный rich-text узел, пришедший без обёртки "document"
  // (например, поле содержит один параграф напрямую).
  if (isRichTextNode(content) && content.nodeType !== "document") {
    const doc = { nodeType: "document", data: {}, content: [content] };
    return (
      <div className="flex flex-col gap-5">
        {documentToReactComponents(doc as any, options)}
      </div>
    );
  }

  // Штатный случай: полноценный rich-text документ Contentful.
  return (
    <div className="flex flex-col gap-5">
      {documentToReactComponents(content as any, options)}
    </div>
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = await fetchArticles();
  const related = allArticles.filter((a) => a.slug !== article.slug).slice(0, 2);
  const recommendedProducts = (await fetchProducts()).slice(0, 4);

  return (
    <main>
      <div className="bg-ivory-dim">
        <div className="container-x py-12 md:py-16 max-w-3xl">
          <nav className="eyebrow text-stone mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-wine">Главная</Link>
            <span>/</span>
            <Link href="/articles" className="hover:text-wine">Журнал</Link>
          </nav>
          <p className="eyebrow text-wine mb-3">
            {toPlainText(article.category)} · {toPlainText(article.readTime)} · {toPlainText(article.date)}
          </p>
          <h1 className="font-display text-3xl md:text-5xl leading-tight">{toPlainText(article.title)}</h1>
          <p className="text-ink/65 mt-4 leading-relaxed">{toPlainText(article.excerpt)}</p>
        </div>
      </div>

      <div className="container-x py-10 md:py-14 max-w-3xl">
        <div className="aspect-[21/9] rounded-md overflow-hidden mb-10">
          {article.image ? (
            <img src={article.image} alt={toPlainText(article.title)} className="w-full h-full object-cover" />
          ) : (
            <BottleArt family={article.cover} className="w-full h-full" />
          )}
        </div>

        <article className="flex flex-col gap-5">
          <ArticleBody content={article.content} />
        </article>

        <div className="mt-14 rounded-md bg-white text-ink border border-line p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="eyebrow text-wine mb-2">Подобрать по теме</p>
            <p className="font-display text-2xl">Посмотрите каталог ароматов</p>
          </div>
          <Link
            href="/catalog"
            className="eyebrow rounded-full px-6 py-3.5 bg-ink text-ivory hover:bg-wine transition-colors shrink-0"
          >
            В каталог
          </Link>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <p className="eyebrow text-wine mb-2">Читать также</p>
            <h2 className="font-display text-2xl mb-6">Другие статьи</h2>
            <RelatedArticlesSlider articles={related} />
          </section>
        )}
      </div>

      <section className="container-x pb-16 md:pb-20">
        <p className="eyebrow text-wine mb-2">Из каталога</p>
        <h2 className="font-display text-2xl md:text-3xl mb-8">Может понравиться</h2>
        <div className="grid grid-cols-2 gap-5">
          {recommendedProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
