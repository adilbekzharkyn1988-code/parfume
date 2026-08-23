import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
  const title = `${toPlainText(article.title)} — Журнал JUPARFUME`;
  const description = toPlainText(article.excerpt);
  const url = `/articles/${slug}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | JUPARFUME`, description, url, type: "article" },
    twitter: { card: "summary_large_image", title: `${title} | JUPARFUME`, description },
  };
}

function isRichTextNode(x: unknown): x is { nodeType: string; data?: unknown; content?: unknown[] } {
  return !!x && typeof x === "object" && typeof (x as any).nodeType === "string";
}

// Пытаемся угадать пол по заголовку/категории статьи ("Мужские ароматы 2026",
// "женская парфюмерия" и т.п.), чтобы рекомендовать релевантные товары,
// а не просто первые 4 по алфавиту.
function detectGenderHint(title: string, category: string): "men" | "women" | null {
  const text = `${title} ${category}`.toLowerCase();
  if (/женск/.test(text)) return "women";
  if (/мужск/.test(text)) return "men";
  return null;
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
  const articleCategory = toPlainText(article.category);
  // Сначала статьи той же категории (напр. "Гид парфюмерии"), остальные —
  // в качестве добора, если в категории меньше двух других статей.
  const sameCategoryArticles = allArticles.filter(
    (a) => a.slug !== article.slug && toPlainText(a.category) === articleCategory
  );
  const otherArticles = allArticles.filter(
    (a) => a.slug !== article.slug && toPlainText(a.category) !== articleCategory
  );
  const related = [...sameCategoryArticles, ...otherArticles].slice(0, 2);

  const allProducts = await fetchProducts();
  const genderHint = detectGenderHint(toPlainText(article.title), articleCategory);
  // Сначала товары той же группы ароматов (cover совпадает с family),
  // затем сужаем по полу, если он угадан из заголовка/категории.
  // На каждом шаге, если товаров получилось меньше 4, откатываемся
  // к более широкому пулу — блок "Может понравиться" никогда не должен
  // оказаться пустым или урезанным без необходимости.
  const sameFamily = allProducts.filter((p) => p.family === article.cover);
  const sameFamilyAndGender = genderHint
    ? sameFamily.filter((p) => p.gender === genderHint || p.gender === "unisex")
    : sameFamily;
  const productPool =
    sameFamilyAndGender.length >= 4
      ? sameFamilyAndGender
      : sameFamily.length >= 4
      ? sameFamily
      : allProducts;
  const recommendedProducts = [...productPool]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

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
        <div className="relative aspect-[21/9] rounded-md overflow-hidden mb-10">
          {article.image ? (
            <Image
              src={article.image}
              alt={toPlainText(article.title)}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
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
