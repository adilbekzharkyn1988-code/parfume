import { client } from "./client";
import {
  productsQuery,
  productBySlugQuery,
  articlesQuery,
  articleBySlugQuery,
} from "./queries";
import {
  products as fallbackProducts,
  articles as fallbackArticles,
  Product,
  Article,
  Gender,
} from "@/lib/data";

export async function fetchProducts(): Promise<Product[]> {
  try {
    const data = await client.fetch<Product[]>(productsQuery);
    if (data && data.length > 0) return data;
  } catch {}
  return fallbackProducts;
}

export async function fetchProductsByGender(gender: Gender): Promise<Product[]> {
  const all = await fetchProducts();
  return all.filter((p) => p.gender === gender);
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const data = await client.fetch<Product | null>(productBySlugQuery, { slug });
    if (data) return data;
  } catch {}
  return fallbackProducts.find((p) => p.slug === slug);
}

export async function fetchArticles(): Promise<Article[]> {
  try {
    const data = await client.fetch<Article[]>(articlesQuery);
    if (data && data.length > 0) return data;
  } catch {}
  return fallbackArticles;
}

export async function fetchArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const data = await client.fetch<Article | null>(articleBySlugQuery, { slug });
    if (data) return data;
  } catch {}
  return fallbackArticles.find((a) => a.slug === slug);
}
