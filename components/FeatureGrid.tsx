"use client";

// Vivid Neo-Brutalist color palette inspired by the references
const COLORS = [
  "#FFE200", // Yellow
  "#D4FF00", // Lime Green
  "#FFA8E4", // Pink
  "#A45EE5", // Purple
  "#8CE0FF", // Sky Blue
  "#FF9CEE", // Rose
  "#FFE200", // Yellow
  "#D4FF00", // Lime Green
];

const WHAT_IT_CREATES = [
  { 
    icon: <svg viewBox="0 0 100 100" width="64" height="64"><rect x="20" y="20" width="60" height="60" fill="#000" /><circle cx="50" cy="50" r="15" fill="#FFF" /><path d="M20 20 L80 80" stroke="#FFF" strokeWidth="4" /></svg>, 
    label: "Text Summary" 
  },
  { 
    icon: <svg viewBox="0 0 100 100" width="64" height="64"><polygon points="50,10 90,90 10,90" fill="none" stroke="#000" strokeWidth="8"/><circle cx="50" cy="65" r="10" fill="#000"/></svg>, 
    label: "Reading Questions" 
  },
  { 
    icon: <svg viewBox="0 0 100 100" width="64" height="64"><path d="M10 50 Q50 10 90 50 T10 50" fill="#000"/><circle cx="50" cy="40" r="12" fill="#FFF"/></svg>, 
    label: "Vocabulary List" 
  },
  { 
    icon: <svg viewBox="0 0 100 100" width="64" height="64"><rect x="10" y="40" width="80" height="20" fill="#000"/><rect x="40" y="10" width="20" height="80" fill="#000"/></svg>, 
    label: "Writing Prompt" 
  },
  { 
    icon: <svg viewBox="0 0 100 100" width="64" height="64"><circle cx="50" cy="50" r="40" fill="none" stroke="#000" strokeWidth="8" strokeDasharray="10 10"/></svg>, 
    label: "Speaking Prompt" 
  },
  { 
    icon: <svg viewBox="0 0 100 100" width="64" height="64"><rect x="10" y="10" width="35" height="35" fill="#000"/><rect x="55" y="55" width="35" height="35" fill="#000"/><circle cx="72.5" cy="27.5" r="17.5" fill="none" stroke="#000" strokeWidth="6"/></svg>, 
    label: "7-Day Study Plan" 
  },
  { 
    icon: <svg viewBox="0 0 100 100" width="64" height="64"><path d="M20 80 L50 20 L80 80 Z" fill="#000"/><circle cx="50" cy="60" r="8" fill="#FFF"/></svg>, 
    label: "Answer Explanations" 
  },
  { 
    icon: <svg viewBox="0 0 100 100" width="64" height="64"><rect x="20" y="20" width="60" height="60" fill="none" stroke="#000" strokeWidth="8"/><line x1="20" y1="20" x2="80" y2="80" stroke="#000" strokeWidth="8"/></svg>, 
    label: "Writing Feedback" 
  },
];

export default function FeatureGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
        gap: "1.5rem",
      }}
    >
      {WHAT_IT_CREATES.map((item, idx) => (
        <div
          key={item.label}
          className="card"
          style={{
            position: "relative",
            overflow: "hidden",
            textAlign: "left",
            padding: "2rem 1.5rem",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            cursor: "default",
            background: COLORS[idx % COLORS.length],
            border: "4px solid #000",
            boxShadow: "8px 8px 0px #000",
            borderRadius: "0", // Brutalist sharp edges
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            minHeight: "180px",
            gap: "1.5rem"
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translate(-4px, -4px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "12px 12px 0px #000";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "8px 8px 0px #000";
          }}
        >
          {/* Watermark Number */}
          <div style={{
            position: "absolute", top: "0.5rem", right: "0.5rem",
            fontSize: "4rem", fontWeight: 900, opacity: 0.15, fontFamily: "var(--font-display)", pointerEvents: "none", color: "#000"
          }}>
            0{idx + 1}
          </div>
          
          <div style={{ zIndex: 1, color: "#000" }}>{item.icon}</div>
          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 900, color: "#000", zIndex: 1, fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
            {item.label}
          </h3>
        </div>
      ))}
    </div>
  );
}
