"use client";

import { Snowflake, Sprout, Umbrella, Leaf, Sun, Moon } from "lucide-react";
import { useInView } from "@/lib/useInView";

export interface SeasonalityData {
  winter?: number; // 0-100
  spring?: number;
  summer?: number;
  autumn?: number;
  day?: number;
  evening?: number;
}

interface SeasonalityChartProps {
  data?: SeasonalityData;
}

const ITEMS: { key: keyof SeasonalityData; label: string; icon: typeof Snowflake }[] = [
  { key: "winter", label: "Зима", icon: Snowflake },
  { key: "spring", label: "Весна", icon: Sprout },
  { key: "summer", label: "Лето", icon: Umbrella },
  { key: "autumn", label: "Осень", icon: Leaf },
  { key: "day", label: "День", icon: Sun },
  { key: "evening", label: "Вечер", icon: Moon },
];

export default function SeasonalityChart({ data }: SeasonalityChartProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  if (!data) return null;

  const hasAny = ITEMS.some((i) => typeof data[i.key] === "number");
  if (!hasAny) return null;

  return (
    <div ref={ref} className="bg-ivory-dim rounded-md p-6 md:p-8">
      <p className="eyebrow text-stone mb-6 text-center">Когда носить</p>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-6">
        {ITEMS.map(({ key, label, icon: Icon }, i) => {
          const value = Math.min(100, Math.max(0, data[key] ?? 0));
          return (
            <div key={key} className="flex flex-col items-center text-center">
              <Icon size={20} className="text-wine mb-2" strokeWidth={1.5} />
              <span className="text-[11px] text-stone mb-2">{label}</span>
              <div className="w-full h-1.5 rounded-full bg-line overflow-hidden">
                <div
                  className="h-full bg-wine rounded-full transition-[width] duration-[900ms] ease-out"
                  style={{ width: inView ? `${value}%` : "0%", transitionDelay: `${i * 70}ms` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
