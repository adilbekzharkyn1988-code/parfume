/**
 * Синхронизация данных из Contentful в локальный файл-кэш.
 *
 * Запускается ТОЛЬКО вручную, когда контент в Contentful реально поменялся:
 *   npm run sync:contentful
 *
 * Обычный `next build` / `next dev` в Contentful НЕ ходит — он читает
 * уже готовый contentful/cache.json (см. contentful/data.ts).
 *
 * Скрипт делает ровно 3 сетевых запроса к Contentful независимо от того,
 * сколько у вас товаров и статей:
 *   1. все продукты (content_type "product")
 *   2. все отзывы (content_type "review") — одним запросом, а не по одному на товар
 *   3. все статьи (content_type "article")
 */

import { createClient } from "contentful";
import { writeFileSync } from "fs";
import { resolve } from "path";

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "e8y2nngpr6yc";
const accessToken =
  process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ||
  "upNLkRBWF2F3B_I_LkpJsd09KxfJh7_N2G2Fp_awRxY";

const client = createClient({ space: spaceId, accessToken });

function richTextToPlain(doc: any): string {
  if (!doc || typeof doc !== "object") return doc || "";
  if (!doc.content) return "";
  return doc.content
    .map((node: any) => (node.content || []).map((c: any) => c.value || "").join(""))
    .join(" ")
    .trim();
}

function mapProduct(item: any) {
  const f = item.fields;
  const imgItem = Array.isArray(f.image) ? f.image[0] : f.image;
  const img = imgItem?.fields?.file?.url;
  return {
    id: item.sys.id,
    slug: f.slug,
    name: f.name,
    brand: f.brand,
    gender: f.gender,
    family: f.family,
    familyLabel: f.familyLabel,
    concentration: f.concentration,
    description: richTextToPlain(f.description),
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
    seasonality: f.seasonality,
  };
}

function mapReview(item: any) {
  const f = item.fields;
  return {
    productId: f.product?.sys?.id,
    user: f.author,
    text: richTextToPlain(f.text) || f.text,
    rating: f.rating,
  };
}

function mapArticle(item: any) {
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
  };
}

async function main() {
  console.log(`[sync-contentful] space=${spaceId} — начинаю синхронизацию...`);

  const [productsRes, reviewsRes, articlesRes] = await Promise.all([
    client.getEntries({ content_type: "product", limit: 1000 }),
    client.getEntries({ content_type: "review", limit: 1000 } as any),
    client.getEntries({ content_type: "article", limit: 1000 }),
  ]);

  const reviewsByProduct = new Map<string, any[]>();
  for (const r of reviewsRes.items.map(mapReview)) {
    if (!r.productId) continue;
    const list = reviewsByProduct.get(r.productId) || [];
    list.push({ user: r.user, text: r.text, rating: r.rating });
    reviewsByProduct.set(r.productId, list);
  }

  const products = productsRes.items.map(mapProduct).map((p) => {
    const reviewsList = reviewsByProduct.get(p.id) || [];
    const merged = { ...p, reviewsList } as any;
    delete merged.id;
    if (reviewsList.length > 0) {
      merged.reviews = reviewsList.length;
      merged.rating = Number(
        (reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length).toFixed(1)
      );
    }
    return merged;
  });
  products.sort((a, b) => a.name.localeCompare(b.name));

  const articles = articlesRes.items.map(mapArticle);

  const cache = {
    generatedAt: new Date().toISOString(),
    products,
    articles,
  };

  const outPath = resolve(__dirname, "../contentful/cache.json");
  writeFileSync(outPath, JSON.stringify(cache, null, 2), "utf-8");

  console.log(
    `[sync-contentful] готово: ${products.length} товаров, ${articles.length} статей -> contentful/cache.json`
  );
}

main().catch((err) => {
  console.error("[sync-contentful] ошибка синхронизации:", err);
  process.exit(1);
});
