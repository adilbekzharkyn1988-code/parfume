import { CSSProperties } from "react";

export default function PerfumeBottleIcon({
  size = 20,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size * (60 / 46)}
      viewBox="0 0 46 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M17 4h12v8c0 2 2 3 3 5 2 3 4 6 4 12v25a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V29c0-6 2-9 4-12 1-2 3-3 3-5V4z"
        fill="currentColor"
      />
    </svg>
  );
}
