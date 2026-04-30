/**
 * Text Analyzer — Offline NLP utilities
 *
 * Provides TF-IDF-inspired keyword extraction, sentence splitting,
 * word frequency analysis, and stop-word filtering.
 * Runs entirely client-side — no API calls.
 */

// ==============================
// Stop Words (English)
// ==============================

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
  "be", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "need", "must",
  "it", "its", "this", "that", "these", "those", "i", "you", "he",
  "she", "we", "they", "me", "him", "her", "us", "them", "my", "your",
  "his", "our", "their", "mine", "yours", "hers", "ours", "theirs",
  "what", "which", "who", "whom", "whose", "when", "where", "why",
  "how", "all", "each", "every", "both", "few", "more", "most", "other",
  "some", "such", "no", "nor", "not", "only", "own", "same", "so",
  "than", "too", "very", "just", "because", "if", "while", "about",
  "between", "through", "during", "before", "after", "above", "below",
  "up", "down", "out", "off", "over", "under", "again", "further",
  "then", "once", "here", "there", "any", "also", "into", "being",
  "having", "doing", "s", "t", "re", "ve", "ll", "d", "m",
  "don", "doesn", "didn", "won", "wouldn", "couldn", "shouldn",
  "isn", "aren", "wasn", "weren", "hasn", "haven", "hadn",
  "however", "therefore", "although", "though", "yet", "still",
  "already", "even", "much", "many", "well", "quite", "rather",
  "perhaps", "often", "always", "never", "sometimes", "usually",
  "get", "got", "make", "made", "take", "taken", "come", "go",
  "said", "say", "says", "like", "know", "think", "see", "seen",
  "way", "thing", "things", "use", "used", "using", "one", "two",
  "new", "first", "last", "long", "great", "good", "old", "right",
  "big", "high", "different", "small", "large", "next", "early",
  "young", "important", "public", "bad", "let", "able", "since",
  "back", "still", "called", "given", "another", "around", "become",
  "among", "part", "within", "without", "upon", "per", "via",
]);

// ==============================
// Academic Word List (subset)
// ==============================

const ACADEMIC_WORDS = new Set([
  "analysis", "approach", "area", "assessment", "assume", "authority",
  "available", "benefit", "concept", "consistent", "constitutional",
  "context", "contract", "create", "data", "definition", "derived",
  "distribution", "economic", "environment", "established", "estimate",
  "evidence", "export", "factor", "financial", "formula", "function",
  "identified", "income", "indicate", "individual", "interpretation",
  "involved", "issues", "labour", "legal", "legislation", "major",
  "method", "occur", "percent", "period", "policy", "principle",
  "procedure", "process", "required", "research", "response", "role",
  "section", "sector", "significant", "similar", "source", "specific",
  "structure", "theory", "variable", "achieve", "acquisition",
  "administration", "affect", "appropriate", "aspects", "assistance",
  "categories", "chapter", "commission", "community", "complex",
  "computer", "conclusion", "conduct", "consequences", "construction",
  "consumer", "credit", "cultural", "design", "distinction", "elements",
  "equation", "evaluation", "features", "final", "focus", "impact",
  "injury", "institute", "investment", "items", "journal", "maintenance",
  "normal", "obtained", "participation", "perceived", "positive",
  "potential", "previous", "primary", "purchase", "range", "region",
  "regulations", "relevant", "resident", "resources", "restricted",
  "security", "sought", "select", "site", "strategies", "survey",
  "text", "traditional", "transfer", "transport", "phenomenon",
  "infrastructure", "sustainability", "biodiversity", "ecosystem",
  "urbanisation", "urbanization", "conservation", "restoration",
  "fragmentation", "ecological", "sustainable", "renewable",
  "methodology", "hypothesis", "correlation", "paradigm",
  "comprehensive", "fundamental", "contemporary", "predominant",
  "subsequent", "preliminary", "empirical", "theoretical",
  "systematic", "considerable", "substantial", "demonstrate",
  "facilitate", "implement", "enhance", "contribute", "constitute",
  "allocate", "integrate", "supplement", "compensate", "terminate",
]);

// ==============================
// Core Functions
// ==============================

/**
 * Split text into sentences.
 */
export function extractSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15 && s.split(/\s+/).length >= 4);
}

/**
 * Tokenise text into lowercase words, stripping punctuation.
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Count word frequencies.
 */
export function wordFrequency(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const t of tokens) {
    freq.set(t, (freq.get(t) ?? 0) + 1);
  }
  return freq;
}

/**
 * Extract keywords using a simplified TF-IDF-like scoring.
 * Boost words that appear in the Academic Word List.
 */
export function extractKeywords(text: string, count: number): string[] {
  const tokens = tokenize(text);
  const freq = wordFrequency(tokens);
  const totalTokens = tokens.length || 1;

  const scored: { word: string; score: number }[] = [];

  for (const [word, cnt] of freq.entries()) {
    // Term frequency (normalised)
    const tf = cnt / totalTokens;
    // Inverse document frequency proxy: favour rarer words
    // Words appearing in <10% of sentences get a boost
    const sentences = extractSentences(text);
    const docCount = sentences.filter((s) =>
      s.toLowerCase().includes(word)
    ).length;
    const idf = Math.log((sentences.length + 1) / (docCount + 1)) + 1;
    // Academic word list bonus
    const academicBonus = ACADEMIC_WORDS.has(word) ? 1.5 : 1;
    // Length bonus (longer words tend to be more specific)
    const lengthBonus = word.length > 7 ? 1.3 : word.length > 5 ? 1.1 : 1;

    scored.push({
      word,
      score: tf * idf * academicBonus * lengthBonus,
    });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.word);
}

/**
 * Count words in text.
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Check if a word is likely "academic" / advanced.
 */
export function isAcademicWord(word: string): boolean {
  return ACADEMIC_WORDS.has(word.toLowerCase());
}

/**
 * Find the sentence containing a given word.
 */
export function findContextSentence(
  text: string,
  word: string
): string | null {
  const sentences = extractSentences(text);
  const lower = word.toLowerCase();
  return (
    sentences.find((s) => s.toLowerCase().includes(lower)) ?? null
  );
}

/**
 * Analyse text: return a comprehensive analysis object.
 */
export function analyzeText(text: string) {
  const sentences = extractSentences(text);
  const tokens = tokenize(text);
  const freq = wordFrequency(tokens);
  const wordCount = countWords(text);
  const keywords = extractKeywords(text, 20);
  const academicWords = tokens.filter((t) => ACADEMIC_WORDS.has(t));
  const uniqueAcademic = [...new Set(academicWords)];

  return {
    sentences,
    tokens,
    freq,
    wordCount,
    keywords,
    academicWords: uniqueAcademic,
    sentenceCount: sentences.length,
    averageSentenceLength:
      sentences.length > 0
        ? Math.round(
            sentences.reduce((a, s) => a + s.split(/\s+/).length, 0) /
              sentences.length
          )
        : 0,
  };
}
