"use client";

import { useInView } from "@/lib/useInView";

interface AnimatedBarProps {
  value: number;
  max?: number;
  label: string;
  delay?: number; // ms, для сдвига второй полоски относительно первой
}

export default function AnimatedBar({ value, max = 5, label, delay = 0 }: AnimatedBarProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="eyebrow text-stone">{label}</span>
        <span className="font-mono text-xs text-stone">{value}/{max}</span>
      </div>
      <div className="h-1.5 rounded-full bg-line overflow-hidden">
        <div
          className="h-full bg-wine rounded-full transition-[width] duration-[1100ms] ease-out"
          style={{ width: inView ? `${pct}%` : "0%", transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}
