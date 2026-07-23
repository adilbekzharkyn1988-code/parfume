"use client";

import { useState } from 'react';
import { ReviewData } from '@/lib/data'; // Исправлено: теперь импортируется ReviewData
import { ChevronDown, Star } from 'lucide-react';

interface FragranticaReviewsProps {
  rating?: number;
  reviews?: ReviewData[];
}

export default function FragranticaReviews({ rating, reviews }: FragranticaReviewsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!rating && (!reviews || reviews.length === 0)) return null;

  return (
    <div className="mt-8 border-t border-ink/5 pt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gold/10 px-2 py-1 rounded text-gold">
            <Star size={14} className="fill-gold" />
            <span className="font-mono text-sm font-bold">{rating || "—"}</span>
          </div>
          <span className="text-sm text-stone">Рейтинг на Fragrantica</span>
        </div>
        
        {reviews && reviews.length > 0 && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-sm text-wine hover:opacity-70 transition-opacity"
          >
            {reviews.length} отзывов
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>
        )}
      </div>

      {isOpen && reviews && (
        <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {reviews.map((review, index) => (
            <div key={index} className="bg-ivory-dim p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">{review.user}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={10} 
                      className={i < review.rating ? "fill-gold text-gold" : "text-stone/20"} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-ink/80 leading-relaxed italic">
                "{review.text}"
              </p>
            </div>
          ))}
          <a 
            href="https://www.fragrantica.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-center text-[10px] text-stone uppercase tracking-widest hover:text-wine mt-4"
          >
            Читать больше на Fragrantica
          </a>
        </div>
      )}
    </div>
  );
}
