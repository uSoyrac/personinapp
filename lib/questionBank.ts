import type { SavedQuestion, ReadingQuestion } from "@/types";

const MAX_QUESTIONS = 500;
const STORAGE_KEY = "practiceforge_question_bank";

export function getQuestionBank(): SavedQuestion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedQuestion[];
  } catch {
    return [];
  }
}

export function saveQuestion(q: ReadingQuestion): { success: boolean; message: string } {
  if (typeof window === "undefined") return { success: false, message: "Browser env required" };
  
  const bank = getQuestionBank();
  
  if (bank.some(saved => saved.id === q.id || saved.question === q.question)) {
    return { success: false, message: "Question already saved." };
  }

  if (bank.length >= MAX_QUESTIONS) {
    return { success: false, message: `Question bank limit reached (${MAX_QUESTIONS}). Please delete some questions first.` };
  }

  const newQuestion: SavedQuestion = {
    ...q,
    savedAt: new Date().toISOString()
  };

  bank.unshift(newQuestion);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
  return { success: true, message: "Saved to Question Bank!" };
}

export function deleteQuestion(id: string) {
  if (typeof window === "undefined") return;
  const bank = getQuestionBank();
  const filtered = bank.filter(q => q.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearQuestionBank() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
