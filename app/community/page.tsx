"use client";

import { useState, useEffect } from "react";
import type { UserTier } from "@/types";

export default function CommunityPage() {
  const [tier, setTier] = useState<UserTier | null>(null);

  useEffect(() => {
    const savedTier = localStorage.getItem("practiceforge_tier") as UserTier | null;
    setTier(savedTier || "free");
  }, []);

  if (!tier) return <div style={{ padding: "5rem", textAlign: "center" }}>Loading...</div>;

  const isGold = tier === "gold";

  return (
    <div className="section" style={{ paddingTop: "3rem" }}>
      <div className="container">
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          
          <div style={{ marginBottom: "2.5rem" }}>
            <div className="badge badge-primary" style={{ marginBottom: "0.75rem", display: "inline-flex" }}>
              Exclusive
            </div>
            <h1 style={{ margin: "0 0 0.5rem", color: "var(--foreground)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              Gold Community
            </h1>
            <p style={{ margin: 0, fontSize: "1.125rem", color: "var(--foreground-muted)" }}>
              Connect with other high-achieving students, share resources, and get expert feedback.
            </p>
          </div>

          {!isGold ? (
            <div className="card" style={{ textAlign: "center", padding: "4rem 2rem", border: "4px solid var(--rose)", boxShadow: "8px 8px 0px var(--rose)" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔒</div>
              <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--foreground)" }}>Members Only</h2>
              <p style={{ fontSize: "1.125rem", color: "var(--foreground-muted)", marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem" }}>
                The PracticeForge Community is an exclusive space for Gold members to discuss strategies, practice speaking together, and review each other's essays.
              </p>
              <a href="/pricing" className="btn-primary" style={{ background: "var(--brutal-yellow)", color: "#000", display: "inline-block" }}>
                Upgrade to Gold
              </a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Recent Discussions</h3>
                <button className="btn-primary" style={{ background: "var(--brutal-green)", color: "#000" }}>+ New Topic</button>
              </div>

              <div className="card" style={{ display: "flex", gap: "1rem", alignItems: "center", cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateX(5px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}>
                <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "var(--brutal-blue)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#000", fontSize: "1.5rem" }}>A</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 0.25rem", fontSize: "1.125rem" }}>Looking for an IELTS Speaking Partner (Band 7.0 target)</h4>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground-muted)" }}>By Alex · 2 hours ago · 14 replies</p>
                </div>
              </div>

              <div className="card" style={{ display: "flex", gap: "1rem", alignItems: "center", cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateX(5px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}>
                <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "var(--rose)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: "1.5rem" }}>M</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 0.25rem", fontSize: "1.125rem" }}>How to avoid repeating words in Writing Task 2?</h4>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground-muted)" }}>By Maria · 5 hours ago · 8 replies</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
