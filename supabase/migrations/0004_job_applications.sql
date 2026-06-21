-- ============================================================================
-- Phase 4 — private job-application tracker.
--
-- CLAUDE.md hard rule #2: this data is real personal data. The table lives in a
-- SEPARATE `private` schema granted to the `service_role` Postgres role — which
-- only the SECRET KEY can act as — ONLY; `anon` and `authenticated` get nothing.
-- The app reaches it exclusively via the secret-key client
-- (createAdminClient().schema('private')) from admin-gated server actions; the
-- secret key never reaches the browser.
--
-- For PostgREST to route secret-key (service_role) requests to this schema,
-- `private` must be in the project's Exposed Schemas. The DO block below sets it;
-- if it cannot, ALSO add `private` under Dashboard → Settings → API → Exposed
-- schemas. Either way, anon/authenticated are denied by the absence of grants.
--
-- HOW TO RUN: `supabase db push --db-url "$SUPABASE_DB_URL"` (see CLAUDE.md).
-- ============================================================================

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

create schema if not exists private;

-- ----------------------------------------------------------------------------
-- Table
-- ----------------------------------------------------------------------------
create table if not exists private.job_applications (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  application_date date not null default current_date,
  status text not null default 'applied'
    check (status in ('applied', 'screening', 'interview', 'offer', 'rejected', 'ghosted')),
  -- DB-owned: latches true once the application reaches interview/offer, so the
  -- funnel's interview rate stays accurate even after the status moves on (e.g.
  -- to rejected). Managed by the trigger below; never written by the app.
  reached_interview boolean not null default false,
  source text,
  job_url text,
  salary_min integer,
  salary_max integer,
  contact_name text,
  contact_email text,
  next_follow_up date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists job_applications_status_idx
  on private.job_applications (status);
create index if not exists job_applications_next_follow_up_idx
  on private.job_applications (next_follow_up);
create index if not exists job_applications_application_date_idx
  on private.job_applications (application_date desc);

-- updated_at trigger (reuses public.set_updated_at() from 0001)
drop trigger if exists job_applications_set_updated_at on private.job_applications;
create trigger job_applications_set_updated_at
  before update on private.job_applications
  for each row execute function public.set_updated_at();

-- reached_interview latch — set true the moment status hits interview/offer, and
-- never cleared, so the interview-rate funnel metric does not drift downward as
-- interviews resolve into rejections.
create or replace function private.set_reached_interview()
returns trigger
language plpgsql
as $$
begin
  if new.status in ('interview', 'offer') then
    new.reached_interview = true;
  end if;
  return new;
end;
$$;

drop trigger if exists job_applications_set_reached_interview on private.job_applications;
create trigger job_applications_set_reached_interview
  before insert or update on private.job_applications
  for each row execute function private.set_reached_interview();

-- ----------------------------------------------------------------------------
-- Privileges — service_role ONLY. anon/authenticated get nothing.
-- ----------------------------------------------------------------------------
revoke all on schema private from anon, authenticated;
revoke all on all tables in schema private from anon, authenticated;

grant usage on schema private to service_role;
grant all privileges on all tables in schema private to service_role;
alter default privileges in schema private
  grant all privileges on tables to service_role;

-- Defense in depth: RLS on, no policies → only the RLS-bypassing service_role
-- can touch rows even if a grant ever leaked.
alter table private.job_applications enable row level security;

-- ----------------------------------------------------------------------------
-- Expose the `private` schema to PostgREST (best effort). Safe to leave even if
-- it no-ops; also settable in Dashboard → Settings → API → Exposed schemas.
-- ----------------------------------------------------------------------------
do $$
begin
  execute 'alter role authenticator set pgrst.db_schemas = ''public, graphql_public, private''';
  perform pg_notify('pgrst', 'reload config');
exception
  when others then
    raise notice 'Could not set Exposed Schemas automatically — add "private" in Dashboard → Settings → API → Exposed schemas.';
end
$$;
