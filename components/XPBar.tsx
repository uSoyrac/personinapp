"use client";

import { useEffect, useState } from "react";
import { getGameState } from "@/lib/gamification";

export default function XPBar() {
  const [state, setState] = useState({ xp: 0, level: 1, streak: 0, nextLevelXP: 100 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const s = getGameState();
      setState({ ...s, nextLevelXP: Math.max(100, Math.floor(100 * Math.pow(1.5, s.level - 1))) });
    };
    update();
    window.addEventListener("xp_updated", update);
    return () => window.removeEventListener("xp_updated", update);
  }, []);

  if (!mounted) return <div style={{ width: "160px", height: "32px" }} />;

  const progress = (state.xp / state.nextLevelXP) * 100;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      {/* Level Badge */}
      <div style={{
        background: "var(--sky, #00F0FF)",
        color: "#000",
        border: "var(--border-width) solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "0.5rem 0.75rem",
        fontSize: "0.875rem",
        fontWeight: 900,
        boxShadow: "var(--shadow-sm)",
      }}>
        Lvl {state.level}
      </div>

      {/* Progress Bar Container */}
      <div style={{ display: "flex", flexDirection: "column", width: "120px" }}>
        <div style={{
          width: "100%",
          height: "16px",
          background: "var(--surface)",
          border: "var(--border-width) solid var(--border)",
          borderRadius: "var(--radius-sm)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${Math.min(Math.max(progress, 0), 100)}%`,
            background: "var(--gold)",
            borderRight: progress > 0 && progress < 100 ? "var(--border-width) solid var(--border)" : "none",
            transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.125rem" }}>
          <span style={{ fontSize: "0.625rem", fontWeight: 800 }}>XP</span>
          <span style={{ fontSize: "0.625rem", fontWeight: 800 }}>{state.xp}/{state.nextLevelXP}</span>
        </div>
      </div>

      {/* Streak Badge */}
      {state.streak > 0 && (
        <div style={{
          background: "var(--coral)",
          color: "#000",
          border: "var(--border-width) solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "0.5rem 0.75rem",
          fontSize: "0.875rem",
          fontWeight: 900,
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
        }} title="Daily Streak">
          🔥 {state.streak}
        </div>
      )}
    </div>
  );
}
