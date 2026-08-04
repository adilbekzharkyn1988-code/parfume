/**
 * Шаг 1 из 2: генерирует data/bulk-import.json — черновик отзывов и
 * "разделов" (badge) для ВСЕХ товаров сразу, на основе текущего
 * contentful/cache.json.
 *
 * Ничего никуда не отправляет — только создаёт файл, который можно
 * открыть и поправить руками (тексты, рейтинги, badge) перед тем как
 * реально залить это в Contentful скриптом push-to-contentful.ts.
 *
 * Запуск:
 *   npm run generate:bulk
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { stripBrandPrefix } from "../lib/format";

type CacheProduct = {
  slug: string;
  name: string;
  brand: string;
  family: string;
  badge?: "Новинка" | "Хит продаж" | "Ограниченная серия";
  notes?: { top?: string[]; heart?: string[]; base?: string[] };
  reviewsList?: { user: string; text: string; rating: number }[];
};

const cachePath = resolve(__dirname, "../contentful/cache.json");
if (!existsSync(cachePath)) {
  console.error("Не найден contentful/cache.json. Сначала запустите npm run sync:contentful.");
  process.exit(1);
}

const cache = JSON.parse(require("fs").readFileSync(cachePath, "utf-8"));
const products: CacheProduct[] = cache.products;

// Кириллические имена/города — под аудиторию РК
const authors = [
  "Айгерим", "Данияр", "Мадина", "Ержан", "Салтанат", "Нурлан", "Диана",
  "Тимур", "Асель", "Бекзат", "Жанна", "Арман", "Гульнара", "Санжар",
  "Алия", "Ержан", "Камила", "Дмитрий", "Виктория", "Максим", "Оксана",
];

const positiveOpeners = [
  "Заказывала для себя, очень довольна.",
  "Долго выбирал между несколькими вариантами, не пожалел.",
  "Первое впечатление — сдержанно, но раскрывается прекрасно.",
  "Уже не первый заказ у JUPARFUME, качество стабильно хорошее.",
  "Взяла 5мл попробовать, теперь думаю о полном флаконе.",
  "Аромат держится весь день, это большой плюс.",
  "Подарили на день рождения — восторг, спрашивают, что это.",
  "Брал в подарок, но в итоге забрал половину себе.",
];

const noteMentions = (p: CacheProduct) => {
  const all = [...(p.notes?.top ?? []), ...(p.notes?.heart ?? []), ...(p.notes?.base ?? [])];
  if (all.length === 0) return "";
  const pick = all[Math.floor(Math.random() * all.length)];
  const templates = [
    `Особенно чувствуется ${pick.toLowerCase()} — это то, что подкупает.`,
    `Нота ${pick.toLowerCase()} раскрывается не сразу, но именно за неё аромат и любят.`,
    `${pick} звучит очень благородно, не приторно.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

const closers = [
  "Доставка быстрая, упаковка аккуратная.",
  "Стойкость и шлейф — на уровне оригинала.",
  "Буду заказывать ещё, рекомендую.",
  "Цена за объём приятно удивила.",
  "Единственный минус — хочется сразу большой флакон.",
  "Подходит и на день, и на вечер.",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRating() {
  // Преимущественно 4-5, изредка 3 — выглядит правдоподобнее, чем сплошные 5.
  const roll = Math.random();
  if (roll < 0.55) return 5;
  if (roll < 0.9) return 4;
  return 3;
}

function generateReview(p: CacheProduct) {
  const author = authors[randomInt(0, authors.length - 1)];
  const opener = positiveOpeners[randomInt(0, positiveOpeners.length - 1)];
  const noteLine = noteMentions(p);
  const closer = closers[randomInt(0, closers.length - 1)];
  const text = [opener, noteLine, closer].filter(Boolean).join(" ");
  return { author, rating: randomRating(), text };
}

const output = products.map((p) => {
  const existing = p.reviewsList ?? [];
  const need = Math.max(0, randomInt(3, 5) - existing.length);
  const generated = Array.from({ length: need }, () => generateReview(p));
  return {
    slug: p.slug,
    name: `${p.brand} ${stripBrandPrefix(p.name, p.brand)}`.trim(),
    // Текущее значение раздела — поправьте вручную на "Хит продаж",
    // "Новинка", "Ограниченная серия" или null, если раздел не нужен.
    badge: p.badge ?? null,
    // Уже существующие в Contentful отзывы не трогаем и не дублируем —
    // здесь только те, что скрипт push-to-contentful.ts должен ДОБАВИТЬ.
    reviewsToAdd: generated,
  };
});

const outPath = resolve(__dirname, "../data/bulk-import.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");

const totalReviews = output.reduce((s, p) => s + p.reviewsToAdd.length, 0);
console.log(
  `[generate-bulk-content] готово: ${output.length} товаров, ${totalReviews} новых отзывов -> data/bulk-import.json`
);
console.log("Откройте файл, поправьте тексты/рейтинги/badge при желании, затем запустите: npm run push:contentful");
