import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Anonymous Supabase client for PUBLIC reads (no cookies, no session).
 *
 * Using the publishable key without cookies keeps public pages statically
 * renderable, and RLS still restricts anon to `published = true` rows.
 * Throws if env isn't configured — callers (the lib/data layer) catch and
 * fall back to empty results so the build/site work before Supabase is set up.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase is not configured (missing URL or publishable key).",
    );
  }

  return createSupabaseClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
