import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

import type { ContentCounts, Post, PostWrite } from "./types";

/**
 * Data-access seam for `posts`. The ONLY place Supabase is touched for post
 * data — reads and writes both. Callers (pages, server actions) depend on these
 * backend-agnostic functions. See CLAUDE.md Hard rule 4 and lib/data/projects.ts.
 */

/** Next.js control-flow signals carry a `digest`; they must propagate. */
function isFrameworkSignal(err: unknown): boolean {
  return typeof (err as { digest?: unknown })?.digest === "string";
}

/**
 * Resilient wrapper for reads: if Supabase isn't configured/reachable, log and
 * fall back instead of crashing the build or page. Re-throws Next.js signals.
 */
async function safeQuery<T>(
  label: string,
  fallback: T,
  run: () => Promise<T>,
): Promise<T> {
  try {
    return await run();
  } catch (err) {
    if (isFrameworkSignal(err)) throw err;
    console.error(`[data:posts] ${label} failed:`, err);
    return fallback;
  }
}

/* ------------------------------ Public reads ----------------------------- */
/* Anonymous; RLS restricts the anon role to published rows. */

export async function listPublished(): Promise<Post[]> {
  return safeQuery("listPublished", [], async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Post[];
  });
}

export async function listRecent(limit = 3): Promise<Post[]> {
  return safeQuery("listRecent", [], async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as Post[];
  });
}

export async function getBySlug(slug: string): Promise<Post | null> {
  return safeQuery("getBySlug", null, async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw error;
    return (data as Post | null) ?? null;
  });
}

/* ------------------------------- Admin reads ----------------------------- */
/* Session-bound (cookie); RLS grants the admin every row. */

export async function listAll(): Promise<Post[]> {
  return safeQuery("listAll", [], async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Post[];
  });
}

export async function getById(id: string): Promise<Post | null> {
  return safeQuery("getById", null, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as Post | null) ?? null;
  });
}

export async function getCounts(): Promise<ContentCounts> {
  return safeQuery("getCounts", { total: 0, published: 0 }, async () => {
    const supabase = await createClient();
    const [{ count: total }, { count: published }] = await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
    ]);
    return { total: total ?? 0, published: published ?? 0 };
  });
}

/* --------------------------------- Writes -------------------------------- */
/* Admin only — the calling server action enforces auth. These throw on error
 * so the action can translate e.g. Postgres 23505 → "slug already taken". */

export async function createPost(data: PostWrite): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert(data);
  if (error) throw error;
}

export async function updatePost(
  id: string,
  data: Partial<PostWrite>,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").update(data).eq("id", id);
  if (error) throw error;
}

export async function removePost(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}
