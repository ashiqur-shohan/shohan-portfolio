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
  categories: string[];
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

/* ----------------------------- Job tracker ------------------------------- */
/* Private personal data — lives in the `private` schema, reachable only via the
 * secret-key client (the service_role role) from admin-gated actions
 * (CLAUDE.md hard rule #2). */

export type JobStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "ghosted";

/** The pipeline order, used for the kanban columns and any iteration. */
export const JOB_STATUSES: readonly JobStatus[] = [
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "ghosted",
];

/** Human labels for each status. Shared by the board and the form. */
export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  ghosted: "Ghosted",
};

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  /** `date` column → ISO "YYYY-MM-DD". */
  application_date: string;
  status: JobStatus;
  /** DB-owned latch: true once the app reached interview/offer (never cleared). */
  reached_interview: boolean;
  source: string | null;
  job_url: string | null;
  salary_min: number | null;
  salary_max: number | null;
  contact_name: string | null;
  contact_email: string | null;
  /** `date` column → ISO "YYYY-MM-DD", or null. */
  next_follow_up: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Columns the admin can write. `reached_interview` is omitted because the DB
 * trigger owns it (see 0004), alongside id/timestamps.
 */
export type JobApplicationWrite = Omit<
  JobApplication,
  "id" | "created_at" | "updated_at" | "reached_interview"
>;

/** Funnel summary for the tracker + admin dashboard. */
export type JobStats = {
  total: number;
  byStatus: Record<JobStatus, number>;
  /** Share of applications that got any response (not applied/ghosted). */
  responseRate: number;
  /** Share of applications that ever reached interview/offer (the latch). */
  interviewRate: number;
  /** Active applications whose follow-up date is today or earlier. */
  followUpsDue: number;
};
