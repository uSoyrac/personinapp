"use client";
import { useEffect, useState } from "react";
import { getGameState, getXPForLevel } from "@/lib/gamification";

export default function XPBar() {
  const [state, setState] = useState({ xp: 0, level: 1, streak: 0 });
  const [progress, setProgress] = useState({ current: 0, needed: 100 });

  useEffect(() => {
    const gs = getGameState();
    setState({ xp: gs.xp, level: gs.level, streak: gs.streak });
    setProgress(getXPForLevel(gs.level));
  }, []);

  const pct = Math.min((progress.current / progress.needed) * 100, 100);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
      {state.streak > 0 && (
        <span style={{ fontSize: "0.75rem", color: "#FFD700", fontWeight: 700 }}>
          🔥{state.streak}
        </span>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "rgba(255,255,255,0.06)", borderRadius: "9999px", padding: "0.25rem 0.625rem 0.25rem 0.375rem" }}>
        <span style={{ fontSize: "0.6875rem", fontWeight: 800, color: "#FFD700", minWidth: "1.25rem", textAlign: "center" }}>
          {state.level}
        </span>
        <div style={{ width: "3.5rem", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #FF6F61, #FFD700)", borderRadius: "2px", transition: "width 0.4s ease" }} />
        </div>
        <span style={{ fontSize: "0.625rem", color: "var(--foreground-faint)" }}>
          {state.xp}xp
        </span>
      </div>
    </div>
  );
}
