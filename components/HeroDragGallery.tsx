"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";

import hero1 from "@/public/hero1.png";
import hero2 from "@/public/hero2.png";
import hero3 from "@/public/hero3.png";
import women from "@/public/women.avif";
import men from "@/public/men.avif";

type Card = { src: StaticImageData; rotate: number };

// Наклон карточек чередуется (как на референсе) — часть заваливается влево,
// часть вправо. Ряд повторяется дважды подряд для бесшовной прокрутки.
const BASE_CARDS: Card[] = [
  { src: hero2, rotate: -6 },
  { src: women, rotate: 4 },
  { src: hero1, rotate: -3 },
  { src: hero3, rotate: 6 },
  { src: men, rotate: -5 },
  { src: hero1, rotate: 3 },
];
const CARDS = [...BASE_CARDS, ...BASE_CARDS];

export default function HeroDragGallery() {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* лента карточек — едет сама по себе бесконечно, без остановки */}
      <div
        className="absolute left-0 right-0 top-[22%] overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)",
        }}
      >
        <div className="hero-marquee__track items-center gap-4 md:gap-6 px-6">
          {CARDS.map((card, i) => (
            <div
              key={i}
              style={{ transform: `rotate(${card.rotate}deg)` }}
              className="relative shrink-0 w-[170px] h-[110px] md:w-[230px] md:h-[150px] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
            >
              <Image
                src={card.src}
                alt=""
                fill
                sizes="230px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* центральное фото — один раз выезжает и замирает, лента продолжает ехать позади */}
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
