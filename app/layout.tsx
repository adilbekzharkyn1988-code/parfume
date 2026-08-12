import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawerClient";
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
  verification: {
    google: "osARF9WRaLFD8yDMYcHTGJcS53aNTMawbb02pMwfi_Y",
  },
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
      <head>
        {/* Шрифт (Inter Variable, latin + cyrillic) лежит локально в
            public/fonts и описан через @font-face с unicode-range в
            globals.css — так браузер сам решает, какой из двух файлов
            ему нужен, и не грузит оба сразу. next/font/local тут не
            подошёл: он не умеет делить один шрифт на файлы по
            unicode-range (только по weight/style), а next/font/google
            означал бы обращение к fonts.googleapis.com на этапе сборки
            — нежелательно после истории с переездами хостинга.
            Кириллица — основной алфавит контента сайта, поэтому именно
            её файл получает preload; латиница дозагрузится сама по
            unicode-range, когда встретится в тексте. */}
        <link
          rel="preload"
          href="/fonts/inter-cyrillic-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
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
