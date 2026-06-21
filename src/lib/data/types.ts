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
export type ContentCounts = { total: number; published: number };

/** @deprecated Use {@link ContentCounts}. Kept as an alias for existing callers. */
export type ProjectCounts = ContentCounts;

/**
 * JSON-serializable value. Used for `Post.content_json` so the domain type stays
 * decoupled from the editor library (today BlockNote blocks; tomorrow anything).
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  /** Source of truth: the editor's block document (BlockNote blocks today). */
  content_json: Json;
  /** Rendered once at save time, served on the public reading page. */
  content_html: string;
  cover_image_url: string | null;
  tags: string[];
  status: PostStatus;
  /** Stamped by the DB the first time the post is published; null while draft. */
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Columns the admin can write. `published_at` is omitted because the database
 * trigger owns it (see 0003_posts.sql), alongside id/timestamps.
 */
export type PostWrite = Omit<
  Post,
  "id" | "created_at" | "updated_at" | "published_at"
>;
