/**
 * Шаг 2 из 2: заливает data/bulk-import.json в Contentful ОДНИМ прогоном —
 * для каждого товара выставляет badge (раздел) и создаёт недостающие
 * отзывы (продукт → review, связь по полю "product").
 *
 * В отличие от sync-contentful.ts (который только ЧИТАЕТ), этот скрипт
 * ПИШЕТ в Contentful, поэтому нужен отдельный токен с правом записи —
 * Content Management API token (НЕ тот же, что Content Delivery API).
 * Получить: Contentful → Settings → API keys → Content management tokens
 * → Generate personal token.
 *
 * .env.local:
 *   CONTENTFUL_MANAGEMENT_TOKEN=...
 *
 * Запуск:
 *   npm run push:contentful
 *
 * После завершения обязательно прогоните:
 *   npm run sync:contentful
 * чтобы новые данные попали в contentful/cache.json и на сайт.
 */

import { createClient } from "contentful-management";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT || "master";

if (!spaceId || !managementToken) {
  console.error(
    "\n❌ Не заданы NEXT_PUBLIC_CONTENTFUL_SPACE_ID и/или CONTENTFUL_MANAGEMENT_TOKEN.\n" +
      "   Добавьте CONTENTFUL_MANAGEMENT_TOKEN в .env.local (Content Management API token,\n" +
      "   НЕ Content Delivery API token — они разные, второй только читает).\n"
  );
  process.exit(1);
}

type BulkItem = {
  slug: string;
  name: string;
  badge: "Новинка" | "Хит продаж" | "Ограниченная серия" | null;
  reviewsToAdd: { author: string; rating: number; text: string }[];
};

const importPath = resolve(__dirname, "../data/bulk-import.json");
if (!existsSync(importPath)) {
  console.error("Не найден data/bulk-import.json. Сначала запустите: npm run generate:bulk");
  process.exit(1);
}
const items: BulkItem[] = JSON.parse(readFileSync(importPath, "utf-8"));

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const client = createClient(
    { accessToken: managementToken! },
    { type: "plain", defaults: { spaceId: spaceId!, environmentId } }
  );

  const locales = await client.locale.getMany({});
  const locale = (locales.items.find((l) => l.default) ?? locales.items[0])?.code ?? "en-US";

  // Проверяем тип поля "text" у content type "review" — RichText требует
  // документ, а не голую строку.
  const reviewContentType = await client.contentType.get({ contentTypeId: "review" }).catch(() => null);
  const textFieldIsRichText =
    reviewContentType?.fields.find((f) => f.id === "text")?.type === "RichText";

  function toTextField(plain: string) {
    if (!textFieldIsRichText) return plain;
    return {
      nodeType: "document",
      data: {},
      content: [
        {
          nodeType: "paragraph",
          data: {},
          content: [{ nodeType: "text", value: plain, marks: [], data: {} }],
        },
      ],
    };
  }

  let updatedProducts = 0;
  let createdReviews = 0;
  let skipped = 0;

  for (const item of items) {
    const found = await client.entry.getMany({
      query: { content_type: "product", "fields.slug": item.slug, limit: 1 },
    });

    const productEntry = found.items[0];
    if (!productEntry) {
      console.warn(`⚠ Товар не найден в Contentful по slug="${item.slug}" (${item.name}), пропускаю.`);
      skipped++;
      continue;
    }

    // Обновляем badge, только если он реально отличается.
    const currentBadge = (productEntry.fields.badge as any)?.[locale] ?? null;
    if (item.badge !== currentBadge) {
      productEntry.fields.badge = { [locale]: item.badge ?? undefined } as any;
      const updated = await client.entry.update(
        { entryId: productEntry.sys.id },
        productEntry
      );
      await client.entry.publish({ entryId: updated.sys.id }, updated);
      updatedProducts++;
      await sleep(120);
    }

    for (const review of item.reviewsToAdd) {
      const created = await client.entry.create(
        { contentTypeId: "review" },
        {
          fields: {
            author: { [locale]: review.author },
            rating: { [locale]: review.rating },
            text: { [locale]: toTextField(review.text) },
            product: {
              [locale]: { sys: { type: "Link", linkType: "Entry", id: productEntry.sys.id } },
            },
          },
        }
      );
      await client.entry.publish({ entryId: created.sys.id }, created);
      createdReviews++;
      await sleep(120);
    }

    console.log(`✓ ${item.name}: badge=${item.badge ?? "—"}, +${item.reviewsToAdd.length} отзывов`);
  }

  console.log(
    `\n[push-to-contentful] готово: обновлено бейджей ${updatedProducts}, создано отзывов ${createdReviews}, пропущено товаров ${skipped}.`
  );
  console.log("Теперь запустите: npm run sync:contentful — чтобы обновить сайт.");
}

main().catch((err) => {
  console.error("[push-to-contentful] ошибка:", err?.message || err);
  process.exit(1);
});
