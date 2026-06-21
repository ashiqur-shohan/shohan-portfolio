-- ============================================================================
-- Phase 3 — posts table (blog), RLS, and cover-image storage.
--
-- Mirrors 0001_projects.sql. Reuses the existing public.is_admin() and
-- public.set_updated_at() defined there (0002 pinned is_admin() to the real
-- admin email) — this migration does NOT redefine them.
--
-- HOW TO RUN: `supabase db push --db-url "<session-pooler url>"` (or paste into
-- the Supabase dashboard SQL editor).
-- ============================================================================

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Table
-- ----------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content_json jsonb not null default '[]'::jsonb,
  content_html text not null default '',
  cover_image_url text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_slug_idx on public.posts (slug);
create index if not exists posts_status_idx on public.posts (status);
create index if not exists posts_published_at_idx on public.posts (published_at desc);

-- ----------------------------------------------------------------------------
-- updated_at trigger (reuses public.set_updated_at() from 0001)
-- ----------------------------------------------------------------------------
drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- published_at trigger — stamp the first time a post becomes published, and
-- never clear it afterwards (re-publishing keeps the original date). Keeping
-- this in the DB means every write path (form save AND the list status toggle)
-- behaves identically, with no prior-state fetch in the app.
-- ----------------------------------------------------------------------------
create or replace function public.set_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists posts_set_published_at on public.posts;
create trigger posts_set_published_at
  before insert or update on public.posts
  for each row execute function public.set_published_at();

-- ----------------------------------------------------------------------------
-- Row Level Security (mirrors projects)
-- ----------------------------------------------------------------------------
alter table public.posts enable row level security;

-- Anyone may read published posts.
drop policy if exists "posts: public read published" on public.posts;
create policy "posts: public read published"
  on public.posts for select
  using (status = 'published');

-- The admin may read everything (including drafts).
drop policy if exists "posts: admin read all" on public.posts;
create policy "posts: admin read all"
  on public.posts for select
  to authenticated
  using (public.is_admin());

-- The admin has full write access.
drop policy if exists "posts: admin insert" on public.posts;
create policy "posts: admin insert"
  on public.posts for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "posts: admin update" on public.posts;
create policy "posts: admin update"
  on public.posts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "posts: admin delete" on public.posts;
create policy "posts: admin delete"
  on public.posts for delete
  to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- Storage — public bucket for post cover images
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "post-images: public read" on storage.objects;
create policy "post-images: public read"
  on storage.objects for select
  using (bucket_id = 'post-images');

drop policy if exists "post-images: admin insert" on storage.objects;
create policy "post-images: admin insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images' and public.is_admin());

drop policy if exists "post-images: admin update" on storage.objects;
create policy "post-images: admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'post-images' and public.is_admin());

drop policy if exists "post-images: admin delete" on storage.objects;
create policy "post-images: admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images' and public.is_admin());
