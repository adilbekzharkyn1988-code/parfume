import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Preloader from "@/components/Preloader";
import { CartProvider } from "@/context/CartContext";
import { fetchProducts } from "@/contentful/data";
import { SITE_BASE_URL } from "@/lib/site";

export const metadata: Metadata = {
  // Даёт Next.js домен по умолчанию для относительных путей в metadata
  // (canonical, og:image и т.п.) — без этого они собирались бы неверно.
  metadataBase: new URL(SITE_BASE_URL),
  title: {
    default: "JUPARFUME — оригинальная нишевая парфюмерия в объёмах 5 и 10 мл",
    // На всех вложенных страницах title приходит из их собственного
    // generateMetadata (товар, каталог, статья) — этот шаблон только
    // добавляет к нему "| JUPARFUME", если страница сама этого не сделала.
    template: "%s | JUPARFUME",
  },
  description:
    "Магазин оригинальной нишевой парфюмерии. Тестируйте ароматы в объёме 5 и 10 мл без переплаты за полный флакон. Мужские и женские ароматы, гид по нотам, доставка по РК.",
  keywords: [
    "оригинальная парфюмерия",
    "нишевый парфюм",
    "духи 5 мл",
    "духи 10 мл",
    "парфюмерия распив",
    "мужские духи",
    "женские духи",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "JUPARFUME — оригинальная нишевая парфюмерия",
    description:
      "Тестируйте нишевые ароматы в объёме 5 и 10 мл. Мужская и женская парфюмерия, гид по нотам и трендам.",
    type: "website",
    locale: "ru_RU",
    url: "/",
  },
};

// Organization + WebSite JSON-LD — общий "паспорт" сайта для поисковиков
// (помогает с карточкой компании в поиске и sitelinks searchbox).
// Данные о конкретном товаре — отдельная микроразметка Product на
// странице app/product/[slug]/page.tsx, эта схема их не дублирует.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JUPARFUME",
  url: SITE_BASE_URL,
  logo: `${SITE_BASE_URL}/favicon.ico`,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "JUPARFUME",
  url: SITE_BASE_URL,
};

// LocalBusiness (Store) JSON-LD — физическая точка в Алматы: адрес,
// координаты и часы работы совпадают с блоком "Контакты" на главной
// (app/page.tsx) и с Footer. Помогает с локальным поиском/картами
// и панелью знаний, отдельно от Organization (тот описывает бренд
// в целом, без географии).
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "JUPARFUME",
  url: SITE_BASE_URL,
  telephone: "+77056868694",
  priceRange: "10000–30000 ₸",
  image: `${SITE_BASE_URL}/favicon.ico`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Досмухамедова 52",
    addressLocality: "Алматы",
    addressCountry: "KZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.252871,
    longitude: 76.9243525,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "10:00",
    closes: "22:00",
  },
  sameAs: [
    "https://instagram.com/juparfume.kz",
    "https://tiktok.com/@juparfume.kaz",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Лёгкий индекс для поиска в шапке — только slug/название/бренд,
  // без картинок, описаний и пирамиды нот, чтобы не раздувать бандл.
  const allProducts = await fetchProducts();
  const searchIndex = allProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand,
  }));

  return (
    <html lang="ru">
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <CartProvider>
          <Header searchIndex={searchIndex} />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
        <Preloader />
      </body>
    </html>
  );
}
