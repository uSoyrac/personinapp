import { getSession } from "@/lib/auth/session";
import { query, isDbConfigured } from "@/lib/db";

export type AuthUser = { id: string; email: string; display_name: string | null };

/** The signed-in user (server-side), resolved from the session cookie + DB. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isDbConfigured()) return null;
  const session = await getSession();
  if (!session) return null;

  const rows = await query<AuthUser>(
    "select id, email, display_name from users where id = $1",
    [session.sub]
  );
  return rows[0] ?? null;
}
