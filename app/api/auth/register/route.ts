import { NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Sign-up is not available yet." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
    displayName?: string;
  };
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email.includes("@") || password.length < 8) {
    return NextResponse.json(
      { error: "Enter a valid email and a password of at least 8 characters." },
      { status: 400 }
    );
  }

  const existing = await query("select id from users where email = $1", [email]);
  if (existing.length > 0) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const rows = await query<{ id: string }>(
    "insert into users (email, password_hash, display_name) values ($1, $2, $3) returning id",
    [email, passwordHash, body.displayName?.trim() || email.split("@")[0]]
  );
  const userId = rows[0].id;

  await query(
    "insert into subscriptions (user_id, plan, status) values ($1, 'free', 'inactive') on conflict (user_id) do nothing",
    [userId]
  );

  await createSession({ sub: userId, email });
  return NextResponse.json({ ok: true });
}
