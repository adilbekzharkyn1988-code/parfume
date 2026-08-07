import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Preloader from "@/components/Preloader";
import { CartProvider } from "@/context/CartContext";
import { fetchProducts } from "@/contentful/data";

export const metadata: Metadata = {
  title: "JUPARFUME — оригинальная нишевая парфюмерия в объёмах 5 и 10 мл",
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
  openGraph: {
    title: "JUPARFUME — оригинальная нишевая парфюмерия",
    description:
      "Тестируйте нишевые ароматы в объёме 5 и 10 мл. Мужская и женская парфюмерия, гид по нотам и трендам.",
    type: "website",
    locale: "ru_RU",
  },
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
