"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ReviewData } from "@/lib/data";
import { Star } from "lucide-react";

interface ProductReviewsProps {
  rating?: number;
  reviewsCount?: number;
  reviews?: ReviewData[];
}

export default function ProductReviews({ rating, reviewsCount, reviews }: ProductReviewsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card]");
    if (!card) return;
    const step = card.offsetWidth + 20;
    setActiveIndex(Math.round(el.scrollLeft / step));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);
    return () => {
      el.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex, reviews]);

  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollTo({ left: i * step, behavior: "smooth" });
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="mt-16 md:mt-20 border-t border-ink/5 pt-10">
      <div className="mb-6">
        <p className="eyebrow text-wine mb-2">Покупатели JUPARFUME</p>
        <h2 className="font-display text-2xl md:text-3xl flex items-center gap-3">
          Отзывы покупателей
          {rating ? (
            <span className="flex items-center gap-1 text-lg font-mono text-gold">
              <Star size={16} className="fill-gold text-gold" />
              {rating}
            </span>
          ) : null}
          <span className="text-lg font-mono text-ink/50">
            ({reviewsCount ?? reviews.length})
          </span>
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review, index) => (
          <div
            key={index}
            data-review-card
            className="border border-ink/15 p-5 rounded-md shrink-0 snap-start w-[78%] xs:w-[70%] sm:w-[320px]"
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

      {reviews.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Отзыв ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-wine" : "w-1.5 bg-ink/15"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
