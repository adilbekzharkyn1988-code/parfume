"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/data";
import { toPlainText } from "@/lib/format";
import BottleArt from "./BottleArt";

export default function RelatedArticlesSlider({ articles }: { articles: Article[] }) {
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
    setActive(Math.max(0, Math.min(articles.length - 1, index)));
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
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/articles/${a.slug}`}
            className="group flex flex-col shrink-0 snap-start w-[85%] sm:w-[380px] md:w-[420px] rounded-md border border-ink/10 overflow-hidden bg-paper"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              {a.image ? (
                <Image
                  src={a.image}
                  alt={toPlainText(a.title)}
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 768px) 380px, 420px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <BottleArt family={a.cover} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
              )}
            </div>
            <div className="p-5">
              <p className="eyebrow text-stone mb-2">{toPlainText(a.category)} · {toPlainText(a.readTime)}</p>
              <h3 className="font-display text-lg leading-snug group-hover:text-wine transition-colors">
                {toPlainText(a.title)}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {articles.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {articles.map((_, i) => (
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
      )}
    </div>
  );
}
