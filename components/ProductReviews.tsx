"use client";

import { useState } from "react";
import { ReviewData } from "@/lib/data";
import { ChevronDown, Star } from "lucide-react";

interface ProductReviewsProps {
  rating?: number;
  reviewsCount?: number;
  reviews?: ReviewData[];
}

export default function ProductReviews({ rating, reviewsCount, reviews }: ProductReviewsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="mt-16 md:mt-20 border-t border-ink/5 pt-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow text-wine mb-2">Покупатели ORIGINE</p>
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

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm text-wine hover:opacity-70 transition-opacity"
        >
          {reviewsCount ?? reviews.length} отзывов
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 grid sm:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
          {reviews.map((review, index) => (
            <div key={index} className="bg-ivory-dim p-5 rounded-md">
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
      )}
    </section>
  );
}
