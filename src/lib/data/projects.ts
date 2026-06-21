import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

import type { Project, ProjectCounts, ProjectWrite } from "./types";

/**
 * Data-access seam for `projects`. This module is the ONLY place Supabase is
 * touched for project data — reads and writes both. Callers (pages, server
 * actions) depend on these backend-agnostic functions, so swapping to a custom
 * API later means rewriting this file alone, not its callers. See CLAUDE.md
 * Hard rule 4.
 */

/**
 * Next.js control-flow signals (dynamic-server usage, redirect, notFound) are
 * thrown as errors carrying a `digest` string. They must propagate to the
 * framework, never be swallowed as a "failed query".
 */
function isFrameworkSignal(err: unknown): boolean {
  return typeof (err as { digest?: unknown })?.digest === "string";
}

/**
 * Resilient wrapper for reads: if Supabase isn't configured/reachable yet, log
 * and fall back instead of crashing the build or the page. Re-throws Next.js
 * control-flow signals so dynamic routes are still detected correctly.
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
    console.error(`[data:projects] ${label} failed:`, err);
    return fallback;
  }
}

/* ------------------------------ Public reads ----------------------------- */
/* Anonymous, statically renderable; RLS restricts the anon role to published. */

export async function listPublished(): Promise<Project[]> {
  return safeQuery("listPublished", [], async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Project[];
  });
}

export async function listFeatured(): Promise<Project[]> {
  return safeQuery("listFeatured", [], async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Project[];
  });
}

export async function getBySlug(slug: string): Promise<Project | null> {
  return safeQuery("getBySlug", null, async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw error;
    return (data as Project | null) ?? null;
  });
}

/* ------------------------------- Admin reads ----------------------------- */
/* Session-bound (cookie); RLS grants the admin every row. */

export async function listAll(): Promise<Project[]> {
  return safeQuery("listAll", [], async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Project[];
  });
}

export async function getById(id: string): Promise<Project | null> {
  return safeQuery("getById", null, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as Project | null) ?? null;
  });
}

export async function getCounts(): Promise<ProjectCounts> {
  return safeQuery("getCounts", { total: 0, published: 0 }, async () => {
    const supabase = await createClient();
    const [{ count: total }, { count: published }] = await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("published", true),
    ]);
    return { total: total ?? 0, published: published ?? 0 };
  });
}

/* --------------------------------- Writes -------------------------------- */
/* Admin only — the calling server action enforces auth. These throw on error
 * so the action can translate e.g. Postgres 23505 → "slug already taken". */

export async function createProject(data: ProjectWrite): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert(data);
  if (error) throw error;
}

export async function updateProject(
  id: string,
  data: Partial<ProjectWrite>,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update(data).eq("id", id);
  if (error) throw error;
}

export async function removeProject(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
