"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";

// Полноэкранный фоновый слайдер для геро-блока.
// 3 фото, плавное растворение (crossfade) между слайдами + лёгкий
// эффект Ken Burns (медленное увеличение 100% -> ~104%).
// Без стрелок, без точек, без свайпа — только автопрокрутка.
//
// Картинки подключены через import (а не через строку-путь) —
// так Next.js сам оптимизирует их и знает реальные width/height.
// Чтобы добавить/заменить фото:
// 1. Положи файл в /public (например public/hero-4.png)
// 2. Добавь import ниже: import hero4 from "@/public/hero-4.png";
// 3. Пропиши его в массиве SLIDES вместо одного из текущих.

import hero1 from "@/public/hero1.png";
import hero2 from "@/public/hero2.png";
import hero3 from "@/public/hero3.png";

type Slide = { src: StaticImageData; alt: string };

const SLIDES: Slide[] = [
  { src: hero1, alt: "Нишевая и люксовая парфюмерия" },
  { src: hero2, alt: "Женская парфюмерия" },
  { src: hero3, alt: "Мужская парфюмерия" },
];

const AUTOPLAY_MS = 3000; // авто-переход каждые 3 секунды
const FADE_MS = 1600; // длительность плавного растворения между слайдами
const KENBURNS_MS = AUTOPLAY_MS + FADE_MS; // медленное, спокойное масштабирование
const ZOOM_SCALE = 1.08; // насколько увеличивается активный слайд (1.08 = +8%)

export default function HeroBackgroundSlider() {
  const [index, setIndex] = useState(0);
  // На самом первом рендере все слайды должны стоять на scale(1) —
  // иначе первый слайд появляется СРАЗУ увеличенным и CSS-переход
  // просто нечего анимировать (переход играет только когда значение
  // МЕНЯЕТСЯ после того, как элемент уже на странице).
  const [zoomStarted, setZoomStarted] = useState(false);

  useEffect(() => {
    // Запускаем зум на следующий кадр после монтирования —
    // так браузер успевает "увидеть" стартовое scale(1) и затем
    // анимирует переход к увеличенному состоянию.
    const raf = requestAnimationFrame(() => setZoomStarted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (SLIDES.length <= 1) return;
    const t = setInterval(() => {
      setIndex((v) => (v + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {SLIDES.map((slide, i) => {
        const active = i === index;
        const zoomedIn = active && zoomStarted;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: active ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
            }}
          >
            <div
              className="relative w-full h-full"
              style={{
                transform: zoomedIn ? `scale(${ZOOM_SCALE})` : "scale(1)",
                transition: `transform ${KENBURNS_MS}ms ease-out`,
              }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
