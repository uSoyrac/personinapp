import { NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Login is not available yet." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const rows = await query<{ id: string; password_hash: string }>(
    "select id, password_hash from users where email = $1",
    [email]
  );
  const user = rows[0];

  // Same response whether the email is unknown or the password is wrong.
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createSession({ sub: user.id, email });
  return NextResponse.json({ ok: true });
}
