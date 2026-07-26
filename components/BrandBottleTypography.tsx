"use client";

import { useEffect } from "react";
import "aos/dist/aos.css";

// Цвета — часть уже есть в теме (ink/gold/wine), остальные добавлены под этот блок
const INK = "#1c1712";
const GOLD = "#b08d57";
const WINE = "#6e2a3b";
const NAVY = "#1e3a5f";
const PLUM = "#4b2e5e";

const FONT = "var(--font-display), serif";

// Идентификатор HTML-обёртки, которую AOS использует, чтобы вычислить
// позицию блока на странице (data-aos-anchor).
// ВАЖНО: AOS считает позицию элемента через el.offsetTop / el.offsetParent —
// а эти свойства существуют только у HTMLElement и всегда undefined у SVG
// (<text>, <tspan>, <g> и т.д.). Из-за этого при расчёте на "голых" SVG-нодах
// AOS получает NaN и трактует позицию элемента как 0, то есть считает, что
// элемент уже проскроллен и должен быть показан немедленно — вместо
// анимации всё сразу становится видимым либо застревает в невидимом
// состоянии. Поэтому у каждого data-aos элемента указываем data-aos-anchor,
// указывающий на реальный HTML div снаружи <svg>.
const AOS_ANCHOR_ID = "brand-bottle-aos-anchor";

declare global {
  interface Window {
    __aosInitialized?: boolean;
  }
}

export default function BrandBottleTypography({ className = "" }: { className?: string }) {
  useEffect(() => {
    let cancelled = false;

    import("aos").then((AOS) => {
      if (cancelled) return;
      if (!window.__aosInitialized) {
        // Первая инициализация на странице — вешает слушатели скролла/ресайза.
        AOS.default.init({
          duration: 500,
          easing: "ease-out",
          once: true,
          offset: 0,
        });
        window.__aosInitialized = true;
      } else {
        // AOS уже был инициализирован раньше (например, компонент
        // размонтировался и снова смонтировался при переходе по сайту
        // клиентским роутером Next.js). Без этого шага AOS никогда бы не
        // "увидел" новые SVG-ноды, и они бы навсегда остались в исходном
        // (невидимом) состоянии — init() с новым набором слушателей вызывать
        // второй раз не нужно, достаточно пересканировать DOM.
        AOS.default.refreshHard();
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div id={AOS_ANCHOR_ID} className={className}>
    <svg
      viewBox="0 0 420 900"
      className="w-full h-auto"
      role="img"
      aria-label="Флакон, собранный из названий парфюмерных брендов"
    >
      <defs>
        <path id="arcAmouage" d="M 65,345 Q 210,295 355,345" fill="none" />
        <path id="arcParfums" d="M 50,382 Q 210,345 370,382" fill="none" />
        <path id="arcXerjoff" d="M 45,420 Q 210,378 375,420" fill="none" />
        <path id="arcCreed" d="M 110,452 Q 210,442 310,452" fill="none" />
      </defs>

      {/* --- ГОРЛЫШКО / КРЫШКА --- */}
      <text
        data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="0"
        x="210" y="70" textAnchor="middle"
        style={{ fontFamily: FONT, fontSize: 30, fontWeight: 600, letterSpacing: 2, fill: PLUM }}
      >
        INITIO
      </text>

      <text
        data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="100"
        x="210" y="118" textAnchor="middle"
        style={{ fontFamily: FONT, fontSize: 48, fontWeight: 700, letterSpacing: 1, fill: GOLD }}
      >
        ROJA
      </text>

      {/* декоративная завитушка */}
      <g data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="150" style={{ fill: GOLD }}>
        <text x="210" y="150" textAnchor="middle" style={{ fontSize: 22 }}>
          ❦
        </text>
      </g>

      <text
        data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="200"
        x="210" y="222" textAnchor="middle"
        style={{ fontFamily: FONT, fontSize: 26, fontWeight: 600, letterSpacing: 1, fill: INK }}
      >
        KILIAN
      </text>

      <text
        data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="250"
        x="210" y="268" textAnchor="middle"
        style={{ fontFamily: FONT, fontSize: 48, fontWeight: 700, fill: GOLD }}
      >
        HFC
      </text>

      {/* --- ПЛЕЧИКИ ФЛАКОНА (изогнутый текст) --- */}
      <text data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="300" style={{ fontFamily: FONT, fontSize: 42, fontWeight: 700, fill: INK }}>
        <textPath href="#arcAmouage" startOffset="50%" textAnchor="middle">
          AMOUAGE
        </textPath>
      </text>

      <text data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="400" style={{ fontFamily: FONT, fontSize: 23, fontWeight: 600, fill: WINE, letterSpacing: 1 }}>
        <textPath href="#arcParfums" startOffset="50%" textAnchor="middle">
          PARFUMS DE MARLY
        </textPath>
      </text>

      <text data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="450" style={{ fontFamily: FONT, fontSize: 46, fontWeight: 800, fill: INK }}>
        <textPath href="#arcXerjoff" startOffset="50%" textAnchor="middle">
          XERJOFF
        </textPath>
      </text>

      <text data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="500" style={{ fontFamily: FONT, fontSize: 38, fontWeight: 700, fill: GOLD }}>
        <textPath href="#arcCreed" startOffset="50%" textAnchor="middle">
          CREED
        </textPath>
      </text>

      {/* декоративный перекрёстный завиток под CREED */}
      <g data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="550" style={{ stroke: GOLD, strokeWidth: 1.5, fill: "none" }}>
        <path d="M 150,468 Q 210,478 270,468" />
        <path d="M 150,468 Q 210,458 270,468" />
      </g>

      {/* --- ВЕРТИКАЛЬНЫЙ "TOM FORD" ПО КРАЯМ --- */}
      <text
        data-aos="fade-left" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="600"
        x="0" y="0" textAnchor="middle"
        transform="translate(32, 460) rotate(-90)"
        style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, letterSpacing: 3, fill: NAVY }}
      >
        TOM FORD
      </text>
      <text
        data-aos="fade-right" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="600"
        x="0" y="0" textAnchor="middle"
        transform="translate(388, 460) rotate(90)"
        style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, letterSpacing: 3, fill: NAVY }}
      >
        TOM FORD
      </text>

      {/* --- ТЕЛО ФЛАКОНА --- */}
      <text data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="650" x="120" y="500" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, fill: INK }}>
        NISHANE
      </text>
      <text data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="650" x="305" y="500" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, fill: GOLD }}>
        BVLGARI
      </text>

      <text data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="700" x="108" y="536" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, fill: NAVY }}>
        CHOPARD
      </text>
      <text data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="700" x="308" y="536" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, fill: INK }}>
        CLIVE CHRISTIAN
      </text>

      <text data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="800" x="112" y="572" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, fill: NAVY }}>
        HORMONI <tspan style={{ fontSize: 12 }}>PARIS</tspan>
      </text>
      <text data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="800" x="305" y="572" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, fill: WINE }}>
        KILIAN
      </text>

      <text data-aos="fade-up" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="850" x="210" y="608" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, fill: WINE }}>
        MARC-ANTOINE BARROIS
      </text>

      <text data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="900" x="115" y="644" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, fill: INK }}>
        LE LABO
      </text>
      <text data-aos="fade-in" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="900" x="308" y="644" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, fill: NAVY }}>
        EX NIHILO
      </text>

      <text data-aos="fade-up" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="950" x="210" y="680" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, fill: INK }}>
        ESSENTIAL PARFUMS
      </text>

      <text data-aos="fade-up" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="1000" x="210" y="716" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, fill: GOLD }}>
        ACQUA DI PARMA
      </text>

      <text data-aos="fade-up" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="1050" x="210" y="754" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, fill: NAVY }}>
        LOUIS VUITTON
      </text>

      <text data-aos="fade-up" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="1100" x="210" y="790" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, fill: WINE }}>
        ARABIAN OUD
      </text>

      <text data-aos="fade-up" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="1150" x="210" y="820" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 20, fontWeight: 600, fill: INK }}>
        BOADICEA THE VICTORIOUS
      </text>

      <g data-aos="fade-up" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="1200">
        <text x="90" y="856" style={{ fontFamily: FONT, fontSize: 18, fill: GOLD }}>❧</text>
        <text x="210" y="858" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, fill: GOLD }}>
          SOSPIRO
        </text>
        <text x="330" y="856" style={{ fontFamily: FONT, fontSize: 18, fill: GOLD }}>❧</text>
      </g>

      <text data-aos="fade-up" data-aos-anchor="#brand-bottle-aos-anchor" data-aos-delay="1250" x="210" y="892" textAnchor="middle" style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, fill: INK }}>
        MAISON CRIVELLI
      </text>
    </svg>
    </div>
  );
}
