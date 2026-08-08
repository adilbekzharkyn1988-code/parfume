// Единая точка правды для домена и base path сайта.
//
// Используется одновременно в next.config.ts (GitHub Pages кладёт сайт
// в подпапку /parfume, если это НЕ репозиторий вида username.github.io)
// и в app/sitemap.ts / app/robots.ts / JSON-LD — чтобы ссылки в sitemap
// и микроразметке всегда совпадали с реальными адресами страниц.
//
// Когда переедете на свой домен без вложенного пути
// (например juparfume.kz вместо username.github.io/parfume) —
// поставьте BASE_PATH = "" и задайте NEXT_PUBLIC_SITE_URL в .env.
export const BASE_PATH = "/parfume";

// ВАЖНО: сейчас сайт живёт на GitHub Pages, поэтому здесь стоит его
// текущий адрес. Когда переедете на juparfume.kz — раскомментируйте
// вторую строку и закомментируйте/удалите первую (BASE_PATH тогда тоже
// нужно будет поставить в "", см. комментарий выше).
const FALLBACK_SITE_URL = "https://adilbekzharkyn1988-code.github.io";
// const FALLBACK_SITE_URL = "https://juparfume.kz";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, "");

// Полный базовый URL сайта с учётом basePath — то, что реально стоит
// перед каждым внутренним путём в проде (используется в metadataBase).
export const SITE_BASE_URL = `${SITE_URL}${BASE_PATH}`;

// Строит абсолютный URL страницы по её пути внутри app-роутера
// (например "/product/kilian-black-phantom/") с учётом домена и basePath.
export function absoluteUrl(pathname: string): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_BASE_URL}${clean}`;
}
