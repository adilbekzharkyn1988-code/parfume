"use client";

import { useEffect, useState } from "react";

// Полноэкранный фоновый слайдер для геро-блока.
// 3 фото, плавное растворение (crossfade) между слайдами + лёгкий
// эффект Ken Burns (медленное увеличение 100% -> ~104%).
// Без стрелок, без точек, без свайпа — только автопрокрутка.

type Slide = { src: string; alt: string };

const SLIDES: Slide[] = [
  { src: "public/hero-bg-desktop.jpg", alt: "Нишевая и люксовая парфюмерия" },
  { src: "public/women.avif", alt: "Женская парфюмерия" },
  { src: "public/men.avif", alt: "Мужская парфюмерия" },
];

const AUTOPLAY_MS = 3000; // авто-переход каждые 3 секунды
const FADE_MS = 1600; // длительность плавного растворения между слайдами
const KENBURNS_MS = AUTOPLAY_MS + FADE_MS; // медленное, спокойное масштабирование

export default function HeroBackgroundSlider() {
  const [index, setIndex] = useState(0);

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
        return (
          <div
            key={slide.src}
            className="absolute inset-0"
            style={{
              opacity: active ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
            }}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover"
              style={{
                transform: active ? "scale(1.04)" : "scale(1)",
                transition: `transform ${KENBURNS_MS}ms ease-out`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
