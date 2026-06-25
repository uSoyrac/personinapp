import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";

// Lets client components check the current auth state.
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
