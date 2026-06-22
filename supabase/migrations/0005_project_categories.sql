-- ============================================================================
-- Phase 5 — add `categories` to projects for the public All/Web/Mobile/API
-- filter (design.md §7.1).
--
-- Modelled as text[] (mirrors `tech_stack` from 0001_projects.sql). Allowed
-- values "web" | "mobile" | "api" are enforced at the application layer via
-- the Zod schema in src/lib/validations/project.ts — kept out of the DB so the
-- set can grow without another migration. Default '{}' so existing rows stay
-- valid under the NOT NULL constraint.
--
-- HOW TO RUN: `supabase db push --db-url "$SUPABASE_DB_URL"` (see CLAUDE.md).
-- ============================================================================

alter table public.projects
  add column if not exists categories text[] not null default '{}';
