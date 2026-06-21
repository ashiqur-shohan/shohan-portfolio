-- ============================================================================
-- Phase 2 — projects table, RLS, and cover-image storage.
--
-- HOW TO RUN: paste this into the Supabase dashboard SQL editor (or
-- `supabase db push`). BEFORE running, edit the admin email in is_admin()
-- below so it matches the ADMIN_EMAIL in your .env.local.
-- ============================================================================

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Table
-- ----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  description text,
  problem text,
  approach text,
  outcome text,
  tech_stack text[] not null default '{}',
  cover_image_url text,
  live_url text,
  repo_url text,
  year int,
  featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_published_idx on public.projects (published);

-- ----------------------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Admin check — the single allowlisted admin.
-- >>> EDIT the email below to match ADMIN_EMAIL in your .env.local. <<<
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'you@example.com';
$$;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.projects enable row level security;

-- Anyone may read published projects.
drop policy if exists "projects: public read published" on public.projects;
create policy "projects: public read published"
  on public.projects for select
  using (published = true);

-- The admin may read everything (including drafts).
drop policy if exists "projects: admin read all" on public.projects;
create policy "projects: admin read all"
  on public.projects for select
  to authenticated
  using (public.is_admin());

-- The admin has full write access.
drop policy if exists "projects: admin insert" on public.projects;
create policy "projects: admin insert"
  on public.projects for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "projects: admin update" on public.projects;
create policy "projects: admin update"
  on public.projects for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "projects: admin delete" on public.projects;
create policy "projects: admin delete"
  on public.projects for delete
  to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- Storage — public bucket for project cover images
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "project-images: public read" on storage.objects;
create policy "project-images: public read"
  on storage.objects for select
  using (bucket_id = 'project-images');

drop policy if exists "project-images: admin insert" on storage.objects;
create policy "project-images: admin insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "project-images: admin update" on storage.objects;
create policy "project-images: admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "project-images: admin delete" on storage.objects;
create policy "project-images: admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin());
