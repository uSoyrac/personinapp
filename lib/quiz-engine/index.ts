/**
 * Quiz Engine — Main entry point
 * Generates offline practice content without any API calls.
 */

import type { PracticeGenerationResult, PracticeSessionInput, UserTier } from "@/types";
import { analyzeText, countWords } from "./textAnalyzer";
import { generateQuestions } from "./questionGenerator";
import { extractVocabulary } from "./vocabularyExtractor";

export const TIER_LIMITS = {
  guest: { maxWords: 150, questionCount: 3, vocabCount: 3 },
  free: { maxWords: 300, questionCount: 5, vocabCount: 5 },
  pro: { maxWords: 800, questionCount: 15, vocabCount: 15 },
  gold: { maxWords: 1500, questionCount: 15, vocabCount: 20 },
} as const;

/**
 * Generate a complete practice session offline.
 */
export function generateOfflinePractice(
  input: PracticeSessionInput,
  tier: UserTier
): PracticeGenerationResult {
  const limits = TIER_LIMITS[tier];
  const wordCount = countWords(input.inputText);

  // Truncate text if over limit
  let text = input.inputText;
  if (wordCount > limits.maxWords) {
    const words = text.split(/\s+/);
    text = words.slice(0, limits.maxWords).join(" ");
  }

  const analysis = analyzeText(text);
  const questions = generateQuestions(text, limits.questionCount);
  const vocabulary = extractVocabulary(text, limits.vocabCount);

  // Generate a summary from first 2-3 sentences
  const summaryText =
    analysis.sentences.length > 0
      ? analysis.sentences.slice(0, 3).join(" ")
      : "Text analysis complete. See the generated questions and vocabulary below.";

  // Build study plan (pro/gold only)
  const studyPlan = tier !== "free" ? buildBasicStudyPlan() : [];

  // Build writing/speaking prompts
  const writingPrompt =
    tier !== "free" && analysis.keywords.length > 0
      ? `Write an essay discussing the role of ${analysis.keywords[0]} in modern society. To what extent do you agree that ${analysis.keywords.slice(0, 2).join(" and ")} are important factors? Support your answer with examples.`
      : "";

  const speakingPrompt =
    tier === "gold" && analysis.keywords.length > 0
      ? `Describe a situation where ${analysis.keywords[0]} played an important role. You should say: what happened, why it was important, and what you learned from it.`
      : "";

  return {
    summary: summaryText,
    keyThemes: analysis.keywords.slice(0, 5).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
    readingQuestions: questions,
    vocabulary,
    writingPrompt,
    writingPromptType: input.examType === "IELTS_ACADEMIC" ? "Task 2" : "Independent",
    speakingPrompt,
    speakingFollowUps:
      tier === "gold" && analysis.keywords.length > 1
        ? [
            `Do you think ${analysis.keywords[0]} will become more important in the future?`,
            `How does ${analysis.keywords[1]} affect daily life in your country?`,
            `What challenges are associated with ${analysis.keywords[0]}?`,
            `Can you give an example of ${analysis.keywords[1]} from your own experience?`,
          ]
        : [],
    studyPlan,
    examType: input.examType,
    skillFocus: input.skillFocus,
    level: input.level,
    generatedAt: new Date().toISOString(),
    isUsingMockData: false,
  };
}

function buildBasicStudyPlan() {
  return [
    {
      day: 1, theme: "Vocabulary & Reading Foundation",
      activities: [
        { type: "review" as const, description: "Study all extracted vocabulary items", durationMinutes: 25 },
        { type: "practice" as const, description: "Complete reading comprehension questions", durationMinutes: 30 },
      ],
      totalMinutes: 55,
    },
    {
      day: 2, theme: "Deep Reading & Word Practice",
      activities: [
        { type: "review" as const, description: "Re-read the source text and take notes", durationMinutes: 20 },
        { type: "practice" as const, description: "Write sentences using each vocabulary word", durationMinutes: 30 },
      ],
      totalMinutes: 50,
    },
    {
      day: 3, theme: "Writing Practice",
      activities: [
        { type: "practice" as const, description: "Write a response to the writing prompt (250+ words)", durationMinutes: 45 },
        { type: "review" as const, description: "Self-edit your writing for grammar and vocabulary", durationMinutes: 15 },
      ],
      totalMinutes: 60,
    },
    {
      day: 4, theme: "Speaking & Vocabulary Review",
      activities: [
        { type: "practice" as const, description: "Record yourself answering the speaking prompt", durationMinutes: 15 },
        { type: "practice" as const, description: "Answer follow-up questions aloud", durationMinutes: 20 },
        { type: "review" as const, description: "Review vocabulary flashcards", durationMinutes: 15 },
      ],
      totalMinutes: 50,
    },
    {
      day: 5, theme: "Vocabulary Quiz",
      activities: [
        { type: "test" as const, description: "Take vocabulary quiz on saved words", durationMinutes: 20 },
        { type: "practice" as const, description: "Write a paragraph using 5+ vocabulary words", durationMinutes: 25 },
      ],
      totalMinutes: 45,
    },
    {
      day: 6, theme: "Timed Practice",
      activities: [
        { type: "test" as const, description: "Timed reading: complete all questions in 20 minutes", durationMinutes: 20 },
        { type: "test" as const, description: "Timed writing: write essay in 40 minutes", durationMinutes: 40 },
      ],
      totalMinutes: 60,
    },
    {
      day: 7, theme: "Review & Consolidation",
      activities: [
        { type: "review" as const, description: "Review all vocabulary and missed questions", durationMinutes: 25 },
        { type: "rest" as const, description: "Light English reading or listening", durationMinutes: 30 },
      ],
      totalMinutes: 55,
    },
  ];
}
