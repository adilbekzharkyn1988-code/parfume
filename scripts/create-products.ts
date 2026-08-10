/**
 * Создаёт НОВЫЕ товары (content_type "product") в Contentful из JSON-файла.
 *
 * Главное правило: скрипт НИКОГДА не изменяет и не удаляет существующие
 * записи. Перед созданием каждого товара он проверяет, нет ли уже товара
 * с таким же slug — если есть, товар пропускается (со сообщением в консоли),
 * если нет — создаётся новая запись и сразу публикуется.
 *
 * Формат входного JSON — массив объектов вида (см. data/new-products.example.json):
 * [
 *   {
 *     "slug": "sospiro-basso",
 *     "brand": "Sospiro",
 *     "name": "Basso",
 *     "gender": "unisex",           // "men" | "women" | "unisex"
 *     "family": "woody",            // woody|fresh|oriental|citrus|floral|gourmand|musky|spicy
 *     "familyLable": "Цитрусово-пряный древесный",
 *     "concentration": "Eau de Parfum",
 *     "description": "...",         // короткое описание (обычный текст)
 *     "story": "...",               // длинный текст (уйдёт в Rich Text одним абзацем)
 *     "notesTop": ["Грейпфрут"],
 *     "notesHeart": ["Гвоздика", "Лабданум"],
 *     "notesBase": ["Ветивер", "Кедр"],
 *     "price5": 15000,
 *     "price10": 28000,
 *     "rating": 4.7,
 *     "reviews": 96,
 *     "badge": "Новинка",           // "Новинка" | "Хит продаж" | "Ограниченная серия" | null
 *     "sillage": 4,
 *     "longevity": 5,
 *     "seasonality": { "winter": 65, "spring": 55, "summer": 40, "autumn": 75, "day": 60, "evening": 75 },
 *     "imageUrl": "https://..."     // необязательно: если указан, картинка будет
 *                                    // скачана и прикреплена как Asset в Contentful
 *   }
 * ]
 *
 * Нужен Content Management API токен (НЕ Content Delivery API):
 * Contentful → Settings → API keys → Content management tokens → Generate personal token.
 *
 * .env.local:
 *   NEXT_PUBLIC_CONTENTFUL_SPACE_ID=...
 *   CONTENTFUL_MANAGEMENT_TOKEN=...
 *   CONTENTFUL_ENVIRONMENT=master   (необязательно, по умолчанию master)
 *
 * Запуск:
 *   npm run create:products                          -> читает data/new-products.json
 *   npm run create:products -- data/my-file.json      -> читает указанный файл
 *
 * После завершения обязательно прогоните:
 *   npm run sync:contentful
 * чтобы новые товары попали в contentful/cache.json и на сайт.
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

type Gender = "men" | "women" | "unisex";
type Family =
  | "woody"
  | "fresh"
  | "oriental"
  | "citrus"
  | "floral"
  | "gourmand"
  | "musky"
  | "spicy";
type Badge = "Новинка" | "Хит продаж" | "Ограниченная серия" | null;

type NewProduct = {
  slug: string;
  brand: string;
  name: string;
  gender: Gender;
  family: Family;
  familyLable: string;
  concentration: string;
  description: string;
  story: string;
  notesTop: string[];
  notesHeart: string[];
  notesBase: string[];
  price5: number;
  price10: number;
  rating: number;
  reviews: number;
  badge?: Badge;
  sillage: number;
  longevity: number;
  seasonality?: {
    winter?: number;
    spring?: number;
    summer?: number;
    autumn?: number;
    day?: number;
    evening?: number;
  };
  imageUrl?: string;
};

const VALID_GENDERS: Gender[] = ["men", "women", "unisex"];
const VALID_FAMILIES: Family[] = [
  "woody",
  "fresh",
  "oriental",
  "citrus",
  "floral",
  "gourmand",
  "musky",
  "spicy",
];
const VALID_BADGES = ["Новинка", "Хит продаж", "Ограниченная серия"];

// Путь к входному файлу можно передать аргументом: `npm run create:products -- data/my-file.json`
const inputArg = process.argv[2];
const importPath = resolve(
  __dirname,
  inputArg ? `../${inputArg}` : "../data/new-products.json"
);

if (!existsSync(importPath)) {
  console.error(
    `\n❌ Не найден файл ${importPath}\n` +
      "   Подготовьте JSON с новыми товарами (см. data/new-products.example.json)\n" +
      "   и сохраните его как data/new-products.json, либо укажите свой путь:\n" +
      "   npm run create:products -- data/my-file.json\n"
  );
  process.exit(1);
}

const rawItems: NewProduct[] = JSON.parse(readFileSync(importPath, "utf-8"));

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function toRichText(plain: string) {
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

function validateItem(item: NewProduct, index: number): string[] {
  const errors: string[] = [];
  const label = `#${index + 1} (${item?.name || item?.slug || "без имени"})`;

  if (!item.slug) errors.push(`${label}: не заполнен slug`);
  if (!item.name) errors.push(`${label}: не заполнено name`);
  if (!item.brand) errors.push(`${label}: не заполнен brand`);
  if (!item.gender || !VALID_GENDERS.includes(item.gender))
    errors.push(`${label}: gender должен быть одним из ${VALID_GENDERS.join(", ")}`);
  if (!item.family || !VALID_FAMILIES.includes(item.family))
    errors.push(`${label}: family должен быть одним из ${VALID_FAMILIES.join(", ")}`);
  if (item.badge && !VALID_BADGES.includes(item.badge))
    errors.push(`${label}: badge должен быть одним из ${VALID_BADGES.join(", ")} или null`);
  if (typeof item.price5 !== "number" || typeof item.price10 !== "number")
    errors.push(`${label}: price5/price10 должны быть числами`);

  return errors;
}

async function main() {
  const client = createClient(
    { accessToken: managementToken! },
    { type: "plain", defaults: { spaceId: spaceId!, environmentId } }
  );

  // --- Валидация входного файла -------------------------------------------------
  if (!Array.isArray(rawItems)) {
    console.error("❌ Входной JSON должен быть массивом товаров.");
    process.exit(1);
  }

  const allErrors: string[] = [];
  rawItems.forEach((item, i) => allErrors.push(...validateItem(item, i)));

  const slugCounts = new Map<string, number>();
  for (const item of rawItems) {
    slugCounts.set(item.slug, (slugCounts.get(item.slug) || 0) + 1);
  }
  for (const [slug, count] of slugCounts) {
    if (count > 1) allErrors.push(`Дубликат slug внутри файла: "${slug}" встречается ${count} раз(а)`);
  }

  if (allErrors.length > 0) {
    console.error(`\n❌ Найдены ошибки во входном файле (${importPath}):\n`);
    allErrors.forEach((e) => console.error("  - " + e));
    console.error("\nИсправьте JSON и запустите скрипт снова. Ничего не отправлено в Contentful.\n");
    process.exit(1);
  }

  // --- Локаль и типы полей content type "product" -------------------------------
  const locales = await client.locale.getMany({});
  const locale = (locales.items.find((l) => l.default) ?? locales.items[0])?.code ?? "en-US";

  const productContentType = await client.contentType
    .get({ contentTypeId: "product" })
    .catch(() => null);

  if (!productContentType) {
    console.error('❌ Не найден content type "product" в этом Contentful space/environment.');
    process.exit(1);
  }

  const fieldType = (id: string) =>
    productContentType.fields.find((f) => f.id === id)?.type;
  const descriptionIsRichText = fieldType("description") === "RichText";
  const storyIsRichText = fieldType("story") === "RichText";

  console.log(
    `[create-products] space=${spaceId} env=${environmentId} locale=${locale} — товаров во входном файле: ${rawItems.length}\n`
  );

  let created = 0;
  let skippedExisting = 0;
  let failed = 0;

  for (const item of rawItems) {
    try {
      // Проверяем, нет ли уже товара с таким slug — если есть, НЕ ТРОГАЕМ его.
      const existing = await client.entry.getMany({
        query: { content_type: "product", "fields.slug": item.slug, limit: 1 },
      });

      if (existing.items.length > 0) {
        console.log(`⏭  Пропущено (уже существует): ${item.slug} — ${item.brand} ${item.name}`);
        skippedExisting++;
        await sleep(80);
        continue;
      }

      // --- Опциональная картинка по ссылке -----------------------------------
      let imageLink: { sys: { type: "Link"; linkType: "Asset"; id: string } } | undefined;
      if (item.imageUrl) {
        try {
          const fileName = item.imageUrl.split("/").pop()?.split("?")[0] || `${item.slug}.jpg`;
          const asset = await client.asset.create(
            {},
            {
              fields: {
                title: { [locale]: `${item.brand} ${item.name}` },
                file: {
                  [locale]: {
                    contentType: "image/jpeg",
                    fileName,
                    upload: item.imageUrl,
                  },
                },
              },
            }
          );
          const processed = await client.asset.processForAllLocales({}, asset);
          // Дожидаемся, пока Contentful скачает файл по ссылке и обработает его.
          let ready = processed;
          for (let attempt = 0; attempt < 10; attempt++) {
            await sleep(1000);
            ready = await client.asset.get({ assetId: processed.sys.id });
            if (ready.fields.file?.[locale]?.url) break;
          }
          const published = await client.asset.publish({ assetId: ready.sys.id }, ready);
          imageLink = { sys: { type: "Link", linkType: "Asset", id: published.sys.id } };
        } catch (imgErr: any) {
          console.warn(
            `   ⚠ Не удалось загрузить картинку для ${item.slug}: ${imgErr?.message || imgErr}. Товар будет создан без картинки.`
          );
        }
      }

      // --- Формируем поля товара ----------------------------------------------
      const fields: Record<string, any> = {
        slug: { [locale]: item.slug },
        name: { [locale]: item.name },
        brand: { [locale]: item.brand },
        gender: { [locale]: item.gender },
        family: { [locale]: item.family },
        familyLable: { [locale]: item.familyLable },
        concentration: { [locale]: item.concentration },
        description: {
          [locale]: descriptionIsRichText ? toRichText(item.description) : item.description,
        },
        story: { [locale]: storyIsRichText ? toRichText(item.story) : item.story },
        notesTop: { [locale]: item.notesTop || [] },
        notesHeart: { [locale]: item.notesHeart || [] },
        notesBase: { [locale]: item.notesBase || [] },
        price5: { [locale]: item.price5 },
        price10: { [locale]: item.price10 },
        rating: { [locale]: item.rating },
        reviews: { [locale]: item.reviews },
        sillage: { [locale]: item.sillage },
        longevity: { [locale]: item.longevity },
      };

      if (item.badge) fields.badge = { [locale]: item.badge };
      if (item.seasonality) fields.seasonality = { [locale]: item.seasonality };
      if (imageLink) fields.image = { [locale]: imageLink };

      const createdEntry = await client.entry.create({ contentTypeId: "product" }, { fields });
      const published = await client.entry.publish({ entryId: createdEntry.sys.id }, createdEntry);

      console.log(`✓ Создан и опубликован: ${item.slug} — ${item.brand} ${item.name} (id=${published.sys.id})`);
      created++;
      await sleep(150);
    } catch (err: any) {
      console.error(`✗ Ошибка при создании "${item.slug}": ${err?.message || err}`);
      failed++;
    }
  }

  console.log(
    `\n[create-products] готово: создано ${created}, пропущено (уже существовали) ${skippedExisting}, ошибок ${failed}.`
  );
  if (created > 0) {
    console.log("Теперь запустите: npm run sync:contentful — чтобы обновить сайт.");
  }
}

main().catch((err) => {
  console.error("[create-products] ошибка:", err?.message || err);
  process.exit(1);
});
