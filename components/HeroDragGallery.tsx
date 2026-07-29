"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, useMotionValue, useTransform, useAnimationFrame } from "framer-motion";

import hero1 from "@/public/hero1.png";
import hero2 from "@/public/hero2.png";
import hero3 from "@/public/hero3.png";
import women from "@/public/women.avif";
import men from "@/public/men.avif";

type Card = { src: StaticImageData };

// Уникальные карточки — лента крутится по кругу через них бесконечно.
const CARDS: Card[] = [
  { src: men },
  { src: hero3 },
  { src: women },
  { src: hero1 },
  { src: hero2 },
];

const N = CARDS.length;
const STEP_DEG = 34; // угол поворота между соседними позициями
const STEP_Z = 90; // отдаление вглубь по Z на каждый шаг от центра
const STEP_X = 120; // горизонтальный шаг между позициями
const SPEED = 0.00035; // скорость движения по кругу (позиций в мс)

// Кратчайшее знаковое расстояние от карточки до центра по кругу из N позиций.
function wrappedDelta(raw: number) {
  let d = raw % N;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
}

function CoverflowCard({
  card,
  index,
  phase,
  visibleSlots,
}: {
  card: Card;
  index: number;
  phase: ReturnType<typeof useMotionValue<number>>;
  visibleSlots: number;
}) {
  const transform = useTransform(phase, (p) => {
    const delta = wrappedDelta(index - p);
    const x = delta * STEP_X;
    // Центр уходит вглубь (мельче), края выступают вперёд (крупнее) — вогнутая дуга.
    const z = -(N / 2 - Math.abs(delta)) * STEP_Z;
    const rotateY = -delta * STEP_DEG;
    return `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg)`;
  });
  const opacity = useTransform(phase, (p) => {
    const delta = Math.abs(wrappedDelta(index - p));
    const threshold = Math.min(N / 2, visibleSlots / 2);
    return delta > threshold ? 0 : 1;
  });

  return (
    <motion.div
      style={{ transform, opacity }}
      className="absolute w-[120px] h-[150px] rounded-xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
    >
      <Image src={card.src} alt="" fill sizes="150px" className="object-cover" />
    </motion.div>
  );
}

export default function HeroDragGallery() {
  const phase = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    phase.set(phase.get() + delta * SPEED);
  });

  // На мобильных одновременно видно 4 карточки, на десктопе — все.
  const [visibleSlots, setVisibleSlots] = useState(N);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setVisibleSlots(mq.matches ? 4 : N);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* coverflow-лента: карточки на дуге, непрерывно движутся по кругу */}
      <div
        className="absolute left-1/2 top-[24%] -translate-x-1/2"
        style={{ perspective: "1200px" }}
      >
        <div className="relative" style={{ transformStyle: "preserve-3d" }}>
          {CARDS.map((card, i) => (
            <CoverflowCard key={i} card={card} index={i} phase={phase} visibleSlots={visibleSlots} />
          ))}
        </div>
      </div>

      {/* fade по краям сцены */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #000 0%, transparent 18%, transparent 82%, #000 100%)",
        }}
      />

      {/* центральное фото — один раз выезжает и замирает */}
      <motion.div
        initial={{ opacity: 0, x: 80, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 bottom-0 top-[8%] flex justify-center z-10"
      >
        <div className="relative w-[210px] md:w-[300px] h-full">
          <Image
            src={women}
            alt="Парфюмерия"
            fill
            priority
            sizes="(max-width: 768px) 210px, 300px"
            className="object-cover object-top"
          />
        </div>
      </motion.div>

      {/* затемнение снизу для читаемости заголовка поверх сцены */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
    </div>
  );
}
