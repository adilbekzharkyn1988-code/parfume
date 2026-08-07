"use client";

import { useEffect, useRef, useState } from "react";

// Показываем сплэш только один раз за сессию вкладки — при переходах между
// страницами внутри сайта layout не перемонтируется, а при обновлении
// страницы в той же вкладке повторный показ будет раздражать.
const SESSION_KEY = "juparfume-preloaded";

const WORD = "JUPARFUME";

// Тайминги "открывания" текста градиентной маской слева направо
const REVEAL_START_DELAY = 150; // задержка перед началом движения маски, мс
const REVEAL_DURATION = 750; // сколько маска едет через весь текст, мс
const REVEAL_EDGE = 16; // ширина мягкого размытого края маски, в % ширины текста
const PAUSE_AFTER_REVEAL = 350; // пауза после того, как текст полностью открылся, мс

// Тайминги "сборки": сначала текст стягивается в лого, и только следом,
// с небольшим отставанием, за ним поднимается фон
const TEXT_COLLAPSE_DURATION = 650; // сколько едет текст к позиции лого, мс
const CURTAIN_DELAY = 220; // на сколько штора стартует позже текста, мс
const CURTAIN_RISE_DURATION = 650; // сама длительность подъёма шторы, мс
const CURTAIN_OVERSHOOT = 130; // насколько выше верхнего края уходит штора (в % высоты)
const CURTAIN_BULGE = 22; // максимальная "просадка" центра относительно краёв (в % высоты)

const COLLAPSE_AT = REVEAL_START_DELAY + REVEAL_DURATION + PAUSE_AFTER_REVEAL;
const DONE_AT = COLLAPSE_AT + CURTAIN_DELAY + CURTAIN_RISE_DURATION;

// Плавный разгон/торможение для обеих rAF-анимаций
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

type Phase = "start" | "visible" | "collapse" | "done";

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("start");
  const [target, setTarget] = useState({ x: 0, y: 0, scale: 1 });
  const [revealT, setRevealT] = useState(0); // прогресс открытия маски: 0 → 1
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
    // текст при этом открывается слева направо градиентной маской
    const raf = requestAnimationFrame(() => setPhase("visible"));

    // 2) когда текст полностью открылся и выдержана пауза — измеряем, где
    // находится логотип в шапке, и запускаем "сборку": текст едет к лого,
    // фон поднимается следом с задержкой (см. эффект ниже)
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

    // 3) когда сборка текста и подъём шторы закончились — убираем
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

  // Анимация открытия маски (rAF, а не CSS-transition — градиенты
  // не интерполируются надёжно между разными браузерами)
  useEffect(() => {
    if (phase !== "visible") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealT(1);
      return;
    }

    let startTs: number | null = null;
    let raf: number;

    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const elapsed = ts - startTs - REVEAL_START_DELAY;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, elapsed / REVEAL_DURATION);
      setRevealT(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Анимация подъёма шторы — стартует с задержкой относительно текста
  useEffect(() => {
    if (phase !== "collapse") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurtainT(1);
      return;
    }

    let startTs: number | null = null;
    let raf: number;

    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const elapsed = ts - startTs - CURTAIN_DELAY;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, elapsed / CURTAIN_RISE_DURATION);
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
          transition: `transform ${TEXT_COLLAPSE_DURATION}ms cubic-bezier(0.65,0,0.35,1)`,
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

  // Градиентная маска, открывающая текст слева направо: слева от "фронта"
  // текст полностью непрозрачен (уже открыт), дальше — мягкая растушёванная
  // полоса шириной REVEAL_EDGE, а справа — ещё скрыто. REVEAL_EDGE добавлен
  // к диапазону прогресса, чтобы в конце маска полностью снималась.
  const revealPercent = easeInOutCubic(revealT) * (100 + REVEAL_EDGE);
  const maskStop2 = Math.min(100, Math.max(0, revealPercent - REVEAL_EDGE));
  const maskStop3 = Math.min(100, Math.max(0, revealPercent));
  const maskImage = `linear-gradient(to right, #000 ${maskStop2}%, transparent ${maskStop3}%)`;

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
        style={{
          willChange: "transform, opacity",
          maskImage,
          WebkitMaskImage: maskImage,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          ...textStyle,
        }}
      >
        {WORD}
      </div>
    </div>
  );
}
