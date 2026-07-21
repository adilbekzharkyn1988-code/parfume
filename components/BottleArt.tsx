import { familyColor, Family } from "@/lib/data";

export default function BottleArt({
  family,
  className = "",
}: {
  family: Family;
  className?: string;
}) {
  const c = familyColor[family];
  const gradId = `grad-${family}`;
  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      role="img"
      aria-label={`Иллюстрация аромата семейства ${family}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.base} stopOpacity="0.95" />
          <stop offset="100%" stopColor={c.text} stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* backdrop */}
      <rect x="0" y="0" width="200" height="260" fill={c.soft} />
      {/* cap */}
      <rect x="82" y="18" width="36" height="26" rx="4" fill={c.text} />
      <rect x="94" y="4" width="12" height="18" rx="2" fill={c.text} />
      {/* neck */}
      <rect x="90" y="44" width="20" height="16" fill={`url(#${gradId})`} />
      {/* body */}
      <path
        d="M62 60 H138 C142 60 146 64 146 70 V210 C146 226 134 238 118 238 H82 C66 238 54 226 54 210 V70 C54 64 58 60 62 60 Z"
        fill={`url(#${gradId})`}
      />
      {/* liquid line */}
      <rect x="58" y="150" width="84" height="4" fill={c.soft} opacity="0.35" />
      {/* label */}
      <rect x="70" y="120" width="60" height="34" rx="2" fill={c.soft} opacity="0.9" />
      <line x1="78" y1="132" x2="122" y2="132" stroke={c.text} strokeWidth="1.4" opacity="0.6" />
      <line x1="78" y1="140" x2="112" y2="140" stroke={c.text} strokeWidth="1.4" opacity="0.4" />
      {/* highlight */}
      <rect x="62" y="70" width="8" height="150" rx="4" fill="#fff" opacity="0.18" />
    </svg>
  );
}
