"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, useMotionValue } from "framer-motion";

import hero1 from "@/public/hero1.png";
import hero2 from "@/public/hero2.png";
import hero3 from "@/public/hero3.png";
import women from "@/public/women.avif";
import men from "@/public/men.avif";

type Card = { src: StaticImageData; alt: string; baseAngle: number };

// Порядок карточек в ленте (слева направо). Центр перекрывается портретом.
const CARDS: Card[] = [
  { src: hero2, alt: "", baseAngle: -6 },
  { src: women, alt: "", baseAngle: -3 },
  { src: hero1, alt: "", baseAngle: 4 },
  { src: hero3, alt: "", baseAngle: -4 },
  { src: men, alt: "", baseAngle: 6 },
  { src: hero2, alt: "", baseAngle: -5 },
  { src: hero1, alt: "", baseAngle: 3 },
];

function DragCard({ card }: { card: Card }) {
  const rotate = useMotionValue(card.baseAngle);

  return (
    <motion.div
      drag
      dragElastic={0.5}
      dragMomentum={false}
      style={{ rotate }}
      onDrag={(_, info) => {
        rotate.set(card.baseAngle + info.offset.x * 0.15);
      }}
      onDragEnd={() => {
        // плавно возвращаем базовый наклон
        const start = rotate.get();
        const diff = card.baseAngle - start;
        const steps = 12;
        let i = 0;
        const t = setInterval(() => {
          i++;
          rotate.set(start + (diff * i) / steps);
          if (i >= steps) clearInterval(t);
        }, 16);
      }}
      whileTap={{ scale: 1.04 }}
      className="relative shrink-0 w-[140px] h-[190px] md:w-[180px] md:h-[240px] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing bg-ink-dim"
    >
      <Image
        src={card.src}
        alt={card.alt}
        fill
        sizes="200px"
        className="object-cover pointer-events-none select-none"
        draggable={false}
      />
    </motion.div>
  );
}

export default function HeroDragGallery() {
  const trackX = useMotionValue(0);
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="absolute inset-0 bg-black overflow-hidden" ref={constraintsRef}>
      {/* горизонтальная лента наклонённых карточек */}
      <motion.div
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.15}
        style={{ x: trackX }}
        className="absolute left-1/2 top-[26%] -translate-x-1/2 flex items-center gap-4 md:gap-6 px-10"
      >
        {CARDS.map((card, i) => (
          <DragCard key={i} card={card} />
        ))}
      </motion.div>

      {/* fade по краям, чтобы лента растворялась в чёрном фоне */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #000 0%, transparent 12%, transparent 88%, #000 100%)",
        }}
      />

      {/* центральный портрет — статичный, поверх ленты */}
      <div className="absolute inset-x-0 bottom-0 top-[10%] flex justify-center pointer-events-none">
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
      </div>

      {/* затемнение снизу для читаемости заголовка поверх сцены */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
    </div>
  );
}
