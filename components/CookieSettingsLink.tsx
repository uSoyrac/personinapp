"use client";

// Footer link that re-opens the cookie consent panel.
export default function CookieSettingsLink() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        fontSize: "0.875rem",
        color: "var(--foreground-muted)",
        textAlign: "left",
        fontFamily: "inherit",
      }}
    >
      Cookie settings
    </button>
  );
}
