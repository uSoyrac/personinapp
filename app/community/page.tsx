"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";

export default function CommunityPage() {
  const { isPremium, setIsPremium } = useAppContext();
  const [ticketCreated, setTicketCreated] = useState(false);

  if (!isPremium) {
    return (
      <div className="section" style={{ paddingTop: "2.5rem" }}>
        <div className="container">
          <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
            <h2 style={{ marginBottom: "1rem" }}>Premium Feature</h2>
            <p style={{ color: "var(--foreground-muted)", marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem" }}>
              Community access and real partner matching is only available for premium members. Upgrade now to join our Discord community.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <a href="/pricing" className="btn-primary">Upgrade to Premium</a>
              <button onClick={() => setIsPremium(true)} className="btn-secondary">Simulate Premium (Dev)</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateTicket = () => {
    setTicketCreated(true);
    setTimeout(() => setTicketCreated(false), 3000);
  };

  return (
    <div className="section" style={{ paddingTop: "2.5rem" }}>
      <div className="container">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          
          <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ margin: "0 0 0.5rem", fontSize: "clamp(2rem, 5vw, 3rem)" }}>
                Premium Community
              </h1>
              <p style={{ color: "var(--foreground-muted)" }}>Connect with real partners and get support.</p>
            </div>
            <button onClick={() => setIsPremium(false)} className="btn-secondary" style={{ color: "var(--rose)", borderColor: "var(--rose)" }}>
              Dev: Lock Premium
            </button>
          </div>

          <div className="card" style={{ padding: "2rem", marginBottom: "2rem", background: "linear-gradient(135deg, var(--surface), var(--primary-glow))", border: "1px solid var(--primary-light)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>💬</div>
            <h3 style={{ marginBottom: "0.5rem" }}>Join Our Discord</h3>
            <p style={{ color: "var(--foreground-muted)", marginBottom: "1.5rem" }}>
              Get access to exclusive channels where you can find real speaking partners, participate in live study sessions, and interact with teachers.
            </p>
            <a href="https://discord.gg/example" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Join Discord Server
            </a>
          </div>

          <div className="card" style={{ padding: "2rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎫</div>
            <h3 style={{ marginBottom: "0.5rem" }}>Create a Support Ticket</h3>
            <p style={{ color: "var(--foreground-muted)", marginBottom: "1.5rem" }}>
              Need help with a specific topic or looking for a partner for a scheduled time? Create a ticket and our team will assist you or match you with a partner.
            </p>
            <button 
              onClick={handleCreateTicket} 
              className="btn-secondary"
              disabled={ticketCreated}
            >
              {ticketCreated ? "Ticket Created! Check Discord." : "Create Ticket"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
