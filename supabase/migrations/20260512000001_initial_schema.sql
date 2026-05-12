-- ─────────────────────────────────────────────────────────────
-- Shohan Portfolio — Initial Schema
-- ─────────────────────────────────────────────────────────────

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─── updated_at trigger helper ───────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── ENUMS ───────────────────────────────────────────────────
create type skill_category as enum (
  'language', 'framework', 'database', 'devops', 'cloud', 'tool', 'other'
);

create type project_status as enum (
  'concept', 'in_progress', 'shipped', 'archived'
);

create type post_status as enum ('draft', 'published');

create type colophon_layer as enum (
  'framework', 'hosting', 'database', 'ci', 'monitoring', 'dns', 'other'
);

create type availability_status as enum (
  'open', 'limited', 'closed'
);

-- ─── ADMINS ──────────────────────────────────────────────────
create table admins (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'admin',
  created_at timestamptz not null default now(),
  unique (user_id)
);

alter table admins enable row level security;

-- Only the admin themselves can read their own row
create policy "Admin can read own row"
  on admins for select
  using (auth.uid() = user_id);

-- ─── PROFILE (singleton) ─────────────────────────────────────
create table profile (
  id                   uuid primary key default gen_random_uuid(),
  full_name            text not null default 'Ashiqur Rahman Shohan',
  headline             text not null default 'Software Engineer & DevOps Engineer',
  bio                  text,
  location             text not null default 'Bangladesh',
  availability_status  availability_status not null default 'open',
  availability_message text,
  avatar_url           text,
  resume_url           text,
  email_public         text,
  social_links         jsonb not null default '{}'::jsonb,
  seo                  jsonb not null default '{}'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger profile_updated_at
  before update on profile
  for each row execute function set_updated_at();

alter table profile enable row level security;

create policy "Public can read profile"
  on profile for select to anon, authenticated using (true);

create policy "Admin can update profile"
  on profile for update
  using (exists (select 1 from admins where user_id = auth.uid()));

create policy "Admin can insert profile"
  on profile for insert
  with check (exists (select 1 from admins where user_id = auth.uid()));

-- ─── SKILLS ──────────────────────────────────────────────────
create table skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    skill_category not null default 'tool',
  proficiency smallint not null default 3 check (proficiency between 1 and 5),
  icon_slug   text,
  sort_order  smallint not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger skills_updated_at
  before update on skills
  for each row execute function set_updated_at();

create index skills_category_idx on skills (category);
create index skills_sort_idx on skills (sort_order);

alter table skills enable row level security;

create policy "Public can read skills"
  on skills for select to anon, authenticated using (true);

create policy "Admin can manage skills"
  on skills for all
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

-- ─── EXPERIENCES ─────────────────────────────────────────────
create table experiences (
  id               uuid primary key default gen_random_uuid(),
  company          text not null,
  role             text not null,
  start_date       date not null,
  end_date         date,
  current          boolean not null default false,
  location         text,
  description      text,
  highlights       jsonb not null default '[]'::jsonb,
  company_logo_url text,
  sort_order       smallint not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger experiences_updated_at
  before update on experiences
  for each row execute function set_updated_at();

create index experiences_sort_idx on experiences (sort_order);

alter table experiences enable row level security;

create policy "Public can read experiences"
  on experiences for select to anon, authenticated using (true);

create policy "Admin can manage experiences"
  on experiences for all
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

-- ─── EDUCATION ───────────────────────────────────────────────
create table education (
  id             uuid primary key default gen_random_uuid(),
  institution    text not null,
  degree         text not null,
  field_of_study text not null,
  start_date     date not null,
  end_date       date,
  gpa            text,
  description    text,
  logo_url       text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger education_updated_at
  before update on education
  for each row execute function set_updated_at();

alter table education enable row level security;

create policy "Public can read education"
  on education for select to anon, authenticated using (true);

create policy "Admin can manage education"
  on education for all
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

-- ─── CERTIFICATIONS ──────────────────────────────────────────
create table certifications (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  issuer         text not null,
  issue_date     date not null,
  expiry_date    date,
  credential_url text,
  image_url      text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger certifications_updated_at
  before update on certifications
  for each row execute function set_updated_at();

alter table certifications enable row level security;

create policy "Public can read certifications"
  on certifications for select to anon, authenticated using (true);

create policy "Admin can manage certifications"
  on certifications for all
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

-- ─── PROJECTS ────────────────────────────────────────────────
create table projects (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  summary        text not null,
  content        text,
  cover_image_url text,
  tech_stack     text[] not null default '{}',
  live_url       text,
  repo_url       text,
  status         project_status not null default 'shipped',
  featured       boolean not null default false,
  sort_order     smallint not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger projects_updated_at
  before update on projects
  for each row execute function set_updated_at();

create index projects_slug_idx on projects (slug);
create index projects_featured_idx on projects (featured);
create index projects_sort_idx on projects (sort_order);

alter table projects enable row level security;

create policy "Public can read projects"
  on projects for select to anon, authenticated using (true);

create policy "Admin can manage projects"
  on projects for all
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

-- ─── BLOG POSTS ──────────────────────────────────────────────
create table blog_posts (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null unique,
  title                text not null,
  excerpt              text,
  content              text,
  cover_image_url      text,
  tags                 text[] not null default '{}',
  reading_time_minutes smallint,
  status               post_status not null default 'draft',
  published_at         timestamptz,
  seo                  jsonb not null default '{}'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger blog_posts_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

create index blog_posts_slug_idx on blog_posts (slug);
create index blog_posts_status_idx on blog_posts (status);
create index blog_posts_published_idx on blog_posts (published_at desc)
  where status = 'published';
create index blog_posts_tags_idx on blog_posts using gin (tags);

alter table blog_posts enable row level security;

create policy "Public can read published posts"
  on blog_posts for select to anon, authenticated
  using (status = 'published');

create policy "Admin can read all posts"
  on blog_posts for select
  using (exists (select 1 from admins where user_id = auth.uid()));

create policy "Admin can manage posts"
  on blog_posts for insert, update, delete
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

-- ─── NOW ENTRIES ─────────────────────────────────────────────
create table now_entries (
  id         uuid primary key default gen_random_uuid(),
  content    text not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger now_entries_updated_at
  before update on now_entries
  for each row execute function set_updated_at();

create index now_current_idx on now_entries (is_current) where is_current = true;

alter table now_entries enable row level security;

create policy "Public can read current now entry"
  on now_entries for select to anon, authenticated
  using (is_current = true);

create policy "Admin can read all now entries"
  on now_entries for select
  using (exists (select 1 from admins where user_id = auth.uid()));

create policy "Admin can manage now entries"
  on now_entries for insert, update, delete
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

-- ─── USES ITEMS ──────────────────────────────────────────────
create table uses_items (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  name        text not null,
  description text,
  url         text,
  sort_order  smallint not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger uses_items_updated_at
  before update on uses_items
  for each row execute function set_updated_at();

create index uses_items_sort_idx on uses_items (category, sort_order);

alter table uses_items enable row level security;

create policy "Public can read uses items"
  on uses_items for select to anon, authenticated using (true);

create policy "Admin can manage uses items"
  on uses_items for all
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

-- ─── COLOPHON ITEMS ──────────────────────────────────────────
create table colophon_items (
  id         uuid primary key default gen_random_uuid(),
  layer      colophon_layer not null default 'other',
  name       text not null,
  version    text,
  url        text,
  notes      text,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger colophon_items_updated_at
  before update on colophon_items
  for each row execute function set_updated_at();

alter table colophon_items enable row level security;

create policy "Public can read colophon items"
  on colophon_items for select to anon, authenticated using (true);

create policy "Admin can manage colophon items"
  on colophon_items for all
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

-- ─── CONTACT MESSAGES ────────────────────────────────────────
create table contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text,
  message    text not null,
  ip_hash    text,
  user_agent text,
  read       boolean not null default false,
  archived   boolean not null default false,
  created_at timestamptz not null default now()
);

create index contact_messages_read_idx on contact_messages (read, archived);

alter table contact_messages enable row level security;

-- Anon can insert (submit the form)
create policy "Anyone can submit contact message"
  on contact_messages for insert to anon, authenticated
  with check (true);

-- Only admin can read/update
create policy "Admin can read messages"
  on contact_messages for select
  using (exists (select 1 from admins where user_id = auth.uid()));

create policy "Admin can update messages"
  on contact_messages for update
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));

-- ─── SITE SETTINGS (singleton) ───────────────────────────────
create table site_settings (
  id              uuid primary key default gen_random_uuid(),
  theme_default   text not null default 'dark',
  accent_color    text not null default 'teal',
  ga_id           text,
  plausible_domain text,
  og_default_image text,
  uptime_badge_url text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger site_settings_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

alter table site_settings enable row level security;

create policy "Public can read site settings"
  on site_settings for select to anon, authenticated using (true);

create policy "Admin can manage site settings"
  on site_settings for all
  using (exists (select 1 from admins where user_id = auth.uid()))
  with check (exists (select 1 from admins where user_id = auth.uid()));
