import { NextResponse } from "next/server";
import { generateWritingFeedback } from "@/lib/ai/generatePractice";
import type { ExamType, EnglishLevel } from "@/types";

export async function POST(request: Request) {
  try {
    const body: { userAnswer: string; writingPrompt: string; examType: ExamType; level: EnglishLevel } = await request.json();

    const wordCount = body.userAnswer.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 50) {
      return NextResponse.json(
        { error: "Your response is too short. Please write at least 50 words for meaningful feedback." },
        { status: 400 }
      );
    }

    const result = await generateWritingFeedback(
      body.userAnswer,
      body.writingPrompt,
      body.examType,
      body.level
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/writing-feedback] Error:", err);
    return NextResponse.json({ error: "Failed to generate writing feedback. Please try again." }, { status: 500 });
  }
}
