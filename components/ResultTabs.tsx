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

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "summary", label: "Summary", icon: "📝" },
  { id: "reading", label: "Reading", icon: "📖" },
  { id: "vocabulary", label: "Vocabulary", icon: "🔤" },
  { id: "writing", label: "Writing", icon: "✍️" },
  { id: "studyplan", label: "Study Plan", icon: "📅" },
];

export default function ResultTabs({ result }: ResultTabsProps) {
  const [active, setActive] = useState<TabId>("summary");

  return (
    <div className="animate-fadeIn">
      {/* Tab list */}
      <div className="tab-list" style={{ marginBottom: "1.5rem" }} role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={active === tab.id}
            className={`tab-item ${active === tab.id ? "active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            <span style={{ marginRight: "0.25rem" }}>{tab.icon}</span>
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
