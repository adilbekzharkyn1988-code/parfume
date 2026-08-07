"use client";

import { useEffect, useRef, useState } from "react";

// Показываем сплэш только один раз за сессию вкладки — при переходах между
// страницами внутри сайта layout не перемонтируется, а при обновлении
// страницы в той же вкладке повторный показ будет раздражать.
const SESSION_KEY = "juparfume-preloaded";

const WORD = "JUPARFUME";

// Тайминги эффекта печатной машинки
const LETTER_START_DELAY = 150; // задержка перед первой буквой, мс
const LETTER_STEP = 60; // интервал между буквами, мс
const PAUSE_AFTER_TYPING = 350; // пауза после допечатывания слова, мс

// Тайминги "шторы" фона
const COLLAPSE_DURATION = 700; // общая длительность подъёма фона и сборки лого, мс
const CURTAIN_OVERSHOOT = 130; // насколько выше верхнего края уходит штора (в % высоты)
const CURTAIN_BULGE = 22; // максимальная "просадка" центра относительно краёв (в % высоты)

const TYPING_DURATION = LETTER_START_DELAY + (WORD.length - 1) * LETTER_STEP;
const COLLAPSE_AT = TYPING_DURATION + PAUSE_AFTER_TYPING;
const DONE_AT = COLLAPSE_AT + COLLAPSE_DURATION;

// Плавный "разгон с замедлением" — края шторы уходят быстро в начале
// и выравниваются к концу
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

type Phase = "start" | "visible" | "collapse" | "done";

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("start");
  const [target, setTarget] = useState({ x: 0, y: 0, scale: 1 });
  const [curtainT, setCurtainT] = useState(0); // прогресс подъёма шторы: 0 → 1
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem(SESSION_KEY)) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");

    document.body.style.overflow = "hidden";

    // 1) следующий кадр — включаем "визуальное" появление (fade+scale in),
    // буквы при этом печатаются по очереди поверх этого появления
    const raf = requestAnimationFrame(() => setPhase("visible"));

    // 2) когда слово допечаталось и выдержана пауза — измеряем, где
    // находится логотип в шапке, и запускаем "сборку" в его размер и позицию
    const collapseTimer = setTimeout(() => {
      const logo = document.getElementById("site-logo");
      const source = textRef.current;
      if (logo && source) {
        const t = logo.getBoundingClientRect();
        const s = source.getBoundingClientRect();
        setTarget({
          x: t.left + t.width / 2 - (s.left + s.width / 2),
          y: t.top + t.height / 2 - (s.top + s.height / 2),
          scale: t.height / s.height,
        });
      }
      setPhase("collapse");
    }, COLLAPSE_AT);

    // 3) когда анимация "сборки" и подъёма шторы закончилась — убираем
    // прелоадер из DOM и возвращаем скролл
    const doneTimer = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, DONE_AT);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(collapseTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  // Анимация подъёма шторы через rAF — считаем прогресс сами, чтобы можно
  // было независимо гнуть край в квадратичную кривую (CSS-transition тут
  // не подходит, т.к. форма кривой нелинейная по X)
  useEffect(() => {
    if (phase !== "collapse") return;

    let startTs: number | null = null;
    let raf: number;

    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const elapsed = ts - startTs;
      const t = Math.min(1, elapsed / COLLAPSE_DURATION);
      setCurtainT(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  if (phase === "done") return null;

  const textStyle: React.CSSProperties =
    phase === "collapse"
      ? {
          opacity: 1,
          transform: `translate(${target.x}px, ${target.y}px) scale(${target.scale})`,
          transition: `transform ${COLLAPSE_DURATION}ms cubic-bezier(0.65,0,0.35,1)`,
        }
      : phase === "visible"
      ? {
          opacity: 1,
          transform: "translateY(0) scale(1)",
          transition: "opacity 400ms cubic-bezier(0.22,1,0.36,1), transform 400ms cubic-bezier(0.22,1,0.36,1)",
        }
      : {
          // start — исходное состояние без транзишена, чтобы не "мигнуть"
          opacity: 0,
          transform: "translateY(14px) scale(0.94)",
          transition: "none",
        };

  const showCaret = phase === "start" || phase === "visible";

  // Форма шторы: прямая линия по краям (edgeY), которая уезжает вверх
  // быстрее, чем центр (centerY) — получается дуга-"улыбка", просевшая
  // в середине. К концу (t → 1) обе линии сходятся и штора уезжает за
  // экран уже ровным краем.
  const eased = easeOutCubic(curtainT);
  const edgeY = 100 - CURTAIN_OVERSHOOT * eased;
  const bulge = CURTAIN_BULGE * Math.sin(Math.PI * curtainT);
  const centerY = edgeY + bulge;
  const curtainPath = `M0,0 L100,0 L100,${edgeY.toFixed(2)} Q50,${centerY.toFixed(2)} 0,${edgeY.toFixed(2)} Z`;

  return (
    <div
      // pointer-events-none всегда: прелоадер — чисто визуальный слой,
      // клики на странице под ним проходят с самого начала.
      className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none"
      aria-hidden
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ willChange: "d" }}
      >
        <path d={curtainPath} fill="#ffffff" />
      </svg>

      <div
        ref={textRef}
        className="relative font-display text-ink tracking-tight text-4xl sm:text-6xl md:text-7xl whitespace-nowrap"
        style={{ willChange: "transform, opacity", ...textStyle }}
      >
        {WORD.split("").map((letter, i) => (
          <span
            key={i}
            className="preloader-letter"
            style={{
              animationDelay: `${LETTER_START_DELAY + i * LETTER_STEP}ms`,
            }}
          >
            {letter}
          </span>
        ))}
        {showCaret && <span className="preloader-caret">|</span>}
      </div>
    </div>
  );
}
