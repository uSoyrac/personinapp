/**
 * Vocabulary Extractor — Extract important words from text
 */

import type { VocabularyItem } from "@/types";
import { extractKeywords, extractSentences, isAcademicWord } from "./textAnalyzer";

// Simple definitions for common academic words
const WORD_DEFINITIONS: Record<string, string> = {
  analysis: "A detailed examination of the elements or structure of something",
  approach: "A way of dealing with a situation or problem",
  environment: "The surroundings or conditions in which a person or organism lives",
  research: "Systematic investigation to establish facts and reach new conclusions",
  significant: "Sufficiently great or important to be worthy of attention",
  process: "A series of actions or steps taken to achieve a particular end",
  impact: "A marked effect or influence on something",
  structure: "The arrangement of and relations between parts of something complex",
  concept: "An abstract idea or general notion",
  evidence: "Facts or information indicating whether a belief is true or valid",
  method: "A particular procedure for accomplishing something",
  theory: "A system of ideas intended to explain something",
  policy: "A course of action adopted by an organization or individual",
  factor: "A circumstance that contributes to a result or outcome",
  data: "Facts and statistics collected for reference or analysis",
  context: "The circumstances that form the setting for an event or idea",
  response: "A reaction to something",
  community: "A group of people living in the same place or having characteristics in common",
  resources: "A stock or supply of materials or assets",
  potential: "Having or showing the capacity to develop into something in the future",
  sustainable: "Able to be maintained at a certain rate or level without depleting resources",
  biodiversity: "The variety of plant and animal life in a particular habitat",
  ecosystem: "A biological community of interacting organisms and their environment",
  infrastructure: "The basic physical and organizational structures needed for operation",
  conservation: "Prevention of wasteful use of a resource; preservation of the natural environment",
  ecological: "Relating to the relations of organisms to one another and their environment",
  urbanisation: "The process of making an area more urban",
  fragmentation: "The process of breaking into smaller, disconnected parts",
  restoration: "The action of returning something to a former condition",
  phenomenon: "A fact or situation that is observed to exist",
  correlation: "A mutual relationship between two or more things",
  hypothesis: "A proposed explanation made on the basis of limited evidence",
  paradigm: "A typical example or pattern of something; a model",
  methodology: "A system of methods used in a particular area of study",
  comprehensive: "Including or dealing with all or nearly all aspects of something",
  fundamental: "Forming a necessary base or core; of central importance",
  contemporary: "Belonging to or occurring in the present time",
  predominant: "Present as the strongest or main element",
  subsequent: "Coming after something in time; following",
  preliminary: "Preceding or done in preparation for something fuller or more important",
  empirical: "Based on observation or experience rather than theory or pure logic",
  demonstrate: "Clearly show the existence or truth of something",
  facilitate: "Make an action or process easy or easier",
  implement: "Put a decision, plan, or agreement into effect",
  enhance: "Intensify, increase, or further improve the quality or value of",
  contribute: "Give something in order to help achieve or provide something",
  integrate: "Combine one thing with another so that they become a whole",
  transformation: "A thorough or dramatic change in form or appearance",
  interpretation: "The action of explaining the meaning of something",
  evaluation: "The making of a judgement about the value or quality of something",
  distribution: "The action of sharing something out among a number of recipients",
};

function getDifficulty(word: string): "B2" | "C1" | "C2" {
  if (word.length > 12) return "C2";
  if (word.length > 8 || isAcademicWord(word)) return "C1";
  return "B2";
}

function getDefinition(word: string): string {
  const lower = word.toLowerCase();
  if (WORD_DEFINITIONS[lower]) return WORD_DEFINITIONS[lower];
  return `An important term used in the context of the passage, relating to the key themes discussed.`;
}

function getCollocations(word: string): string[] {
  const w = word.toLowerCase();
  const patterns = [
    [`${w} analysis`, `${w} approach`, `major ${w}`],
    [`${w} impact`, `significant ${w}`, `${w} development`],
    [`${w} strategy`, `effective ${w}`, `${w} management`],
  ];
  return patterns[Math.floor(Math.random() * patterns.length)].slice(0, 3);
}

export function extractVocabulary(text: string, count: number): VocabularyItem[] {
  const keywords = extractKeywords(text, count * 2);
  const sentences = extractSentences(text);
  const items: VocabularyItem[] = [];

  for (const kw of keywords) {
    if (items.length >= count) break;
    if (kw.length < 4) continue;

    const ctxSentence = sentences.find(s => s.toLowerCase().includes(kw.toLowerCase()));

    items.push({
      word: kw,
      partOfSpeech: guessPartOfSpeech(kw),
      definition: getDefinition(kw),
      exampleSentence: ctxSentence
        ? ctxSentence.substring(0, 200)
        : `The concept of ${kw} plays an important role in academic discourse.`,
      difficulty: getDifficulty(kw),
      collocations: getCollocations(kw),
    });
  }

  return items;
}

function guessPartOfSpeech(word: string): string {
  const w = word.toLowerCase();
  if (w.endsWith("tion") || w.endsWith("sion") || w.endsWith("ment") || w.endsWith("ness") || w.endsWith("ity") || w.endsWith("ence") || w.endsWith("ance")) return "noun";
  if (w.endsWith("ive") || w.endsWith("ous") || w.endsWith("ful") || w.endsWith("less") || w.endsWith("ical") || w.endsWith("able")) return "adjective";
  if (w.endsWith("ly")) return "adverb";
  if (w.endsWith("ate") || w.endsWith("ify") || w.endsWith("ize") || w.endsWith("ise")) return "verb";
  return "noun";
}
