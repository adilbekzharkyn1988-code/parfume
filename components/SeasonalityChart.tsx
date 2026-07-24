import { Snowflake, Sprout, Umbrella, Leaf, Sun, Moon } from "lucide-react";

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
  if (!data) return null;

  const hasAny = ITEMS.some((i) => typeof data[i.key] === "number");
  if (!hasAny) return null;

  return (
    <div className="bg-ivory-dim rounded-md p-6 md:p-8">
      <p className="eyebrow text-stone mb-6 text-center">Когда носить</p>
      <div className="grid grid-cols-3 gap-x-4 gap-y-6">
        {ITEMS.map(({ key, label, icon: Icon }) => {
          const value = data[key] ?? 0;
          return (
            <div key={key} className="flex flex-col items-center text-center">
              <Icon size={20} className="text-wine mb-2" strokeWidth={1.5} />
              <span className="text-[11px] text-stone mb-2">{label}</span>
              <div className="w-full h-1.5 rounded-full bg-ink/10 overflow-hidden">
                <div
                  className="h-full bg-wine rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
