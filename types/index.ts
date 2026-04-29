// ==============================
// Enums / Union Types
// ==============================

export type ExamType = "IELTS_ACADEMIC" | "TOEFL_IBT";

export type SkillFocus =
  | "Reading"
  | "Writing"
  | "Speaking"
  | "Vocabulary"
  | "Full";

export type EnglishLevel = "B1" | "B2" | "C1";

// ==============================
// Reading
// ==============================

export interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  questionType:
    | "multiple_choice"
    | "true_false_not_given"
    | "matching"
    | "short_answer";
}

// ==============================
// Vocabulary
// ==============================

export type VocabularyDifficulty = "B2" | "C1" | "C2";

export interface VocabularyItem {
  word: string;
  partOfSpeech: string;
  definition: string;
  exampleSentence: string;
  difficulty: VocabularyDifficulty;
  collocations?: string[];
}

// ==============================
// Study Plan
// ==============================

export interface StudyPlanActivity {
  type: "practice" | "review" | "test" | "rest";
  description: string;
  durationMinutes: number;
}

export interface StudyPlanDay {
  day: number;
  theme: string;
  activities: StudyPlanActivity[];
  totalMinutes: number;
}

// ==============================
// Practice Generation
// ==============================

export interface PracticeGenerationResult {
  summary: string;
  keyThemes: string[];
  readingQuestions: ReadingQuestion[];
  vocabulary: VocabularyItem[];
  writingPrompt: string;
  writingPromptType: "Task 1" | "Task 2" | "Integrated" | "Independent";
  speakingPrompt: string;
  speakingFollowUps: string[];
  studyPlan: StudyPlanDay[];
  examType: ExamType;
  skillFocus: SkillFocus;
  level: EnglishLevel;
  generatedAt: string;
  isUsingMockData: boolean;
}

// ==============================
// Writing Feedback
// ==============================

export interface WritingFeedbackDimension {
  score: number; // 0-9 for IELTS, 0-30 for TOEFL
  label: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface NextExercise {
  title: string;
  description: string;
  type: "writing" | "reading" | "vocabulary" | "grammar";
}

export interface WritingFeedbackResult {
  estimatedBand: string; // e.g. "6.0–6.5" or "21–24"
  overallFeedback: string;
  taskResponse: WritingFeedbackDimension;
  coherenceCohesion: WritingFeedbackDimension;
  lexicalResource: WritingFeedbackDimension;
  grammaticalRange: WritingFeedbackDimension;
  improvedVersion: string;
  nextExercises: NextExercise[];
  wordCount: number;
  generatedAt: string;
  isUsingMockData: boolean;
  disclaimer: string;
}

// ==============================
// Session Data Model
// ==============================

export interface PracticeSessionInput {
  examType: ExamType;
  skillFocus: SkillFocus;
  inputText: string;
  level: EnglishLevel;
  targetScore?: string;
  examDate?: string;
  weakArea?: string;
}

export interface PracticeSession extends PracticeSessionInput {
  id: string;
  result: PracticeGenerationResult | null;
  createdAt: string;
}

export interface WritingFeedbackSession {
  id: string;
  sessionId: string;
  userAnswer: string;
  writingPrompt: string;
  examType: ExamType;
  level: EnglishLevel;
  feedback: WritingFeedbackResult | null;
  createdAt: string;
}

// ==============================
// UI State
// ==============================

export type GenerationStatus = "idle" | "loading" | "success" | "error";
