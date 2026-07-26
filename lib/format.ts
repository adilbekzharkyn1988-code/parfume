export function formatPrice(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₸";
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
