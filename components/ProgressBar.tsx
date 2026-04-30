"use client";

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string; // CSS color string, defaults to var(--brutal-yellow)
  label?: string; // Optional text inside the progress bar
  height?: string; // Height of the bar, defaults to 1.5rem
}

export default function ProgressBar({ progress, color = "var(--brutal-yellow)", label, height = "1.5rem" }: ProgressBarProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div style={{
      width: "100%",
      height: height,
      background: "var(--surface)",
      border: "var(--border-width) solid #000",
      position: "relative",
      overflow: "hidden",
      boxShadow: "2px 2px 0px #1a1a1a",
      borderRadius: "var(--radius-sm)",
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: `${safeProgress}%`,
        background: color,
        borderRight: safeProgress > 0 && safeProgress < 100 ? "var(--border-width) solid #000" : "none",
        transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }} />
      {label && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.75rem", fontWeight: 800, color: "#000",
          zIndex: 1, textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          {label}
        </div>
      )}
    </div>
  );
}
