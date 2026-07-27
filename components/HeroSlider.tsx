"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { heroSlides, type HeroSlide } from "@/lib/heroSlides";

const AUTOPLAY_MS = 6000;

export default function HeroSlider({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = heroSlides.length;

  const goTo = useCallback((next: number) => {
    setIndex(((next % count) + count) % count);
  }, [count]);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Автопрокрутка — останавливается при наведении/фокусе/касании.
  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => {
      setIndex((v) => (v + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, count]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  }

  return (
    <div
      className={`relative rounded-md overflow-hidden bg-ivory-dim ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Слайдер"
    >
      <div className="relative aspect-[4/5] sm:aspect-[16/10] md:aspect-[4/5] w-full">
        {heroSlides.map((slide, i) => (
          <SlideMedia key={slide.id} slide={slide} active={i === index} />
        ))}

        {/* затемнение снизу для читаемости заголовка/кнопки */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

        {/* контент слайда: заголовок + кнопка (своя для каждого слайда) */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 flex flex-col items-start gap-3">
          {heroSlides[index].eyebrow && (
            <p className="eyebrow text-gold-soft">{heroSlides[index].eyebrow}</p>
          )}
          <h3 className="font-display text-xl md:text-2xl text-ivory leading-snug max-w-xs">
            {heroSlides[index].title}
          </h3>
          <Link
            href={heroSlides[index].buttonHref}
            className="eyebrow rounded-full px-5 py-3 bg-ivory text-ink hover:bg-gold-soft transition-colors inline-flex items-center gap-2"
          >
            {heroSlides[index].buttonText} <ArrowRight size={14} />
          </Link>
        </div>

      </div>

      {/* точки-индикаторы */}
      {count > 1 && (
        <div className="absolute top-3 inset-x-0 flex items-center justify-center gap-1.5">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Перейти к слайду ${i + 1}`}
              aria-current={i === index}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 20 : 6,
                background: i === index ? "#F6F1E9" : "rgba(246,241,233,0.5)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SlideMedia({ slide, active }: { slide: HeroSlide; active: boolean }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ${
        active ? "opacity-100 z-[1]" : "opacity-0 pointer-events-none"
      }`}
    >
      {failed ? (
        // Заглушка на случай, если файл ещё не добавлен в /public/slider —
        // как только появится src, заглушка исчезнет сама.
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ink to-wine-dark">
          <span className="font-display text-ivory/60 text-sm px-6 text-center">
            {slide.type === "video" ? "Видео появится здесь" : "Фото появится здесь"}
          </span>
        </div>
      ) : slide.type === "video" ? (
        <video
          className="w-full h-full object-cover"
          src={slide.src}
          poster={slide.poster}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setFailed(true)}
        />
      ) : (
        <img
          src={slide.src}
          alt={slide.alt}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
