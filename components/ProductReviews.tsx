"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ReviewData } from "@/lib/data";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface ProductReviewsProps {
  rating?: number;
  reviewsCount?: number;
  reviews?: ReviewData[];
}

export default function ProductReviews({ rating, reviewsCount, reviews }: ProductReviewsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, reviews]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="mt-16 md:mt-20 border-t border-ink/5 pt-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <p className="eyebrow text-wine mb-2">Покупатели JUPARFUME</p>
          <h2 className="font-display text-2xl md:text-3xl flex items-center gap-3">
            Отзывы покупателей
            {rating ? (
              <span className="flex items-center gap-1 text-lg font-mono text-gold">
                <Star size={16} className="fill-gold text-gold" />
                {rating}
              </span>
            ) : null}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-ink/60">{reviewsCount ?? reviews.length} отзывов</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Предыдущие отзывы"
              className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ivory-dim transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Следующие отзывы"
              className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ivory-dim transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review, index) => (
          <div
            key={index}
            data-review-card
            className="bg-ivory-dim p-5 rounded-md shrink-0 snap-start w-[78%] xs:w-[70%] sm:w-[320px]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">{review.user}</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={i < review.rating ? "fill-gold text-gold" : "text-stone/20"}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-ink/80 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
