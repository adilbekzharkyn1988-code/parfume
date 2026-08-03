/**
 * Диагностика: ищет товары с одинаковым slug в Contentful.
 * Помогает понять, откуда взялись лишние товары (71 -> 132 и т.п.)
 *
 * Запуск:
 *   npx tsx scripts/find-duplicate-slugs.ts
 *
 * Нужны те же переменные, что и для sync:contentful:
 *   NEXT_PUBLIC_CONTENTFUL_SPACE_ID
 *   NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
 */

import { createClient } from "contentful";

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
  console.error("❌ Не заданы NEXT_PUBLIC_CONTENTFUL_SPACE_ID / NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN");
  process.exit(1);
}

const client = createClient({ space: spaceId, accessToken });

async function main() {
  const res = await client.getEntries({ content_type: "product", limit: 1000 });
  console.log(`Всего опубликованных товаров: ${res.items.length}\n`);

  const bySlug = new Map<string, any[]>();
  for (const item of res.items) {
    const slug = (item.fields as any).slug || "(без slug)";
    const list = bySlug.get(slug) || [];
    list.push(item);
    bySlug.set(slug, list);
  }

  const duplicates = [...bySlug.entries()].filter(([, items]) => items.length > 1);

  if (duplicates.length === 0) {
    console.log("Дубликатов по slug не найдено — значит, лишние товары это РАЗНЫЕ slug (реально новые записи, не копии).");
    return;
  }

  console.log(`⚠️  Найдено slug с дублями: ${duplicates.length}\n`);
  for (const [slug, items] of duplicates) {
    console.log(`--- ${slug} (${items.length} шт.) ---`);
    for (const it of items) {
      const f = it.fields as any;
      const imgItem = Array.isArray(f.image) ? f.image[0] : f.image;
      const imgUrl = imgItem?.fields?.file?.url ? `https:${imgItem.fields.file.url}` : "(нет картинки)";
      console.log(
        `   id=${it.sys.id}  создан=${it.sys.createdAt}  версия=${it.sys.revision}  название="${f.name}"\n      фото: ${imgUrl}`
      );
    }
  }
}

main().catch((err) => {
  console.error("Ошибка:", err);
  process.exit(1);
});
