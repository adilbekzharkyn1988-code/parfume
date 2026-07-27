"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";

// Полноэкранный фоновый слайдер для геро-блока.
// 3 фото, плавное растворение (crossfade) между слайдами + у каждого
// слайда свой собственный эффект движения (Ken Burns).
// Без стрелок, без точек, без свайпа — только автопрокрутка.
//
// Картинки подключены через import. Чтобы добавить/заменить фото:
// 1. Положи файл в /public (например public/hero-4.png)
// 2. Добавь import ниже: import hero4 from "@/public/hero-4.png";
// 3. Пропиши его в массиве SLIDES вместо одного из текущих.

import hero1 from "@/public/hero1.png";
import hero2 from "@/public/hero2.png";
import hero3 from "@/public/hero3.png";

type Effect = {
  // Точка, вокруг которой идёт масштабирование — задаёт "угол" зума.
  transformOrigin: string;
  // Во сколько раз увеличивается картинка к концу показа слайда.
  scaleTo: number;
  // Сдвиг по горизонтали/вертикали к концу показа слайда, в процентах.
  translateXTo?: number;
  translateYTo?: number;
};

type Slide = { src: StaticImageData; alt: string; effect: Effect };

const SLIDES: Slide[] = [
  {
    src: hero1,
    alt: "Нишевая и люксовая парфюмерия",
    // 1-й слайд: обычный плавный зум по центру
    effect: { transformOrigin: "center center", scaleTo: 1.08 },
  },
  {
    src: hero2,
    alt: "Женская парфюмерия",
    // 2-й слайд: медленный сдвиг влево (лёгкий зум, чтобы не было пустых краёв)
    effect: { transformOrigin: "center center", scaleTo: 1.1, translateXTo: -6 },
  },
  {
    src: hero3,
    alt: "Мужская парфюмерия",
    // 3-й слайд: зум в правый нижний угол
    effect: { transformOrigin: "right bottom", scaleTo: 1.1 },
  },
];

const AUTOPLAY_MS = 4600; // авто-переход каждые 4.6 секунды
const FADE_MS = 1600; // длительность плавного растворения между слайдами
// Зум должен укладываться в AUTOPLAY_MS — иначе слайд сменится раньше,
// чем эффект доиграет до конца, и переход оборвётся на середине.
const KENBURNS_MS = AUTOPLAY_MS;

export default function HeroBackgroundSlider() {
  const [index, setIndex] = useState(0);
  // На первом рендере все слайды должны стоять в начальном положении —
  // иначе первый слайд появляется СРАЗУ в конечном состоянии.
  const [effectsStarted, setEffectsStarted] = useState(false);

  // Слайд, который только что перестал быть активным: он ещё растворяется
  // (FADE_MS) и в этот момент НЕ должен уменьшаться обратно — иначе
  // получается рывок (одновременно и фейд, и резкое "сдутие" картинки).
  // Пока он растворяется — держим его увеличенным, "замороженным".
  // Как только он полностью невидим — мгновенно (без анимации) сбрасываем
  // масштаб, чтобы при следующем показе зум снова стартовал с нуля.
  const [frozenIndex, setFrozenIndex] = useState<number | null>(null);
  const prevIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEffectsStarted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (SLIDES.length <= 1) return;
    const t = setInterval(() => {
      setIndex((v) => (v + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const prev = prevIndexRef.current;
    prevIndexRef.current = index;
    if (prev === null) return;

    setFrozenIndex(prev);
    const t = setTimeout(() => {
      // К этому моменту растворение уже закончилось — слайд невидим,
      // можно безопасно сбросить масштаб без анимации.
      setFrozenIndex((f) => (f === prev ? null : f));
    }, FADE_MS);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {SLIDES.map((slide, i) => {
        const active = i === index;
        const frozen = i === frozenIndex;
        const playing = active && effectsStarted;
        const { transformOrigin, scaleTo, translateXTo = 0, translateYTo = 0 } = slide.effect;

        let transform: string;
        let transition: string;

        if (playing) {
          // Активный слайд — плавно едет к своему целевому эффекту.
          transform = `translate(${translateXTo}%, ${translateYTo}%) scale(${scaleTo})`;
          transition = `transform ${KENBURNS_MS}ms ease-out`;
        } else if (frozen) {
          // Только что стал неактивным — остаётся увеличенным без движения,
          // пока полностью не растворится.
          transform = `translate(${translateXTo}%, ${translateYTo}%) scale(${scaleTo})`;
          transition = "none";
        } else {
          // Уже невидим и полностью сброшен — готов к следующему показу.
          transform = "translate(0%, 0%) scale(1)";
          transition = "none";
        }

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
                transform,
                transformOrigin,
                transition,
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
