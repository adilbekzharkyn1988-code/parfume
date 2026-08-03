"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

import amouage from "@/public/amouage.webp";
import initio from "@/public/initio.webp";
import xerjoff from "@/public/xerjoff.webp";
import exnihilo from "@/public/ex-nihilo.webp";
import clivechristian from "@/public/clive-christian.webp";
import creed from "@/public/creed.webp";
import kilian from "@/public/kilian.webp";
import lv from "@/public/lv.webp";
import pdm from "@/public/pdm.webp";
import roja from "@/public/roja.webp";

const UNIQUE_CARDS: StaticImageData[] = [amouage, initio, xerjoff, exnihilo, clivechristian, creed, kilian, lv, pdm, roja];

const REPEATS = 5;
const SLOTS = UNIQUE_CARDS.length * REPEATS;

const SPEED = 0.015;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

type Sizes = { cardW: number; cardH: number; gap: number; maskPct: number };
const DESKTOP: Sizes = { cardW: 120, cardH: 150, gap: 14, maskPct: 16 };
const MOBILE: Sizes = { cardW: 120, cardH: 160, gap: 8, maskPct: 4 };

function GalleryCard({
  src,
  index,
  phase,
  itemWidth,
  slots,
  containerHalfWidth,
  sizes,
}: {
  src: StaticImageData;
  index: number;
  phase: ReturnType<typeof useMotionValue<number>>;
  itemWidth: number;
  slots: number;
  containerHalfWidth: number;
  sizes: Sizes;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const beltWidth = itemWidth * slots;
  const halfBelt = beltWidth / 2;

  useEffect(() => {
    return phase.on("change", (p) => {
      const el = ref.current;
      if (!el) return;
      
      const x = mod(index * itemWidth - p + halfBelt, beltWidth) - halfBelt;
      const norm = Math.min(Math.abs(x) / Math.max(containerHalfWidth, 1), 1);
      
      // Масштаб: центр крупнее, края мельче
      const scale = 0.60 + 0.30 * norm;
      
      // Перспектива: сильнее поворот по краям
      const tilt = -Math.sign(x) * 35 * norm;
      
      el.style.transform = `translateX(${x}px) translateY(-50%) rotateY(${tilt}deg) scale(${scale})`;
      el.style.zIndex = String(Math.round(scale * 100));
    });
  }, [phase, index, itemWidth, beltWidth, halfBelt, containerHalfWidth]);

  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-1/2 rounded-xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.15)]"
      style={{ width: sizes.cardW, height: sizes.cardH, marginLeft: -sizes.cardW / 2 }}
    >
      <Image src={src} alt="" fill sizes="150px" className="object-cover" />
    </div>
  );
}

export default function HeroDragGallery() {
  const phase = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    phase.set(phase.get() + delta * SPEED);
  });

  const [sizes, setSizes] = useState<Sizes>(DESKTOP);
  const [containerHalfWidth, setContainerHalfWidth] = useState(700);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => {
      setSizes(mq.matches ? MOBILE : DESKTOP);
      setContainerHalfWidth(window.innerWidth / 2);
    };
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const itemWidth = sizes.cardW + sizes.gap;

  return (
    <div className="absolute inset-0 bg-white overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: `linear-gradient(to right, transparent 0%, #000 ${sizes.maskPct}%, #000 ${100 - sizes.maskPct}%, transparent 100%)`,
          maskImage: `linear-gradient(to right, transparent 0%, #000 ${sizes.maskPct}%, #000 ${100 - sizes.maskPct}%, transparent 100%)`,
        }}
      >
        <div className="relative w-full h-[26%] top-[10%]" style={{ perspective: "1000px" }}>
          {Array.from({ length: SLOTS }).map((_, i) => (
            <GalleryCard
              key={i}
              src={UNIQUE_CARDS[i % UNIQUE_CARDS.length]}
              index={i}
              phase={phase}
              itemWidth={itemWidth}
              slots={SLOTS}
              containerHalfWidth={containerHalfWidth}
              sizes={sizes}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 80, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 bottom-[20px] md:bottom-[-60px] top-[4%] flex justify-center items-end z-10"
      >
        <div className="relative w-[320px] md:w-[360px]">
          <Image
            src={women}
            alt="Парфюмерия"
            priority
            className="w-full h-auto"
          />
        </div>
      </motion.div>
    </div>
  );
}
