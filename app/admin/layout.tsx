import type { Metadata } from "next";

// /admin — внутренняя панель заявок, не должна попадать в поиск.
// robots.txt её тоже закрывает (disallow), но noindex надёжнее: он
// не даёт странице попасть в индекс, даже если на неё где-то есть
// внешняя ссылка (disallow в robots.txt этого не гарантирует).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
