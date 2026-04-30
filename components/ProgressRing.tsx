"use client";

export default function ProgressRing({ progress, size = 64, stroke = 5, color = "var(--coral)", children }: {
  progress: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(progress, 100) / 100) * circ;

  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div style={{ position: "relative", zIndex: 1, fontSize: size * 0.22, fontWeight: 800, color: "var(--foreground)" }}>
        {children ?? `${Math.round(progress)}%`}
      </div>
    </div>
  );
}
