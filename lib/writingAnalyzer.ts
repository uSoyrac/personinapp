/**
 * Writing Analyzer — Offline essay analysis
 */
import { tokenize, extractSentences, isAcademicWord } from "./quiz-engine/textAnalyzer";

export interface WritingDimension {
  label: string; score: number; icon: string; strengths: string[]; improvements: string[];
}
export interface WritingAnalysis {
  wordCount: number; sentenceCount: number; avgSentenceLength: number;
  uniqueWordRatio: number; academicWordCount: number; academicDensity: number;
  cohesionDeviceCount: number; paragraphCount: number; estimatedLevel: string;
  overallScore: number; dimensions: WritingDimension[]; suggestions: string[];
}

const COHESION = ["however","furthermore","moreover","therefore","consequently","nevertheless","although","despite","whereas","in addition","on the other hand","in contrast","as a result","for example","for instance","in conclusion","to summarize","first","second","third","finally","meanwhile","subsequently","similarly","likewise","accordingly","hence","thus"];

export function analyzeWriting(text: string, minWords = 250): WritingAnalysis {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wc = words.length;
  const sents = extractSentences(text);
  const sc = Math.max(sents.length, 1);
  const avgLen = Math.round(wc / sc);
  const toks = tokenize(text);
  const uniq = new Set(toks);
  const ur = toks.length > 0 ? uniq.size / toks.length : 0;
  const acads = new Set(toks.filter(t => isAcademicWord(t)));
  const ac = acads.size;
  const ad = toks.length > 0 ? ac / toks.length : 0;
  const low = text.toLowerCase();
  const cd = COHESION.filter(d => low.includes(d)).length;
  const paras = text.split(/\n\s*\n/).filter(p => p.trim().length > 20);
  const pc = Math.max(paras.length, 1);

  const d1 = taskResp(wc, minWords, pc, sents);
  const d2 = coher(cd, pc);
  const d3 = lexic(ur, ac);
  const d4 = gram(avgLen, sc, wc);
  const os = Math.round(d1.score*0.25 + d2.score*0.25 + d3.score*0.3 + d4.score*0.2);
  const el = os >= 75 ? "C1" : os >= 55 ? "B2" : os >= 35 ? "B1" : "A2";

  const sugs: string[] = [];
  if (wc < minWords) sugs.push(`Write ${minWords - wc} more words to meet the minimum.`);
  if (ur < 0.5) sugs.push("Replace repeated words with synonyms.");
  if (ad < 0.05) sugs.push("Include more academic vocabulary (AWL).");
  if (cd < 3) sugs.push("Use discourse markers: However, Furthermore, In conclusion.");
  if (avgLen < 10) sugs.push("Combine short sentences using relative clauses.");
  if (pc < 3) sugs.push("Structure with introduction, body, and conclusion paragraphs.");
  if (!sugs.length) sugs.push("Solid writing! Keep practicing for consistency.");

  return { wordCount: wc, sentenceCount: sc, avgSentenceLength: avgLen, uniqueWordRatio: ur, academicWordCount: ac, academicDensity: ad, cohesionDeviceCount: cd, paragraphCount: pc, estimatedLevel: el, overallScore: os, dimensions: [d1,d2,d3,d4], suggestions: sugs };
}

function taskResp(wc: number, min: number, pc: number, sents: string[]): WritingDimension {
  let s = 50; const st: string[] = []; const im: string[] = [];
  if (wc >= min) { s += 20; st.push(`Word count meets minimum (${wc}/${min})`); } else { s -= 15; im.push(`Write at least ${min} words (${wc} now)`); }
  if (pc >= 3) { s += 15; st.push(`${pc} paragraphs — good structure`); } else im.push("Use at least 3 paragraphs");
  if (sents.length >= 8) { s += 10; st.push("Good sentence count"); } else im.push("Develop ideas with more sentences");
  return { label: "Task Response", score: Math.min(100, Math.max(0, s)), icon: "📝", strengths: st, improvements: im };
}

function coher(cd: number, pc: number): WritingDimension {
  let s = 40; const st: string[] = []; const im: string[] = [];
  if (cd >= 5) { s += 30; st.push(`Excellent cohesive devices (${cd})`); } else if (cd >= 3) { s += 15; st.push(`${cd} cohesive devices`); im.push("Use more varied linking words"); } else im.push("Add: however, furthermore, for example");
  if (pc >= 3) { s += 15; st.push("Clear paragraphing"); } else im.push("Separate ideas into paragraphs");
  return { label: "Coherence & Cohesion", score: Math.min(100, Math.max(0, s)), icon: "🔗", strengths: st, improvements: im };
}

function lexic(ur: number, ac: number): WritingDimension {
  let s = 35; const st: string[] = []; const im: string[] = [];
  if (ur >= 0.6) { s += 20; st.push(`${Math.round(ur*100)}% unique words`); } else if (ur >= 0.45) { s += 10; im.push("Use more varied vocabulary"); } else im.push("Vocabulary is repetitive");
  if (ac >= 8) { s += 30; st.push(`${ac} academic words — excellent`); } else if (ac >= 4) { s += 15; st.push(`${ac} academic words`); im.push("Include more AWL terms"); } else im.push("Use academic vocabulary: significant, demonstrate");
  return { label: "Lexical Resource", score: Math.min(100, Math.max(0, s)), icon: "📚", strengths: st, improvements: im };
}

function gram(avg: number, sc: number, wc: number): WritingDimension {
  let s = 50; const st: string[] = []; const im: string[] = [];
  if (avg >= 12 && avg <= 25) { s += 20; st.push(`Avg sentence: ${avg} words`); } else if (avg < 12) { im.push("Sentences too short — try complex structures"); } else im.push("Break long sentences for clarity");
  if (sc >= 10) { s += 15; st.push("Good structural range"); } else if (sc >= 6) s += 5;
  if (wc >= 200) s += 10;
  return { label: "Grammar & Range", score: Math.min(100, Math.max(0, s)), icon: "✏️", strengths: st, improvements: im };
}
