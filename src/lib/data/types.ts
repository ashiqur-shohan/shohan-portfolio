/**
 * Domain types — backend-agnostic. Import these everywhere via
 * `@/lib/data/types`; never reach into `@/lib/supabase`. Today they mirror the
 * Postgres tables, but they belong to the app, not the backend: if the backend
 * changes, only this file and `lib/data/*` change.
 *
 * Hand-written (no Supabase CLI / Docker). Keep in sync with supabase/migrations.
 */
export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string | null;
  problem: string | null;
  approach: string | null;
  outcome: string | null;
  tech_stack: string[];
  cover_image_url: string | null;
  live_url: string | null;
  repo_url: string | null;
  year: number | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

/** Columns the admin can write (id/timestamps are managed by the backend). */
export type ProjectWrite = Omit<Project, "id" | "created_at" | "updated_at">;

/** Aggregate counts for the admin dashboard. */
export type ProjectCounts = { total: number; published: number };
