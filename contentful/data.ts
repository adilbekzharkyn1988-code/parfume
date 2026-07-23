import { client } from "./client";
import {
  products as fallbackProducts,
  articles as fallbackArticles,
  Product,
  Article,
  Gender,
} from "@/lib/data";

function richTextToPlain(doc: any): string {
  if (!doc || typeof doc !== "object") return doc || "";
  if (!doc.content) return "";
  return doc.content
    .map((node: any) =>
      (node.content || []).map((c: any) => c.value || "").join("")
    )
    .join(" ")
    .trim();
}

function mapProduct(item: any): Product {
  const f = item.fields;
  const imgItem = Array.isArray(f.image) ? f.image[0] : f.image;
  const img = imgItem?.fields?.file?.url;
  return {
    slug: f.slug,
    name: f.name,
    brand: f.brand,
    gender: f.gender,
    family: f.family,
    familyLabel: f.familyLabel,
    concentration: f.concentration,
    description: richTextToPlain(f.description),
    story: richTextToPlain(f.story),
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

function mapReview(item: any): import("@/lib/data").ReviewData {
  const f = item.fields;
  return {
    user: f.author,
    text: richTextToPlain(f.text) || f.text,
    rating: f.rating,
  };
}

async function fetchReviewsForProduct(productId: string) {
  try {
    const res = await client.getEntries({
      content_type: "review",
      "fields.product.sys.id": productId,
      order: "-fields.date" as any,
      limit: 50,
    } as any);
    return res.items.map(mapReview);
  } catch {
    return [];
  }
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
    if (res.items.length > 0) {
      return res.items.map(mapProduct).sort((a, b) => a.name.localeCompare(b.name));
    }
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
    if (res.items.length > 0) {
      const product = mapProduct(res.items[0]);
      product.reviewsList = await fetchReviewsForProduct(res.items[0].sys.id);
      return product;
    }
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
