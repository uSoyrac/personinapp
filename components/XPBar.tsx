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
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "0.15rem 0.4rem",
        fontSize: "0.7rem",
        fontWeight: 800,
        boxShadow: "1px 1px 0px #000",
      }}>
        Lvl {state.level}
      </div>

      {/* Progress Bar Container */}
      <div style={{ display: "flex", flexDirection: "column", width: "80px" }}>
        <div style={{
          width: "100%",
          height: "8px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "9999px",
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
            borderRight: progress > 0 && progress < 100 ? "1px solid var(--border)" : "none",
            transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.125rem" }}>
          <span style={{ fontSize: "0.6rem", fontWeight: 700 }}>XP</span>
          <span style={{ fontSize: "0.6rem", fontWeight: 700 }}>{state.xp}/{state.nextLevelXP}</span>
        </div>
      </div>

      {/* Streak Badge */}
      {state.streak > 0 && (
        <div style={{
          background: "var(--coral)",
          color: "#000",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "0.15rem 0.4rem",
          fontSize: "0.7rem",
          fontWeight: 800,
          boxShadow: "1px 1px 0px #000",
          display: "flex",
          alignItems: "center",
          gap: "0.15rem",
        }} title="Daily Streak">
          🔥 {state.streak}
        </div>
      )}
    </div>
  );
}
