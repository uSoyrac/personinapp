"use client";

import { useState } from "react";
import type { PracticeGenerationResult } from "@/types";
import SummaryCard from "./results/SummaryCard";
import ReadingCard from "./results/ReadingCard";
import VocabularyCard from "./results/VocabularyCard";
import WritingCard from "./results/WritingCard";
import StudyPlanCard from "./results/StudyPlanCard";

interface ResultTabsProps {
  result: PracticeGenerationResult;
}

type TabId = "summary" | "reading" | "vocabulary" | "writing" | "studyplan";

const TABS: { id: TabId; label: string; color: string }[] = [
  { id: "summary", label: "Summary", color: "var(--brutal-yellow)" },
  { id: "reading", label: "Reading", color: "var(--brutal-blue)" },
  { id: "vocabulary", label: "Vocabulary", color: "var(--brutal-purple)" },
  { id: "writing", label: "Writing", color: "var(--brutal-green)" },
  { id: "studyplan", label: "Study Plan", color: "var(--rose)" },
];

export default function ResultTabs({ result }: ResultTabsProps) {
  const [active, setActive] = useState<TabId>("summary");

  return (
    <div className="animate-fadeIn">
      {/* Tab list */}
      <div className="tab-list" style={{ marginBottom: "1.5rem" }} role="tablist">
        {TABS.map((tab, idx) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={active === tab.id}
            className={`tab-item ${active === tab.id ? "active" : ""}`}
            onClick={() => setActive(tab.id)}
            style={active === tab.id ? { background: tab.color } : {}}
            onMouseEnter={e => { if (active !== tab.id) e.currentTarget.style.background = tab.color; }}
            onMouseLeave={e => { if (active !== tab.id) e.currentTarget.style.background = "var(--surface)"; }}
          >
            <div style={{ fontSize: "1rem", fontWeight: 900, marginBottom: "0.25rem", opacity: 0.8 }}>[ 0{idx + 1} ]</div>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div role="tabpanel" aria-labelledby={`tab-${active}`} className="animate-fadeInFast">
        {active === "summary" && <SummaryCard result={result} />}
        {active === "reading" && (
          <ReadingCard questions={result.readingQuestions} examType={result.examType} />
        )}
        {active === "vocabulary" && <VocabularyCard vocabulary={result.vocabulary} />}
        {active === "writing" && <WritingCard result={result} />}
        {active === "studyplan" && <StudyPlanCard studyPlan={result.studyPlan} />}
      </div>
    </div>
  );
}
