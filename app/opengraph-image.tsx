import { ImageResponse } from "next/og";

export const alt = "PracticeForge — AI-Powered IELTS & TOEFL Practice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dynamically generated social-share image (replaces the missing og-image.jpg).
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "90px",
          background: "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "26px", marginBottom: "44px" }}>
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "22px",
              background: "#ffffff",
              color: "#7C3AED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "68px",
              fontWeight: 800,
            }}
          >
            P
          </div>
          <div style={{ fontSize: "44px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            PracticeForge
          </div>
        </div>

        <div
          style={{
            fontSize: "78px",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: "940px",
          }}
        >
          AI-Powered IELTS & TOEFL Practice
        </div>

        <div
          style={{
            fontSize: "34px",
            marginTop: "34px",
            color: "rgba(255,255,255,0.85)",
            maxWidth: "920px",
          }}
        >
          Turn any text into exam-style Reading, Vocabulary & Speaking practice in seconds.
        </div>
      </div>
    ),
    { ...size }
  );
}
