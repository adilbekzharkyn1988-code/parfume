import {
  products as fallbackProducts,
  articles as fallbackArticles,
  Product,
  Article,
  Gender,
  brandSlug,
} from "@/lib/data";

/**
 * ВАЖНО: этот файл больше НЕ ходит в Contentful напрямую.
 *
 * Данные читаются из локального contentful/cache.json, который
 * генерируется вручную командой `npm run sync:contentful`
 * (см. scripts/sync-contentful.ts) — тогда обычный `next build`
 * (даже сотни раз в день во время разработки) не делает ни одного
 * запроса к Contentful.
 *
 * Если cache.json ещё не сгенерирован (например, при первом клоне
 * репозитория до первого запуска sync), используются моковые данные
 * из lib/data.ts — билд никогда не падает из-за отсутствия кэша или сети.
 */

type Cache = {
  generatedAt: string;
  products: Product[];
  articles: Article[];
};

let cache: Cache | null = null;

function loadCache(): Cache | null {
  if (cache) return cache;
  try {
    // require вместо import — файл может отсутствовать до первого sync,
    // и мы не хотим, чтобы сборка падала на этапе резолва модулей.
    cache = require("./cache.json") as Cache;
  } catch {
    cache = null;
  }
  return cache;
}

export async function fetchProducts(): Promise<Product[]> {
  const c = loadCache();
  if (c && c.products.length > 0) return c.products;
  return fallbackProducts;
}

export async function fetchProductsByGender(gender: Gender): Promise<Product[]> {
  const all = await fetchProducts();
  return all.filter((p) => p.gender === gender || p.gender === "unisex");
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await fetchProducts();
  return all.find((p) => p.slug === slug);
}

export type Brand = { slug: string; name: string; count: number };

// Список брендов выводится из товаров на лету (в Contentful бренд —
// не отдельная сущность, а строковое поле товара) — поэтому просто
// группируем и считаем, без похода за отдельным контент-типом.
export async function fetchBrands(): Promise<Brand[]> {
  const all = await fetchProducts();
  const map = new Map<string, Brand>();
  for (const p of all) {
    const slug = brandSlug(p.brand);
    const existing = map.get(slug);
    if (existing) existing.count += 1;
    else map.set(slug, { slug, name: p.brand, count: 1 });
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "ru"));
}

export async function fetchProductsByBrandSlug(slug: string): Promise<Product[]> {
  const all = await fetchProducts();
  return all.filter((p) => brandSlug(p.brand) === slug);
}

export async function fetchArticles(): Promise<Article[]> {
  const c = loadCache();
  if (c && c.articles.length > 0) return c.articles;
  return fallbackArticles;
}

export async function fetchArticleBySlug(slug: string): Promise<Article | undefined> {
  const all = await fetchArticles();
  return all.find((a) => a.slug === slug);
}
