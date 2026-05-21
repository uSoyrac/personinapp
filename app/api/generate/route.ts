import { NextResponse } from "next/server";
import { generateOfflinePractice } from "@/lib/quiz-engine";
import type { PracticeSessionInput, UserTier } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tier = "free", ...input } = body as PracticeSessionInput & { tier?: UserTier };

    // Input validation
    if (!input.inputText || input.inputText.trim().length < 50) {
      return NextResponse.json(
        { error: "Input text is too short. Please provide at least 50 characters for meaningful practice generation." },
        { status: 400 }
      );
    }

    if (!input.examType || !["IELTS_ACADEMIC", "TOEFL_IBT", "GENERAL_ENGLISH"].includes(input.examType)) {
      return NextResponse.json({ error: "Invalid exam type." }, { status: 400 });
    }

    if (!input.skillFocus) {
      return NextResponse.json({ error: "Skill focus is required." }, { status: 400 });
    }

    const result = generateOfflinePractice(input, tier);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/generate] Error:", err);
    return NextResponse.json({ error: "Failed to generate practice content. Please try again." }, { status: 500 });
  }
}
