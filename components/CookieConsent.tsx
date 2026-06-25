"use client";

import { useState, useEffect } from "react";

type Consent = { essential: true; analytics: boolean; marketing: boolean; ts: string };
const KEY = "practiceforge_cookie_consent";

export default function CookieConsent() {
  // Assume a choice exists until we read storage — avoids an SSR/hydration flash.
  const [choiceMade, setChoiceMade] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the stored consent on mount to decide whether to show the banner; must run client-side to stay hydration-safe
    if (!localStorage.getItem(KEY)) setChoiceMade(false);
    const reopen = () => {
      setShowSettings(true);
      setChoiceMade(false);
    };
    window.addEventListener("open-cookie-settings", reopen);
    return () => window.removeEventListener("open-cookie-settings", reopen);
  }, []);

  function save(consent: Consent) {
    localStorage.setItem(KEY, JSON.stringify(consent));
    setChoiceMade(true);
    setShowSettings(false);
  }
  const now = () => new Date().toISOString();
  const acceptAll = () => save({ essential: true, analytics: true, marketing: true, ts: now() });
  const rejectNonEssential = () => save({ essential: true, analytics: false, marketing: false, ts: now() });
  const savePrefs = () => save({ essential: true, analytics, marketing, ts: now() });

  if (choiceMade) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="animate-fadeInFast"
      style={{
        position: "fixed", left: "1rem", right: "1rem", bottom: "1rem", zIndex: 1000,
        maxWidth: "560px", margin: "0 auto",
        background: "var(--surface)", border: "var(--border-width) solid var(--border)",
        borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", padding: "1.5rem",
      }}
    >
      <p style={{ margin: "0 0 0.5rem", fontWeight: 800, fontSize: "1.05rem" }}>🍪 We value your privacy</p>
      <p style={{ margin: "0 0 1rem", fontSize: "0.9rem", color: "var(--foreground-muted)", lineHeight: 1.6 }}>
        We use essential cookies to run the site. With your consent we may also use analytics cookies to improve it. See our{" "}
        <a href="/cookies" style={{ color: "var(--primary)", fontWeight: 600 }}>Cookie Policy</a>.
      </p>

      {showSettings && (
        <div style={{ margin: "0 0 1rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.875rem", opacity: 0.7 }}>
            <span><strong>Essential</strong> — required for the site to work</span>
            <input type="checkbox" checked readOnly />
          </label>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.875rem", cursor: "pointer" }}>
            <span><strong>Analytics</strong> — anonymous usage to improve the product</span>
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          </label>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.875rem", cursor: "pointer" }}>
            <span><strong>Marketing</strong> — personalised offers</span>
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
          </label>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "flex-end" }}>
        {showSettings ? (
          <button className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }} onClick={savePrefs}>
            Save preferences
          </button>
        ) : (
          <button className="btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }} onClick={() => setShowSettings(true)}>
            Settings
          </button>
        )}
        <button className="btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }} onClick={rejectNonEssential}>
          Reject non-essential
        </button>
        <button className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }} onClick={acceptAll}>
          Accept all
        </button>
      </div>
    </div>
  );
}
