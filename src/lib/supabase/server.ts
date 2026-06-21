import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Session-aware server client (publishable key, cookie-bound). Use for public tables
 * (`posts`, `projects`) where access is governed by Row Level Security.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, which cannot set cookies. Safe to
            // ignore when middleware is responsible for refreshing the session.
          }
        },
      },
    },
  );
}

/**
 * Secret-key client — FULL ACCESS, bypasses RLS, and is the ONLY way to reach
 * the private `job_applications` schema (CLAUDE.md hard rule #2). The secret key
 * authenticates as the `service_role` Postgres role.
 *
 * This module imports "server-only", so importing it into a Client Component is
 * a build error. The secret key must never reach the browser. Use this
 * exclusively from Server Actions and Route Handlers.
 */
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("SUPABASE_SECRET_KEY is not set");
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secretKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
