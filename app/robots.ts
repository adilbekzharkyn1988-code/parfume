import type { MetadataRoute } from "next";
import { SITE_BASE_URL } from "@/lib/site";

// Обязательно для output: "export" — иначе Next.js не знает, что этот
// маршрут можно сгенерировать статически при сборке.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /admin/ — панель заявок, ей не место в поиске (дополнительно
        // закрыта через noindex в app/admin/layout.tsx).
        disallow: ["/admin/"],
      },
    ],
    sitemap: `${SITE_BASE_URL}/sitemap.xml`,
  };
}
