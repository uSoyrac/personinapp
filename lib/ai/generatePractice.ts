/**
 * PracticeForge AI Provider Abstraction
 *
 * Usage:
 * - If OPENAI_API_KEY is set in .env.local, real OpenAI calls are made.
 * - If no key is set, realistic mock data is returned instantly.
 *
 * To switch providers (Anthropic, Gemini, etc.), replace the callOpenAI
 * function below — all prompt builders and return types remain unchanged.
 */

import type {
  PracticeSessionInput,
  PracticeGenerationResult,
  WritingFeedbackResult,
  ExamType,
  EnglishLevel,
} from "@/types";
import { MOCK_PRACTICE_RESULT, getMockWritingFeedback } from "./mockData";
import {
  buildIELTSReadingPrompt,
  buildTOEFLReadingPrompt,
  buildVocabularyPrompt,
  buildWritingPromptGenerator,
  buildWritingFeedbackPrompt,
  buildSummaryAndStudyPlanPrompt,
} from "./prompts";

// ==============================
// Environment check
// ==============================

function hasApiKey(): boolean {
  return Boolean(
    process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10
  );
}

// ==============================
// OpenAI caller
// ==============================

async function callOpenAI<T>(
  systemPrompt: string,
  userMessage: string,
  model = "gpt-4o-mini"
): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY!;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from OpenAI");

  return JSON.parse(content) as T;
}

// ==============================
// Main: Generate Practice
// ==============================

export async function generatePractice(
  input: PracticeSessionInput
): Promise<PracticeGenerationResult> {
  // Return mock data if no API key
  if (!hasApiKey()) {
    // Simulate a brief loading delay for realism
    await new Promise((r) => setTimeout(r, 1200));
    return {
      ...MOCK_PRACTICE_RESULT,
      examType: input.examType,
      skillFocus: input.skillFocus,
      level: input.level,
      generatedAt: new Date().toISOString(),
      isUsingMockData: true,
    };
  }

  try {
    // 1. Reading questions
    const readingPrompt =
      input.examType === "IELTS_ACADEMIC"
        ? buildIELTSReadingPrompt(input.inputText, input.level)
        : buildTOEFLReadingPrompt(input.inputText, input.level);

    // 2. Vocabulary
    const vocabPrompt = buildVocabularyPrompt(
      input.inputText,
      input.level,
      input.examType
    );

    // 3. Writing prompt + speaking prompt
    const writingPromptStr = buildWritingPromptGenerator(
      input.inputText,
      input.examType,
      input.level
    );

    // 4. Summary + study plan
    const summaryPrompt = buildSummaryAndStudyPlanPrompt(
      input.inputText,
      input.examType,
      input.skillFocus,
      input.level,
      input.targetScore,
      input.weakArea
    );

    // Run all in parallel for speed
    const [readingRaw, vocabRaw, promptsRaw, summaryRaw] = await Promise.all([
      callOpenAI<{ questions?: unknown[] }>(
        "You are an expert exam question writer. Return only valid JSON.",
        readingPrompt
      ),
      callOpenAI<{ vocabulary?: unknown[] }>(
        "You are an academic vocabulary specialist. Return only valid JSON.",
        vocabPrompt
      ),
      callOpenAI<{
        writingPrompt?: string;
        writingPromptType?: string;
        speakingPrompt?: string;
        speakingFollowUps?: string[];
      }>(
        "You are an experienced language exam writer. Return only valid JSON.",
        writingPromptStr
      ),
      callOpenAI<{
        summary?: string;
        keyThemes?: string[];
        studyPlan?: unknown[];
      }>(
        "You are an academic English coach. Return only valid JSON.",
        summaryPrompt
      ),
    ]);

    return {
      summary: summaryRaw.summary ?? "Summary unavailable.",
      keyThemes: summaryRaw.keyThemes ?? [],
      readingQuestions: (readingRaw.questions ??
        readingRaw) as PracticeGenerationResult["readingQuestions"],
      vocabulary: (vocabRaw.vocabulary ??
        vocabRaw) as PracticeGenerationResult["vocabulary"],
      writingPrompt:
        promptsRaw.writingPrompt ??
        "Write an essay on the main theme of the provided text.",
      writingPromptType:
        (promptsRaw.writingPromptType as PracticeGenerationResult["writingPromptType"]) ??
        "Task 2",
      speakingPrompt:
        promptsRaw.speakingPrompt ??
        "Describe a topic related to the article you read.",
      speakingFollowUps: promptsRaw.speakingFollowUps ?? [],
      studyPlan:
        (summaryRaw.studyPlan as PracticeGenerationResult["studyPlan"]) ?? [],
      examType: input.examType,
      skillFocus: input.skillFocus,
      level: input.level,
      generatedAt: new Date().toISOString(),
      isUsingMockData: false,
    };
  } catch (err) {
    console.error("[generatePractice] Error, falling back to mock:", err);
    return {
      ...MOCK_PRACTICE_RESULT,
      examType: input.examType,
      skillFocus: input.skillFocus,
      level: input.level,
      generatedAt: new Date().toISOString(),
      isUsingMockData: true,
    };
  }
}

// ==============================
// Main: Generate Writing Feedback
// ==============================

export async function generateWritingFeedback(
  userAnswer: string,
  writingPrompt: string,
  examType: ExamType,
  level: EnglishLevel
): Promise<WritingFeedbackResult> {
  if (!hasApiKey()) {
    await new Promise((r) => setTimeout(r, 1000));
    return getMockWritingFeedback(userAnswer, examType);
  }

  try {
    const prompt = buildWritingFeedbackPrompt(
      userAnswer,
      writingPrompt,
      examType,
      level
    );

    const result = await callOpenAI<WritingFeedbackResult>(
      "You are a trained language exam writing assessor. Return only valid JSON.",
      prompt,
      "gpt-4o" // Use the more capable model for writing feedback
    );

    return {
      ...result,
      wordCount: userAnswer.trim().split(/\s+/).filter(Boolean).length,
      generatedAt: new Date().toISOString(),
      isUsingMockData: false,
      disclaimer:
        result.disclaimer ??
        "⚠️ This is an AI-generated practice estimate only. It is not an official IELTS or TOEFL score. PracticeForge is not affiliated with IDP, British Council, ETS, or Cambridge Assessment English.",
    };
  } catch (err) {
    console.error("[generateWritingFeedback] Error, falling back to mock:", err);
    return getMockWritingFeedback(userAnswer, examType);
  }
}
