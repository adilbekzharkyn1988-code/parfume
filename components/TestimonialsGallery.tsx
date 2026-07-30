"use client";

import { useRef, useState } from "react";
import StarRating from "./StarRating";

type Testimonial = {
  name: string;
  rating: number;
  text: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Азамат Т.",
    rating: 5,
    text: "Заказывал распив 5 мл, чтобы не переплачивать за флакон вслепую. Аромат пришёл в тот же день по Алматы, упаковано аккуратно. Теперь беру только тут.",
  },
  {
    name: "Дария К.",
    rating: 5,
    text: "Долго искала, где можно протестировать нишевые бренды без риска на полную стоимость флакона. 10 мл — отличный формат, стойкость как заявлено.",
  },
  {
    name: "Марат С.",
    rating: 4,
    text: "Заказ пришёл на день позже обещанного, но сам аромат оригинальный, батч-код проверил — всё чисто. По качеству вопросов нет.",
  },
  {
    name: "Айгерим Б.",
    rating: 5,
    text: "Первый раз пробовала распив — думала, будет разбавленный. Оказалось, тот же самый парфюм, просто в маленьком флаконе. Пирамида нот на сайте совпадает с реальностью.",
  },
  {
    name: "Ержан Н.",
    rating: 5,
    text: "Оплата прошла удобно, без лишних шагов. Взял сразу два аромата на пробу — оба порадовали, буду брать полные флаконы понравившихся.",
  },
  {
    name: "Полина В.",
    rating: 4,
    text: "Хорошая подборка нишевых домов, которых обычно не найти в обычных магазинах. Цена за мл ощутимо ниже, чем брать целый флакон вслепую.",
  },
  {
    name: "Тимур А.",
    rating: 5,
    text: "Спросил про батч-код перед покупкой — ответили быстро и подробно. Такой подход внушает доверие, сразу видно, что не переливка неизвестного качества.",
  },
  {
    name: "Жанна Р.",
    rating: 5,
    text: "Уже третий заказ подряд. Стойкость и шлейф действительно совпадают с описанием на карточке товара — не завышено ради красивой картинки.",
  },
];

export default function TestimonialsGallery() {
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
    setActive(Math.max(0, Math.min(testimonials.length - 1, index)));
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
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="group flex flex-col shrink-0 snap-start w-[85%] sm:w-[380px] md:w-[420px] bg-white rounded-md border border-ink/10 p-6 gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-wine text-ivory flex items-center justify-center font-display text-lg shrink-0">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="font-body font-semibold text-sm">{t.name}</p>
                <StarRating rating={t.rating} size={13} />
              </div>
            </div>
            <p className="text-sm text-ink/75 leading-relaxed">{t.text}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
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
