import type { StudyPlanDay } from "@/types";

interface StudyPlanCardProps {
  studyPlan: StudyPlanDay[];
}

const ACTIVITY_COLORS: Record<string, string> = {
  practice: "var(--primary)",
  review: "var(--accent)",
  test: "var(--amber)",
  rest: "var(--foreground-faint)",
};

const ACTIVITY_ICONS: Record<string, string> = {
  practice: "",
  review: "",
  test: "️",
  rest: "",
};

export default function StudyPlanCard({ studyPlan }: StudyPlanCardProps) {
  const totalMinutes = studyPlan.reduce((s, d) => s + d.totalMinutes, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h3 style={{ margin: "0 0 0.25rem", fontSize: "1rem", fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--foreground)" }}>7-Day Study Plan</h3>
          <p style={{ margin: 0, fontSize: "0.875rem" }}>Personalised micro-plan for exam preparation</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span className="badge badge-primary"> {Math.round(totalMinutes / 60)}h total</span>
          <span className="badge badge-accent">7 days</span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {Object.entries(ACTIVITY_ICONS).map(([type, icon]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <div style={{ width: "0.625rem", height: "0.625rem", borderRadius: "50%", background: ACTIVITY_COLORS[type] }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)", textTransform: "capitalize" }}>{icon} {type}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {studyPlan.map((day) => (
          <div key={day.day} className="timeline-item" style={{ marginBottom: "0.25rem" }}>
            <div className="timeline-dot">D{day.day}</div>
            <div style={{ flex: 1, paddingBottom: "0.75rem" }}>
              <div
                className="card"
                style={{ padding: "1rem" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <p style={{ margin: "0 0 0.125rem", fontSize: "0.9375rem", fontWeight: 700, color: "var(--foreground)" }}>Day {day.day}: {day.theme}</p>
                  </div>
                  <span className="badge badge-gray">{day.totalMinutes} min</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {day.activities.map((activity, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "flex-start",
                        padding: "0.625rem 0.75rem",
                        background: "var(--background)",
                        borderRadius: "var(--radius-sm)",
                        borderLeft: `3px solid ${ACTIVITY_COLORS[activity.type]}`,
                      }}
                    >
                      <span style={{ fontSize: "1rem", minWidth: "1.25rem" }}>{ACTIVITY_ICONS[activity.type]}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground)", lineHeight: 1.5 }}>{activity.description}</p>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--foreground-faint)", whiteSpace: "nowrap", fontWeight: 600 }}>{activity.durationMinutes}m</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "0.8125rem", color: "var(--foreground-faint)", textAlign: "center", fontStyle: "italic" }}>
         Adjust daily timing to fit your schedule. Consistency matters more than duration.
      </p>
    </div>
  );
}
