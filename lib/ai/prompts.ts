import type { ExamType, EnglishLevel, SkillFocus } from "@/types";

// ==============================
// IELTS Reading Prompt
// ==============================

export function buildIELTSReadingPrompt(
  text: string,
  level: EnglishLevel
): string {
  return `You are an expert IELTS Academic reading question writer. Your task is to generate 5 exam-style reading comprehension questions based on the provided text.

EXAM: IELTS Academic Reading
STUDENT LEVEL: ${level}
INPUT TEXT:
"""
${text}
"""

RULES:
1. All questions must be directly answerable from the provided text — do not invent information.
2. Include a mix of question types: Multiple Choice (3 questions), True/False/Not Given (1 question), and Matching/Short Answer (1 question).
3. Each question must have exactly 4 options (A, B, C, D) for MCQ, or exactly 3 options (TRUE, FALSE, NOT GIVEN) for TFNG.
4. Write clear, precise explanations for each correct answer, referencing the text.
5. Adjust difficulty to match the student level: ${level === "B1" ? "accessible vocabulary, shorter stems" : level === "B2" ? "moderate complexity, standard IELTS difficulty" : "challenging, C1-level inference required"}.
6. Do NOT include any preamble or prose — return only valid JSON.
7. Do NOT copy entire sentences from the text as questions — paraphrase and test comprehension.

GUARDRAILS:
- Do not claim these are official IELTS questions.
- Do not invent facts not present in the text.
- If the text is fewer than 150 words, note this in the questions and generate what you can.

Return a JSON array of ReadingQuestion objects with this exact schema:
[
  {
    "id": "q1",
    "question": "string",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctIndex": 0,
    "explanation": "string",
    "questionType": "multiple_choice" | "true_false_not_given" | "short_answer"
  }
]`;
}

// ==============================
// TOEFL Reading Prompt
// ==============================

export function buildTOEFLReadingPrompt(
  text: string,
  level: EnglishLevel
): string {
  return `You are an expert TOEFL iBT reading question writer. Your task is to generate 5 exam-style reading comprehension questions based on the provided text.

EXAM: TOEFL iBT Reading
STUDENT LEVEL: ${level}
INPUT TEXT:
"""
${text}
"""

RULES:
1. TOEFL iBT reading focuses on: factual information, negative factual information, inference, rhetorical purpose, vocabulary in context, and main idea questions.
2. Include: 2 factual questions, 1 inference question, 1 vocabulary-in-context question, 1 purpose/main idea question.
3. Each question must have exactly 4 options.
4. Write explanations that reference the relevant passage section.
5. Do NOT include any preamble — return only valid JSON.

GUARDRAILS:
- Do not claim these are official TOEFL questions or assign official TOEFL scores.
- Do not invent information not in the text.

Return a JSON array with this exact schema:
[
  {
    "id": "q1",
    "question": "string",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctIndex": 0,
    "explanation": "string",
    "questionType": "multiple_choice"
  }
]`;
}

// ==============================
// Vocabulary Extraction Prompt
// ==============================

export function buildVocabularyPrompt(
  text: string,
  level: EnglishLevel,
  examType: ExamType
): string {
  const targetLevel = level === "B1" ? "B2" : "C1";
  return `You are an academic English vocabulary specialist preparing students for ${examType === "IELTS_ACADEMIC" ? "IELTS Academic" : "TOEFL iBT"}.

Extract 6–10 high-value academic vocabulary items from the following text. Focus on words at the ${targetLevel} CEFR level that are:
- Likely to appear in ${examType === "IELTS_ACADEMIC" ? "IELTS" : "TOEFL"} reading passages
- Useful for academic writing
- Part of the Academic Word List (AWL) where possible

INPUT TEXT:
"""
${text}
"""

For each word, provide:
- The base form (noun/verb/adjective as most useful)
- Part of speech
- A clear, accessible definition (not copied from a dictionary verbatim)
- One example sentence in an academic context (NOT from the input text)
- CEFR difficulty level (B2, C1, or C2)
- 2–3 key collocations

Return only valid JSON with this exact schema:
[
  {
    "word": "string",
    "partOfSpeech": "noun" | "verb" | "adjective" | "adverb",
    "definition": "string",
    "exampleSentence": "string",
    "difficulty": "B2" | "C1" | "C2",
    "collocations": ["string", "string"]
  }
]`;
}

// ==============================
// Writing Prompt Builder
// ==============================

export function buildWritingPromptGenerator(
  text: string,
  examType: ExamType,
  level: EnglishLevel
): string {
  const taskType =
    examType === "IELTS_ACADEMIC"
      ? "IELTS Academic Task 2 (argumentative/discursive essay, 250+ words)"
      : "TOEFL iBT Independent Writing Task (academic essay, 300+ words)";

  return `You are an experienced ${examType === "IELTS_ACADEMIC" ? "IELTS" : "TOEFL"} writing examiner.

Based on the themes and content of the following text, generate ONE original writing prompt appropriate for a ${taskType}.

INPUT TEXT:
"""
${text}
"""

STUDENT LEVEL: ${level}

RULES:
1. The prompt must be thematically related to the input text but must NOT ask the student to summarise or analyse the text itself.
2. The prompt should address a broader academic issue raised by the text.
3. Calibrate complexity to ${level} level.
4. For IELTS: use the standard "To what extent do you agree or disagree?" or "Discuss both views and give your own opinion." format.
5. For TOEFL: create an independent opinion prompt asking for 3 reasons to support a position.
6. Do NOT include any preamble — return only valid JSON.

GUARDRAIL: Do not claim this is an official exam prompt.

Return JSON with this exact schema:
{
  "writingPrompt": "string",
  "writingPromptType": "Task 2" | "Independent",
  "speakingPrompt": "string",
  "speakingFollowUps": ["string", "string", "string", "string"]
}`;
}

// ==============================
// Writing Feedback Prompt
// ==============================

export function buildWritingFeedbackPrompt(
  userAnswer: string,
  writingPrompt: string,
  examType: ExamType,
  level: EnglishLevel
): string {
  const criteria =
    examType === "IELTS_ACADEMIC"
      ? "Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy (IELTS band 1–9)"
      : "Task Development, Organization, Language Use (TOEFL 0–30 scale)";

  return `You are a trained ${examType === "IELTS_ACADEMIC" ? "IELTS Academic" : "TOEFL iBT"} writing examiner providing detailed practice feedback.

WRITING PROMPT:
"""
${writingPrompt}
"""

STUDENT RESPONSE:
"""
${userAnswer}
"""

STUDENT LEVEL: ${level}
WORD COUNT: ${userAnswer.trim().split(/\s+/).filter(Boolean).length} words

TASK: Provide comprehensive, honest, and constructive feedback using the ${criteria} criteria.

CRITICAL GUARDRAILS:
1. You MUST include this disclaimer verbatim: "This is an AI-generated practice estimate only. It is not an official IELTS or TOEFL score."
2. Do NOT assign an exact band score — provide a RANGE (e.g., "6.0–6.5" for IELTS, "21–24" for TOEFL).
3. Do NOT claim affiliation with IDP, British Council, ETS, or Cambridge.
4. Base all feedback ONLY on the provided response — do not assume facts not written.
5. Be genuinely helpful — identify real strengths, not just positive platitudes.
6. The improved version must be meaningfully better, not just marginally edited.

Return only valid JSON with this exact schema:
{
  "estimatedBand": "string (e.g. '6.0–6.5' or '21–24')",
  "overallFeedback": "string (2–3 sentences summary)",
  "taskResponse": {
    "score": number,
    "label": "string",
    "feedback": "string",
    "strengths": ["string"],
    "improvements": ["string"]
  },
  "coherenceCohesion": {
    "score": number,
    "label": "string",
    "feedback": "string",
    "strengths": ["string"],
    "improvements": ["string"]
  },
  "lexicalResource": {
    "score": number,
    "label": "string",
    "feedback": "string",
    "strengths": ["string"],
    "improvements": ["string"]
  },
  "grammaticalRange": {
    "score": number,
    "label": "string",
    "feedback": "string",
    "strengths": ["string"],
    "improvements": ["string"]
  },
  "improvedVersion": "string (a genuinely improved rewrite of the student's essay)",
  "nextExercises": [
    {
      "title": "string",
      "description": "string",
      "type": "writing" | "reading" | "vocabulary" | "grammar"
    }
  ],
  "wordCount": number,
  "disclaimer": "string"
}`;
}

// ==============================
// Summary & Study Plan Prompt
// ==============================

export function buildSummaryAndStudyPlanPrompt(
  text: string,
  examType: ExamType,
  skillFocus: SkillFocus,
  level: EnglishLevel,
  targetScore?: string,
  weakArea?: string
): string {
  return `You are an academic English coach creating a personalised study plan.

INPUT TEXT (provided by student):
"""
${text}
"""

STUDENT PROFILE:
- Exam: ${examType === "IELTS_ACADEMIC" ? "IELTS Academic" : "TOEFL iBT"}
- Skill Focus: ${skillFocus}
- Current Level: ${level}
- Target Score: ${targetScore || "Not specified"}
- Weak Area: ${weakArea || "Not specified"}

TASKS:
1. Write a 3–4 sentence summary of the input text in plain English.
2. Extract 3–5 key academic themes from the text.
3. Create a 7-day micro study plan tailored to the student's profile.

RULES:
- The summary must be objective and accurate to the text.
- The study plan must be realistic — total daily study time 45–90 minutes.
- Each day must have 2–4 activities with types: "practice", "review", "test", or "rest".
- Balance all skills across the week, with extra emphasis on the specified skill focus.
- Be specific in activity descriptions — avoid vague instructions like "study vocabulary".

Return only valid JSON with this exact schema:
{
  "summary": "string",
  "keyThemes": ["string"],
  "studyPlan": [
    {
      "day": 1,
      "theme": "string",
      "activities": [
        {
          "type": "practice" | "review" | "test" | "rest",
          "description": "string",
          "durationMinutes": number
        }
      ],
      "totalMinutes": number
    }
  ]
}`;
}
