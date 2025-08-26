"use client";

type Props = {
  /** Tailwind size classes like "w-12 h-12" */
  className?: string;
  /** Stroke/fill color; defaults to currentColor so it adapts to text color */
  color?: string;
  /** Use this when the background is dark (hero overlay) */
  onDark?: boolean;
};

export default function Flourish({
  className = "w-12 h-12",
  color,
  onDark,
}: Props) {
  // default color: inherit from parent (text-* classes).
  const stroke = color ?? "currentColor";
  const leafFill = onDark ? "currentColor" : "none";
  const leafOpacity = onDark ? 0.25 : 0.15;

  return (
    <svg
      viewBox="0 0 200 80"
      className={`${className} mx-auto`}
      fill="none"
      aria-hidden="true"
    >
      {/* subtle watercolor-ish leaf shapes (soft fills) */}
      <path
        d="M26 44c12-10 22-12 30-10-6 8-18 16-30 10Z"
        fill={leafFill}
        opacity={leafOpacity}
      />
      <path
        d="M174 44c-12-10-22-12-30-10 6 8 18 16 30 10Z"
        fill={leafFill}
        opacity={leafOpacity}
      />

      {/* main flourish line */}
      <path
        d="M10 40c24 0 42-12 64-12 28 0 32 24 26 28-6 4-20-2-10-12 12-12 34-16 52-16 14 0 32 4 48 12"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* small leaves on the left stem */}
      <path
        d="M40 30c-6 0-10 6-10 6s6 2 12-2"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M56 28c-6-2-12 2-12 2s5 5 12 2"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* small leaves on the right stem */}
      <path
        d="M160 30c6 0 10 6 10 6s-6 2-12-2"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M144 28c6-2 12 2 12 2s-5 5-12 2"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* wedding rings (center) */}
      <g transform="translate(100,46)">
        <circle r="10" cx="-8" cy="0" stroke={stroke} strokeWidth="2" />
        <circle r="10" cx="8" cy="0" stroke={stroke} strokeWidth="2" />
        {/* tiny sparkle */}
        <path d="M0 -16 l2 3 -2 3 -2-3 2-3Z" fill={stroke} opacity="0.6" />
      </g>
    </svg>
  );
}
