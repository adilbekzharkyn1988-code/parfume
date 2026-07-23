// components/FragranticaReviews.tsx
'use client';

import { useState } from 'react';
import { Review } from '@/lib/data';
import { ChevronDown } from 'lucide-react';

interface FragranticaReviewsProps {
  rating?: number;
  reviews?: Review[];
}

export default function FragranticaReviews({ rating, reviews }: FragranticaReviewsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-ink/10 py-6">
      {/* Header с рейтингом */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left transition-colors hover:text-wine"
      >
        <div className="flex items-center gap-3">
          <div>
            <p className="eyebrow text-stone mb-1">Отзывы на Fragrantica</p>
            {rating && (
              <div className="flex items-center gap-2">
                <span className="font-display text-lg">{rating.toFixed(2)}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.round(rating) ? 'text-wine' : 'text-stone/30'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-stone">({reviews.length})</span>
              </div>
            )}
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Отзывы */}
      {isOpen && (
        <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-paper p-4 rounded-md border border-ink/5 hover:border-wine/20 transition-colors"
            >
              {/* Рейтинг отзыва */}
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-sm font-semibold text-ink">{review.user}</p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i < review.rating ? 'text-wine' : 'text-stone/20'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Текст отзыва */}
              <p className="text-sm leading-relaxed text-stone">"{review.text}"</p>
            </div>
          ))}

          {/* Ссылка на Fragrantica */}
          <div className="pt-2 border-t border-ink/5">
            <a
              href="https://www.fragrantica.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-stone hover:text-wine transition-colors underline"
            >
              Читать все отзывы на Fragrantica →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
