import { Pool } from "pg";

// Self-hosted PostgreSQL connection (server-side only). The app runs as the
// public demo until DATABASE_URL is set, exactly like the Supabase/Stripe guards.
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  }
  return pool;
}

/** Run a parameterised query and return the rows. Always use $1, $2… params. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const res = await getPool().query(text, params as unknown[]);
  return res.rows as T[];
}
