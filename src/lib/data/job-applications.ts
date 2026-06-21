import "server-only";

import { createAdminClient } from "@/lib/supabase/server";

import { JOB_STATUSES } from "./types";
import type { JobApplication, JobApplicationWrite, JobStats } from "./types";

/**
 * Data-access seam for the PRIVATE job tracker (CLAUDE.md hard rule #2). The
 * table lives in the `private` schema, reachable ONLY through the secret-key
 * client (the service_role role) — never the anon/publishable key, never the
 * browser. Every caller is an admin-gated server action. This is the only module
 * that touches this data.
 */

const TABLE = "job_applications";

/** Secret-key client (service_role) scoped to the private schema. */
function db() {
  return createAdminClient().schema("private").from(TABLE);
}

function isFrameworkSignal(err: unknown): boolean {
  return typeof (err as { digest?: unknown })?.digest === "string";
}

async function safeQuery<T>(
  label: string,
  fallback: T,
  run: () => Promise<T>,
): Promise<T> {
  try {
    return await run();
  } catch (err) {
    if (isFrameworkSignal(err)) throw err;
    console.error(`[data:job-applications] ${label} failed:`, err);
    return fallback;
  }
}

/* --------------------------------- Reads --------------------------------- */

export async function listAll(): Promise<JobApplication[]> {
  return safeQuery("listAll", [], async () => {
    const { data, error } = await db()
      .select("*")
      .order("application_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as JobApplication[];
  });
}

export async function getById(id: string): Promise<JobApplication | null> {
  return safeQuery("getById", null, async () => {
    const { data, error } = await db().select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return (data as JobApplication | null) ?? null;
  });
}

export async function getStats(): Promise<JobStats> {
  return safeQuery("getStats", emptyStats(), async () => {
    const { data, error } = await db().select(
      "status, next_follow_up, reached_interview",
    );
    if (error) throw error;
    return summarizeJobs(
      (data ?? []) as Pick<
        JobApplication,
        "status" | "next_follow_up" | "reached_interview"
      >[],
    );
  });
}

/* --------------------------------- Writes -------------------------------- */
/* Admin only — the calling server action enforces auth. */

export async function createJobApplication(
  data: JobApplicationWrite,
): Promise<void> {
  const { error } = await db().insert(data);
  if (error) throw error;
}

export async function updateJobApplication(
  id: string,
  data: Partial<JobApplicationWrite>,
): Promise<void> {
  const { error } = await db().update(data).eq("id", id);
  if (error) throw error;
}

export async function removeJobApplication(id: string): Promise<void> {
  const { error } = await db().delete().eq("id", id);
  if (error) throw error;
}

/* --------------------------------- Stats --------------------------------- */

function emptyStats(): JobStats {
  return {
    total: 0,
    byStatus: {
      applied: 0,
      screening: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      ghosted: 0,
    },
    responseRate: 0,
    interviewRate: 0,
    followUpsDue: 0,
  };
}

/** Active pipeline statuses for which a follow-up is meaningful. */
const ACTIVE_STATUSES = new Set(["applied", "screening", "interview"]);

function todayISO(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

/**
 * Pure funnel summary. `responded` = anything past the initial "applied"/"ghosted"
 * limbo; `interviewed` uses the `reached_interview` latch, so an application that
 * interviewed and was later rejected still counts (a true funnel metric).
 */
export function summarizeJobs(
  jobs: Pick<JobApplication, "status" | "next_follow_up" | "reached_interview">[],
): JobStats {
  const stats = emptyStats();
  stats.total = jobs.length;
  if (jobs.length === 0) return stats;

  const today = todayISO();
  let responded = 0;
  let interviewed = 0;

  for (const job of jobs) {
    stats.byStatus[job.status] += 1;
    if (job.status !== "applied" && job.status !== "ghosted") responded += 1;
    if (job.reached_interview) interviewed += 1;
    if (
      job.next_follow_up &&
      job.next_follow_up <= today &&
      ACTIVE_STATUSES.has(job.status)
    ) {
      stats.followUpsDue += 1;
    }
  }

  stats.responseRate = Math.round((responded / jobs.length) * 100);
  stats.interviewRate = Math.round((interviewed / jobs.length) * 100);
  return stats;
}

export { JOB_STATUSES };
