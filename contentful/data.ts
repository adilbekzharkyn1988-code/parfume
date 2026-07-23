import { client } from "./client";
import {
  products as fallbackProducts,
  articles as fallbackArticles,
  Product,
  Article,
  Gender,
} from "@/lib/data";

function mapProduct(item: any): Product {
  const f = item.fields;
  const img = f.image?.fields?.file?.url;
  return {
    slug: f.slug,
    name: f.name,
    brand: f.brand,
    gender: f.gender,
    family: f.family,
    familyLabel: f.familyLabel,
    concentration: f.concentration,
    description: f.description,
    story: f.story,
    notes: {
      top: f.notesTop || [],
      heart: f.notesHeart || [],
      base: f.notesBase || [],
    },
    price5: f.price5,
    price10: f.price10,
    rating: f.rating,
    reviews: f.reviews,
    badge: f.badge,
    sillage: f.sillage,
    longevity: f.longevity,
    image: img ? `https:${img}` : undefined,
  } as Product;
}

function mapArticle(item: any): Article {
  const f = item.fields;
  return {
    slug: f.slug,
    title: f.title,
    excerpt: f.excerpt,
    category: f.category,
    readTime: f.readTime,
    date: f.date,
    cover: f.cover,
    content: f.content,
  } as Article;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await client.getEntries({ content_type: "product", limit: 200 });
    if (res.items.length > 0) return res.items.map(mapProduct);
  } catch {}
  return fallbackProducts;
}

export async function fetchProductsByGender(gender: Gender): Promise<Product[]> {
  const all = await fetchProducts();
  return all.filter((p) => p.gender === gender);
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const res = await client.getEntries({ content_type: "product", "fields.slug": slug, limit: 1 } as any);
    if (res.items.length > 0) return mapProduct(res.items[0]);
  } catch {}
  return fallbackProducts.find((p) => p.slug === slug);
}

export async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await client.getEntries({ content_type: "article", limit: 200 });
    if (res.items.length > 0) return res.items.map(mapArticle);
  } catch {}
  return fallbackArticles;
}

export async function fetchArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const res = await client.getEntries({ content_type: "article", "fields.slug": slug, limit: 1 } as any);
    if (res.items.length > 0) return mapArticle(res.items[0]);
  } catch {}
  return fallbackArticles.find((a) => a.slug === slug);
}
