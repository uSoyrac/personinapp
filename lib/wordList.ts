/**
 * Word List — localStorage-based vocabulary persistence
 * Saves words, tracks learning progress, and supports spaced repetition.
 */

export interface SavedWord {
  word: string;
  definition: string;
  contextSentence: string;
  partOfSpeech: string;
  difficulty: string;
  correctCount: number;
  totalAttempts: number;
  lastReviewed: string | null;
  nextReview: string | null;
  addedAt: string;
}

const STORAGE_KEY = "practiceforge_wordlist";

function getStorage(): SavedWord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStorage(words: SavedWord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

/** Get the full word list. */
export function getWordList(): SavedWord[] {
  return getStorage();
}

/** Save new words to the list (skip duplicates). */
export function saveWords(newWords: Omit<SavedWord, "correctCount" | "totalAttempts" | "lastReviewed" | "nextReview" | "addedAt">[]): number {
  const existing = getStorage();
  const existingSet = new Set(existing.map(w => w.word.toLowerCase()));
  let added = 0;

  for (const w of newWords) {
    if (existingSet.has(w.word.toLowerCase())) continue;
    existing.push({
      ...w,
      correctCount: 0,
      totalAttempts: 0,
      lastReviewed: null,
      nextReview: null,
      addedAt: new Date().toISOString(),
    });
    existingSet.add(w.word.toLowerCase());
    added++;
  }

  setStorage(existing);
  return added;
}

/** Remove a word from the list. */
export function removeWord(word: string) {
  const words = getStorage().filter(w => w.word.toLowerCase() !== word.toLowerCase());
  setStorage(words);
}

/** Clear all words. */
export function clearWordList() {
  setStorage([]);
}

/** Update progress after a quiz answer. */
export function updateWordProgress(word: string, correct: boolean) {
  const words = getStorage();
  const idx = words.findIndex(w => w.word.toLowerCase() === word.toLowerCase());
  if (idx === -1) return;

  words[idx].totalAttempts++;
  if (correct) words[idx].correctCount++;
  words[idx].lastReviewed = new Date().toISOString();

  // Simple spaced repetition: correct answers push next review further
  const streak = words[idx].correctCount;
  const hoursUntilNext = Math.min(streak * streak * 4, 168); // Max 1 week
  const nextDate = new Date();
  nextDate.setHours(nextDate.getHours() + hoursUntilNext);
  words[idx].nextReview = nextDate.toISOString();

  setStorage(words);
}

/** Get words that are due for review. */
export function getWordsForReview(count: number): SavedWord[] {
  const words = getStorage();
  const now = new Date().toISOString();

  // Priority: never reviewed > overdue > rest
  const neverReviewed = words.filter(w => !w.lastReviewed);
  const overdue = words.filter(w => w.nextReview && w.nextReview <= now);
  const rest = words.filter(w => w.lastReviewed && (!w.nextReview || w.nextReview > now));

  const prioritized = [...neverReviewed, ...overdue, ...rest];
  return prioritized.slice(0, count);
}

/** Get statistics. */
export function getWordStats() {
  const words = getStorage();
  const learned = words.filter(w => w.correctCount >= 3);
  const needsReview = words.filter(w => {
    if (!w.lastReviewed) return true;
    if (w.nextReview && w.nextReview <= new Date().toISOString()) return true;
    return false;
  });

  return {
    total: words.length,
    learned: learned.length,
    needsReview: needsReview.length,
    accuracy: words.reduce((a, w) => a + w.totalAttempts, 0) > 0
      ? Math.round(
          (words.reduce((a, w) => a + w.correctCount, 0) /
            words.reduce((a, w) => a + w.totalAttempts, 0)) *
            100
        )
      : 0,
  };
}
