import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/**
 * Auth seam. This file (plus `src/proxy.ts`, the edge middleware) is the ONLY
 * place Supabase Auth is touched. Swap the bodies here to change auth backends
 * without touching server actions, pages, or components. See CLAUDE.md Hard rule 4.
 */

/**
 * Returns the signed-in user only if they are the single allowlisted admin,
 * otherwise null. Never throws (treats any error as "not an admin").
 */
export async function getAdminUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    if (!process.env.ADMIN_EMAIL || user.email !== process.env.ADMIN_EMAIL) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

/** Server-side guard: redirect to the login page unless the admin is signed in. */
export async function requireAdmin(): Promise<User> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

/**
 * Verify credentials. Returns `{ ok: false }` on bad credentials; throws if the
 * auth backend is unreachable so the caller can show a distinct message.
 */
export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { ok: !error };
}

/** End the session. Swallows errors (sign-out should always proceed to redirect). */
export async function signOut(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("[auth] signOut failed:", err);
  }
}
