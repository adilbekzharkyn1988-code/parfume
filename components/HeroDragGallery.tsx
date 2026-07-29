"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";

import hero1 from "@/public/hero1.png";
import hero2 from "@/public/hero2.png";
import hero3 from "@/public/hero3.png";
import women from "@/public/women.avif";
import men from "@/public/men.avif";

type Card = { src: StaticImageData };

// Ряд карточек по дуге (coverflow). Порядок слева направо — от центра
// расходятся по обе стороны, поэтому массив зеркально симметричен.
const CARDS: Card[] = [
  { src: men },
  { src: hero3 },
  { src: women },
  { src: hero1 },
  { src: hero2 },
  { src: hero3 },
  { src: men },
];

const CENTER = Math.floor(CARDS.length / 2);
const STEP_DEG = 34; // угол поворота между соседними карточками
const STEP_Z = 90; // отдаление вглубь по Z на каждый шаг от центра
const STEP_X = 150; // горизонтальный шаг между карточками

export default function HeroDragGallery() {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* coverflow-лента: карточки развёрнуты в 3D по дуге вокруг центра */}
      <div
        className="absolute left-1/2 top-[24%] -translate-x-1/2"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {CARDS.map((card, i) => {
            const offset = i - CENTER; // -3..3
            const angle = -offset * STEP_DEG;
            const z = -Math.abs(offset) * STEP_Z;
            const x = offset * STEP_X;

            return (
              <div
                key={i}
                className="absolute w-[190px] h-[240px] md:w-[230px] md:h-[290px] rounded-xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
                style={{
                  transform: `translateX(${x}px) translateZ(${z}px) rotateY(${angle}deg)`,
                  zIndex: CARDS.length - Math.abs(offset),
                }}
              >
                <Image
                  src={card.src}
                  alt=""
                  fill
                  sizes="230px"
                  className="object-cover"
                />
              </div>
            );
          })}
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
        <div className="relative w-[280px] md:w-[420px] h-full">
          <Image
            src={women}
            alt="Парфюмерия"
            fill
            priority
            sizes="(max-width: 768px) 280px, 420px"
            className="object-cover object-top"
          />
        </div>
      </motion.div>

      {/* затемнение снизу для читаемости заголовка поверх сцены */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
    </div>
  );
}
