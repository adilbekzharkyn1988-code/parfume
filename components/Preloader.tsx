"use client";

import { useEffect, useRef, useState } from "react";

// Показываем сплэш только один раз за сессию вкладки — при переходах между
// страницами внутри сайта layout не перемонтируется, а при обновлении
// страницы в той же вкладке повторный показ будет раздражать.
const SESSION_KEY = "juparfume-preloaded";

type Phase = "start" | "visible" | "collapse" | "done";

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("start");
  const [target, setTarget] = useState({ x: 0, y: 0, scale: 1 });
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem(SESSION_KEY)) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");

    document.body.style.overflow = "hidden";

    // 1) следующий кадр — включаем "визуальное" появление (fade+scale in)
    const raf = requestAnimationFrame(() => setPhase("visible"));

    // 2) после появления и короткой паузы — измеряем, где находится
    // логотип в шапке, и запускаем "сборку" в его размер и позицию
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
    }, 650);

    // 3) когда анимация "сборки" и растворения фона закончилась — убираем
    // прелоадер из DOM и возвращаем скролл
    const doneTimer = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 650 + 500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(collapseTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  const textStyle: React.CSSProperties =
    phase === "collapse"
      ? {
          opacity: 1,
          transform: `translate(${target.x}px, ${target.y}px) scale(${target.scale})`,
          transition: "transform 500ms cubic-bezier(0.65,0,0.35,1)",
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

  return (
    <div
      // pointer-events-none всегда: прелоадер — чисто визуальный слой,
      // клики на странице под ним проходят с самого начала.
      className="fixed inset-0 z-[999] flex items-center justify-center bg-white pointer-events-none"
      style={{
        opacity: phase === "collapse" ? 0 : 1,
        transition: phase === "collapse" ? "opacity 500ms cubic-bezier(0.65,0,0.35,1)" : undefined,
      }}
      aria-hidden
    >
      <div
        ref={textRef}
        className="font-display text-ink tracking-tight text-4xl sm:text-6xl md:text-7xl whitespace-nowrap"
        style={{ willChange: "transform, opacity", ...textStyle }}
      >
        JUPARFUME
      </div>
    </div>
  );
}
