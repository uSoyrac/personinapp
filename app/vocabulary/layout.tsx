import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vocabulary Builder",
  description:
    "Build and master academic vocabulary with spaced-repetition quizzes, custom word sets, and progress tracking for IELTS and TOEFL.",
  alternates: { canonical: "/vocabulary" },
};

export default function VocabularyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
