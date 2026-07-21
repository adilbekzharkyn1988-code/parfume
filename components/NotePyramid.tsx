import { Product } from "@/lib/data";

export default function NotePyramid({ notes }: { notes: Product["notes"] }) {
  const rows: { label: string; items: string[]; width: string }[] = [
    { label: "Верхние ноты", items: notes.top, width: "60%" },
    { label: "Ноты сердца", items: notes.heart, width: "80%" },
    { label: "Базовые ноты", items: notes.base, width: "100%" },
  ];
  return (
    <div className="flex flex-col items-center gap-2">
      {rows.map((row, i) => (
        <div key={row.label} className="w-full flex flex-col items-center gap-2">
          <div
            className="rounded-sm border border-ink/15 bg-ivory-dim/60 px-4 py-3 text-center"
            style={{ width: row.width }}
          >
            <p className="eyebrow text-stone mb-1">
              {String(i + 1).padStart(2, "0")} — {row.label}
            </p>
            <p className="font-display text-[15px] md:text-base text-ink">
              {row.items.join(" · ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
