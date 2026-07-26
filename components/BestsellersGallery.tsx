"use client";

import { useRef, useState } from "react";
import { Product } from "@/lib/data";
import BestsellerCard from "./BestsellerCard";

export default function BestsellersGallery({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.children[0] as HTMLElement | undefined;
    if (!firstCard) return;
    const gap = 16; // соответствует gap-4
    const step = firstCard.offsetWidth + gap;
    const index = Math.round(track.scrollLeft / step);
    setActive(Math.max(0, Math.min(products.length - 1, index)));
  }

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.children[0] as HTMLElement | undefined;
    if (!firstCard) return;
    const gap = 16;
    const step = firstCard.offsetWidth + gap;
    track.scrollTo({ left: index * step, behavior: "smooth" });
    setActive(index);
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <BestsellerCard key={p.slug} product={p} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {products.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Слайд ${i + 1}`}
            className="w-2 h-2 rounded-full transition-colors"
            style={{
              background: i === active ? "#1C1712" : "rgba(28,23,18,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
