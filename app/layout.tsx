import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "ORIGINE — оригинальная нишевая парфюмерия в объёмах 5 и 10 мл",
  description:
    "Магазин оригинальной нишевой парфюмерии. Тестируйте ароматы в объёме 5 и 10 мл без переплаты за полный флакон. Мужские и женские ароматы, гид по нотам, доставка по России.",
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
    title: "ORIGINE — оригинальная нишевая парфюмерия",
    description:
      "Тестируйте нишевые ароматы в объёме 5 и 10 мл. Мужская и женская парфюмерия, гид по нотам и трендам.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="font-body antialiased">
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
