/**
 * Question Generator — Offline question generation from text
 */

import type { ReadingQuestion } from "@/types";
import { extractSentences, extractKeywords, findContextSentence } from "./textAnalyzer";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

let qIdCounter = 0;
function nextQId(): string { return `q${++qIdCounter}`; }

function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffleArray(arr).slice(0, n);
}

const FALLBACK_WORDS = [
  "phenomenon","perspective","consequence","implication","circumstance",
  "observation","contribution","development","evaluation","correlation",
  "significance","application","integration","transformation","interpretation",
];

function getDistractors(correct: string, pool: string[], n: number): string[] {
  const filtered = pool.filter(w => w.toLowerCase() !== correct.toLowerCase());
  const all = [...new Set([...filtered, ...FALLBACK_WORDS.filter(w => w !== correct.toLowerCase())])];
  return pickRandom(all, n);
}

function makeFillBlank(sent: string, kw: string, pool: string[]): ReadingQuestion | null {
  const re = new RegExp(`\\b${kw}\\b`, "i");
  if (!re.test(sent)) return null;
  const blanked = sent.replace(re, "________");
  const opts = shuffleArray([kw, ...getDistractors(kw, pool, 3)]);
  return {
    id: nextQId(),
    question: `Fill in the blank: "${blanked}"`,
    options: opts.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`),
    correctIndex: opts.indexOf(kw),
    explanation: `The correct answer is "${kw}" as used in the original text.`,
    questionType: "multiple_choice",
  };
}

function makeTrueFalse(sent: string): ReadingQuestion | null {
  if (sent.length < 30) return null;
  const isTrue = Math.random() > 0.4;
  let statement = sent.replace(/\.$/, "");
  let ci = 0;
  if (!isTrue) {
    const words = statement.split(" ");
    if (words.length > 6) {
      const mid = Math.floor(words.length / 2);
      const cands = words.map((w, i) => ({ w, i })).filter(({ w, i }) => i > 1 && i < words.length - 1 && w.length > 3 && i !== mid);
      if (cands.length >= 2) {
        const [a, b] = pickRandom(cands, 2);
        const m = [...words]; m[a.i] = words[b.i]; m[b.i] = words[a.i];
        statement = m.join(" ");
        ci = 1;
      }
    }
  }
  return {
    id: nextQId(),
    question: `TRUE / FALSE / NOT GIVEN: "${statement}"`,
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    correctIndex: ci,
    explanation: ci === 0 ? "This statement is directly supported by the text." : "This statement has been modified from the original text.",
    questionType: "true_false_not_given",
  };
}

function makeMainIdea(keywords: string[]): ReadingQuestion | null {
  if (keywords.length < 3) return null;
  const top3 = keywords.slice(0, 3);
  const correct = `The text primarily discusses ${top3.join(", ")} and their interrelationships`;
  const dists = [
    "The text primarily discusses historical political systems",
    "The text primarily discusses personal biographical accounts",
    "The text primarily discusses mathematical computation methods",
  ];
  const opts = shuffleArray([correct, ...dists]);
  return {
    id: nextQId(),
    question: "Which of the following best describes the main idea of the text?",
    options: opts.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`),
    correctIndex: opts.indexOf(correct),
    explanation: `The text focuses on themes related to ${top3.join(", ")}.`,
    questionType: "multiple_choice",
  };
}

function makeDetailQ(sent: string, kw: string, pool: string[]): ReadingQuestion | null {
  if (sent.length < 40) return null;
  const dists = getDistractors(kw, pool, 3).map(d => capitalize(d));
  const opts = shuffleArray([capitalize(kw), ...dists]);
  return {
    id: nextQId(),
    question: `According to the text, which concept is mentioned: "${sent.substring(0, 100)}${sent.length > 100 ? "..." : ""}"?`,
    options: opts.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`),
    correctIndex: opts.findIndex(o => o.toLowerCase() === kw.toLowerCase()),
    explanation: `The text specifically mentions "${kw}" in this context.`,
    questionType: "multiple_choice",
  };
}

export function generateQuestions(text: string, count: number): ReadingQuestion[] {
  qIdCounter = 0;
  const sentences = extractSentences(text);
  const keywords = extractKeywords(text, 20);
  const qs: ReadingQuestion[] = [];
  if (!sentences.length || !keywords.length) return [];

  const main = makeMainIdea(keywords);
  if (main) qs.push(main);

  const used = new Set<number>();
  for (let i = 0; i < keywords.length && qs.length < count; i++) {
    const ctx = findContextSentence(text, keywords[i]);
    if (!ctx) continue;
    const si = sentences.indexOf(ctx);
    if (si >= 0 && used.has(si)) continue;
    const q = makeFillBlank(ctx, keywords[i], keywords);
    if (q) { qs.push(q); if (si >= 0) used.add(si); }
  }

  const tfSents = sentences.filter((_, i) => !used.has(i) && sentences[i].length > 40);
  for (const s of pickRandom(tfSents, 2)) {
    if (qs.length >= count) break;
    const q = makeTrueFalse(s);
    if (q) qs.push(q);
  }

  for (let i = 0; i < keywords.length && qs.length < count; i++) {
    const ctx = findContextSentence(text, keywords[i]);
    if (!ctx) continue;
    const q = makeDetailQ(ctx, keywords[i], keywords);
    if (q) qs.push(q);
  }

  return qs.slice(0, count);
}
