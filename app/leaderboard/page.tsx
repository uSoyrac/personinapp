"use client";

import { useState, useEffect, useMemo } from "react";
import { getLeaderboard, Timeframe, Region, LeaderboardUser } from "@/lib/leaderboard";
import { LANGUAGE_FLAGS } from "@/lib/translations";

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("weekly");
  const [region, setRegion] = useState<Region>("worldwide");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const board = useMemo(() => {
    if (!mounted) return [];
    return getLeaderboard(timeframe, region).slice(0, 50); // Top 50
  }, [timeframe, region, mounted]);

  const top3 = board.slice(0, 3);
  const rest = board.slice(3);

  const getFlag = (code: string) => LANGUAGE_FLAGS[code as keyof typeof LANGUAGE_FLAGS] || "🌍";

  const getXP = (u: LeaderboardUser) => {
    if (timeframe === "weekly") return u.xpWeekly;
    if (timeframe === "monthly") return u.xpMonthly;
    return u.xpAllTime;
  };

  if (!mounted) return null;

  return (
    <div className="section" style={{ paddingTop: "2.5rem" }}>
      <div className="container">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ margin: "0 0 0.5rem", color: "var(--foreground)", fontSize: "clamp(2rem, 5vw, 3rem)", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
                Leaderboard
              </h1>
              <p style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--foreground-muted)" }}>Compete with learners worldwide.</p>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <div className="card" style={{ display: "flex", padding: "0.5rem", gap: "0.5rem", flexGrow: 1 }}>
              {(["weekly", "monthly", "allTime"] as Timeframe[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  style={{
                    flex: 1, padding: "0.75rem", borderRadius: "0", fontSize: "0.875rem", fontWeight: 900, textTransform: "uppercase",
                    background: timeframe === t ? "var(--foreground)" : "transparent",
                    color: timeframe === t ? "var(--bg)" : "var(--foreground)",
                    border: timeframe === t ? "2px solid #000" : "2px solid transparent",
                    boxShadow: timeframe === t ? "4px 4px 0px #000" : "none",
                    cursor: "pointer", transition: "all 0.1s"
                  }}
                >
                  {t === "allTime" ? "All Time" : t}
                </button>
              ))}
            </div>

            <div className="card" style={{ display: "flex", padding: "0.5rem", gap: "0.5rem" }}>
              <button
                onClick={() => setRegion("worldwide")}
                style={{
                  padding: "0.75rem 1.5rem", borderRadius: "0", fontSize: "0.875rem", fontWeight: 900, textTransform: "uppercase",
                  background: region === "worldwide" ? "var(--brutal-yellow)" : "transparent",
                  border: region === "worldwide" ? "2px solid #000" : "2px solid transparent",
                  boxShadow: region === "worldwide" ? "4px 4px 0px #000" : "none",
                  color: "#000", cursor: "pointer", transition: "all 0.1s"
                }}
              >
                🌍 Worldwide
              </button>
              <button
                onClick={() => setRegion("national")}
                style={{
                  padding: "0.75rem 1.5rem", borderRadius: "0", fontSize: "0.875rem", fontWeight: 900, textTransform: "uppercase",
                  background: region === "national" ? "var(--brutal-yellow)" : "transparent",
                  border: region === "national" ? "2px solid #000" : "2px solid transparent",
                  boxShadow: region === "national" ? "4px 4px 0px #000" : "none",
                  color: "#000", cursor: "pointer", transition: "all 0.1s"
                }}
              >
                📍 National
              </button>
            </div>
          </div>

          {/* Podium */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem", alignItems: "end" }}>
            {[
              { u: top3[1], rank: 2, height: "180px", color: "#E5E7EB" }, // Silver
              { u: top3[0], rank: 1, height: "220px", color: "var(--brutal-yellow)" }, // Gold
              { u: top3[2], rank: 3, height: "150px", color: "#FFA8E4" }, // Bronze (Pink)
            ].map((p, i) => {
              if (!p.u) return <div key={i} />;
              return (
                <div key={p.rank} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: p.u.avatarColor, border: "3px solid #000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1.25rem", color: "#fff", textShadow: "1px 1px 0 #000" }}>
                      {p.u.name.charAt(0)}
                    </div>
                    {p.u.isCurrentUser && <div style={{ position: "absolute", top: -5, right: -5, background: "var(--brutal-green)", border: "2px solid #000", borderRadius: "50%", width: 14, height: 14 }} />}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontWeight: 900, fontSize: "1rem", color: "var(--foreground)" }}>{p.u.isCurrentUser ? "YOU" : p.u.name}</p>
                    <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground-muted)" }}>{getFlag(p.u.country)} {getXP(p.u)} XP</p>
                  </div>
                  <div className="card" style={{ width: "100%", height: p.height, background: p.color, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "1rem", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", borderBottomWidth: 0, boxShadow: "none" }}>
                    <span style={{ fontSize: "3rem", fontWeight: 900, fontFamily: "var(--font-display)", opacity: 0.5, color: "#000" }}>{p.rank}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* List */}
          <div className="card" style={{ padding: "0" }}>
            {rest.map((u, i) => {
              const rank = i + 4;
              return (
                <div key={u.id} style={{ 
                  display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem 1.5rem",
                  borderBottom: i === rest.length - 1 ? "none" : "2px solid #000",
                  background: u.isCurrentUser ? "var(--brutal-green)" : "transparent"
                }}>
                  <div style={{ width: "2rem", fontWeight: 900, fontSize: "1.25rem", color: u.isCurrentUser ? "#000" : "var(--foreground-muted)", fontFamily: "var(--font-display)" }}>
                    {rank}
                  </div>
                  <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: u.avatarColor, border: "2px solid #000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", textShadow: "1px 1px 0 #000", flexShrink: 0 }}>
                    {u.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 900, fontSize: "1rem", color: u.isCurrentUser ? "#000" : "var(--foreground)" }}>
                      {u.name} {u.isCurrentUser && "(You)"}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, color: u.isCurrentUser ? "rgba(0,0,0,0.7)" : "var(--foreground-muted)" }}>
                      {getFlag(u.country)}
                    </p>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "1.125rem", fontFamily: "var(--font-display)", color: u.isCurrentUser ? "#000" : "var(--foreground)" }}>
                    {getXP(u)} XP
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
