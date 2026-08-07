export function formatPrice(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₸";
}

// Иногда поле в Contentful оказывается настроено как Rich Text (или в него
// случайно вставили rich-text-объект) там, где ожидается простая строка —
// например excerpt/title/category у статьи. Рендер такого объекта напрямую
// в JSX валит сборку ("Objects are not valid as a React child"). Эта
// функция достаёт из любого такого значения обычный текст, а если это и
// так была строка/число — просто возвращает как есть.
export function toPlainText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(toPlainText).join(" ").trim();
  if (typeof value === "object") {
    const node = value as { nodeType?: string; value?: unknown; content?: unknown[] };
    if (typeof node.value === "string") return node.value;
    if (Array.isArray(node.content)) {
      return node.content
        .map((child) => toPlainText(child))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    }
  }
  return "";
}

// На случай, если в Contentful в поле "name" бренд по ошибке продублирован
// в начале строки (например name = "Louis Vuitton Afternoon Swim", brand =
// "Louis Vuitton") — убираем этот повтор, чтобы бренд не показывался дважды.
export function stripBrandPrefix(name: string, brand: string): string {
  if (!name) return name;
  if (!brand) return name.trim();

  const trimmedName = name.trim();
  const trimmedBrand = brand.trim();

  if (trimmedName.toLowerCase().startsWith(trimmedBrand.toLowerCase())) {
    const rest = trimmedName.slice(trimmedBrand.length).trim();
    // убираем возможные разделители типа "-", "–", ":", "," после бренда
    const cleaned = rest.replace(/^[-–—:,\s]+/, "");
    return cleaned || trimmedName;
  }

  return trimmedName;
}
