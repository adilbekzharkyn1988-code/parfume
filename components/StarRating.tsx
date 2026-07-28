import { Star } from "lucide-react";

// Звёзды рейтинга (например для карточек товара): рейтинг из Contentful
// (поле product.rating, число вроде 4.8) округляется до ближайшей
// половины и рисуется как 5 звёзд — целые закрашенные, при остатке 0.5
// одна половинчатая, остальные — пустой контур.
//
// Примеры округления (Math.round(rating * 2) / 2):
//   4.0 -> 4 целых
//   4.3 -> 4 целых + половина (4.5)
//   4.6 -> 4 целых + половина (4.5)
//   4.8 -> 5 целых (5.0)

export default function StarRating({
  rating,
  size = 14,
  showValue = true,
  className = "",
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  const safeRating = Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 0;
  const rounded = Math.round(safeRating * 2) / 2;
  const fullStars = Math.floor(rounded);
  const hasHalf = rounded - fullStars === 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalf ? 1 : 0));

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={size} className="fill-gold text-gold" />
        ))}

        {hasHalf && (
          <span className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-stone/30" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
              <Star size={size} className="fill-gold text-gold" />
            </span>
          </span>
        )}

        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-stone/30" />
        ))}
      </div>

      {showValue && (
        <span className="font-mono text-xs text-stone">{safeRating.toFixed(1)}</span>
      )}
    </div>
  );
}
