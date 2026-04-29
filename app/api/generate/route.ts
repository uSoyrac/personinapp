import { NextResponse } from "next/server";
import { generatePractice } from "@/lib/ai/generatePractice";
import type { PracticeSessionInput } from "@/types";

export async function POST(request: Request) {
  try {
    const body: PracticeSessionInput = await request.json();

    // Input validation
    if (!body.inputText || body.inputText.trim().length < 50) {
      return NextResponse.json(
        { error: "Input text is too short. Please provide at least 50 characters for meaningful practice generation." },
        { status: 400 }
      );
    }

    if (!body.examType || !["IELTS_ACADEMIC", "TOEFL_IBT"].includes(body.examType)) {
      return NextResponse.json({ error: "Invalid exam type." }, { status: 400 });
    }

    if (!body.skillFocus) {
      return NextResponse.json({ error: "Skill focus is required." }, { status: 400 });
    }

    const result = await generatePractice(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/generate] Error:", err);
    return NextResponse.json({ error: "Failed to generate practice content. Please try again." }, { status: 500 });
  }
}
