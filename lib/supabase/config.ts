/**
 * Supabase is "configured" only once both public env vars are present.
 * Until then the app runs as the original frontend demo (auth disabled),
 * so deploying without Supabase keys never breaks the live site.
 */
export function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}
