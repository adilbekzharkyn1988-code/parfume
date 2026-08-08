import type { MetadataRoute } from "next";
import { fetchProducts, fetchArticles } from "@/contentful/data";
import { absoluteUrl } from "@/lib/site";

// Обязательно для output: "export" — иначе Next.js не знает, что этот
// маршрут можно сгенерировать статически при сборке.
export const dynamic = "force-static";

// Next.js сам конвертирует это в статический sitemap.xml при сборке
// (`next build` с output: "export") — никакого отдельного скрипта не
// нужно. Каждый новый товар/статья из Contentful попадёт в sitemap
// автоматически на следующей сборке, руками ничего дописывать не надо.
//
// Новую СТРАНИЦУ (не товар и не статью, а отдельный раздел вроде нового
// лендинга) нужно будет добавить сюда одной строкой вручную — это
// единственный случай, когда требуется правка.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([fetchProducts(), fetchArticles()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/catalog/"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/catalog/men/"), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/catalog/women/"), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/catalog/sets/"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/catalog/new/"), changeFrequency: "daily", priority: 0.7 },
    { url: absoluteUrl("/catalog/bestsellers/"), changeFrequency: "daily", priority: 0.7 },
    { url: absoluteUrl("/catalog/pick/"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/articles/"), changeFrequency: "weekly", priority: 0.6 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: absoluteUrl(`/product/${p.slug}/`),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: absoluteUrl(`/articles/${a.slug}/`),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
