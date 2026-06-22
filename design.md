# design.md — Ashiqur Rahman Shohan · Portfolio + Admin

> **For Claude Code.** Read this fully before writing any code.
> The static mock **`portfolio-neo-tech-mint-final.html`** is the **visual source of truth** for the public site — reproduce its layout, spacing, palette, and typography faithfully. This document translates that mock into a real Next.js + Supabase application and specifies the private admin panel behind it.

---

## 1. What we're building

One Next.js app, two surfaces:

- **Public site** — a single-page (scroll) portfolio used for freelance work and job applications. **Build and ship this first.**
- **Admin panel** (`/admin`, private, single user) — manage blog posts and projects, and run a **private job-application tracker** that replaces a spreadsheet. Never visible to the public.

The public site is mostly static content with two dynamic, admin-managed areas: **Projects** and **Blog**. The job tracker is admin-only and never exposed.

---

## 2. Stack (locked)

- **Next.js** (App Router) + **TypeScript**
- **Supabase** — Postgres, Auth (`@supabase/ssr`), Storage
- **Tailwind CSS** + **shadcn/ui** (lucide-react icons)
- **React Hook Form** + **Zod** (forms + validation, client and server)
- **BlockNote** — blog editor (`@blocknote/react`, `@blocknote/mantine`, `@blocknote/code-block`, `@blocknote/server-util`)
- **Resend** — contact-form email
- **Vitest** + **React Testing Library** + **Playwright** (a few meaningful tests + one e2e)
- Deploy on **Vercel**
- `next/font` for fonts

**Explicitly out of scope — do NOT add:** GitHub Actions / CI pipelines, Docker, Redis or any rate-limiting infrastructure. (Contact-form spam protection = a honeypot field only.)

---

## 3. Architecture & security — read carefully

This is the part to get right; the job tracker holds real personal data and Supabase's anon key ships in the browser.

- **Public content** (`projects`, `posts`) lives in the **public** schema with **RLS enabled**: anonymous users may `SELECT` only published rows; the admin user has full CRUD.
- **Job tracker** (`job_applications`) lives in a **separate `private` Postgres schema that is NOT in Supabase's exposed schemas** — so it is unreachable through the auto-generated API. It is read/written **only from server actions using the service-role key**, which must never reach the client.
- **`/admin`** is gated in `middleware.ts`; a **single allowlisted admin email**.
- The **service-role key is server-only** (never imported into a client component or exposed to the browser).
- **Never rely on UI hiding** for access control — enforce at the database/API layer.

---

## 4. Visual design system (derived from the mock)

Dark theme is the **only** theme for v1 (the mock is dark-only). Structure tokens so a light theme could be added later, but don't build one now.

### 4.1 Color tokens — single source of truth

All colors live **once** in `app/globals.css` and are consumed as semantic tokens. **Never write a raw hex, `rgb()/hsl()`, or a Tailwind palette color (e.g. `bg-emerald-500`) in a component.** If a needed color isn't a token, add a token.

```css
:root{
  --bg:#0B1120;        /* page background */
  --band:#0E1A2D;      /* alternating section background */
  --card:#111827;      /* cards / surfaces */
  --card-2:#0E1626;    /* nested / stat surfaces, image gradient base */
  --primary:#10B981;   /* emerald — buttons, links, active, accents */
  --secondary:#34D399; /* mint — second accent (replaces the old cyan) */
  --text:#F8FAFC;      /* primary text */
  --muted:#94A3B8;     /* secondary text, labels */
  --border:#1F2937;    /* borders, dividers, inputs */
  --neutral:#475569;   /* neutral data segment (e.g. 4th language) */
  --on-accent:#04140D; /* text on primary/secondary fills (dark) */
}
```

Wire these into Tailwind (Tailwind v4 `@theme inline` mapping, or `theme.extend.colors` referencing the vars). Expose semantic utilities: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary`, `bg-secondary`, etc. If using shadcn/ui, alias these tokens to shadcn's expected variable names so its components inherit the palette.

### 4.2 Typography

Load via `next/font`:
- **Display:** Space Grotesk — headings, hero, section titles (weights 500/600/700).
- **Body:** Inter — paragraphs, UI text (400/500/600).
- **Mono:** JetBrains Mono — eyebrows, labels, stat captions, tags, code, data.

Scale (from the mock): hero `clamp(38px,5.6vw,60px)/700`; section h2 `clamp(26px,4vw,38px)/600`; card titles 16–18px/600; body 16px; eyebrow/labels 11–12px mono uppercase with `letter-spacing:.12em`.

### 4.3 Primitives (match the mock exactly)

- **Buttons:** `.btn-primary` = solid `--primary`, `--on-accent` text, lifts on hover; `.btn-ghost` = transparent, `--border`, hover border `--primary`. Radius 10px.
- **Tags:** mono 11px pill, `--muted` text, `--border`, radius 6px.
- **Cards:** `--card` bg, 1px `--border`, radius 12–14px; hover = lift + border `--primary`.
- **Section header pattern:** mono eyebrow (`--primary`) → display h2 → a flex `--border` hairline rule filling the remaining width. Left-aligned, used on every section.
- **Section rhythm:** alternate backgrounds `--bg` / `--band` down the page (see section list).
- **Status / availability dot:** `--primary` with a soft glow ring.

### 4.4 Motion & accessibility (quality floor)

- Fade-up on hero load; subtle hover lifts on cards; **respect `prefers-reduced-motion`** (the mock already gates animation).
- Visible `:focus-visible` outlines (`--primary`).
- Fully responsive; the **mobile nav is a hamburger** that opens a full-width dropdown of the links + Résumé button, swaps to an X while open, closes on link tap, and toggles `aria-expanded`. (See the mock's nav JS — replicate this behavior in React.)

---

## 5. Public site — section by section

Order (single scroll): **Nav → Hero → About → Projects → Experience → Education → Certifications → Skills → GitHub activity → Testimonials → Blog → Contact → Footer.** Match the mock for each. "Source" = where the content comes from.

| Section | Layout (from mock) | Source |
|---|---|---|
| **Nav** | Brand `ashiqur.dev`, links (About, Projects, Experience, Skills, Blog, Contact) + Résumé button; sticky, blur bg; mobile hamburger | Static |
| **Hero** | Split: left = availability pill, **name as h1**, role subtitle, one-line value prop, `Get in touch` + `Resume` CTAs, social icons; right = portrait in an emerald orbit ring with `</>` brackets | Static + **real photo asset** |
| **About** | Eyebrow + "From statistics to shipping software" + body, then **3 service cards** (Website Development / App Development / APIs & Backends), then **3 stat cards in a row** (15+ projects shipped / 3+ production systems / 100% remote-ready) | Static |
| **Projects** | **Featured project spotlight** (image + details) above a **filterable card grid** with All / Web / Mobile / API filter pills | **DB (admin-managed)** |
| **Experience** | Vertical timeline (date, role · company, summary, tech tags) | Static (content config) |
| **Education** | Card: degree, university · years, note tying statistics → software | Static — **fill real university/years** |
| **Certifications** | Grid of credential cards (title, issuer · year) | Static — **fill real certs** |
| **Skills** | **Grouped** into Frontend / Backend / Database / Tools, each a card listing techs with logos (not a flat wall) | Static config |
| **GitHub activity** | 4 stat tiles (contributions / stars / streak / repos) + full contribution graph card + language bar with legend | **GitHub API** (fallback to static) |
| **Testimonials** | 2 quote cards (quote, avatar initials, name · role) | Static — **fill real** |
| **Blog** | Grid of latest post cards (date, tag pill, title, excerpt, Read more) | **DB (published posts)** |
| **Contact** | Left = heading + intro + details (email, location Dhaka BD, availability); right = form (name, email, message) | Form → **Resend**; details static |
| **Footer** | Brand, tagline, social icons | Static |

**Content strategy:** Only **Projects** and **Blog** are database-backed and managed in the admin. Everything else (hero, about, experience, education, certifications, skills, testimonials, contact details, socials) is **static content in a typed `content/site.ts`** module — easy to edit in code, no CMS needed. **GitHub activity** pulls from the GitHub GraphQL API (contributions calendar, stars, repos) server-side with `revalidate` caching; ship a static fallback so the section renders if the API/token is missing.

---

## 6. Admin panel (`/admin`)

Private, single-user. Gated in `middleware.ts` against one allowlisted email.

- **Auth:** Supabase Auth via `@supabase/ssr` (email/password or magic link). Login page at `/admin/login`. Redirect unauthenticated users away from `/admin/*`.
- **Dashboard:** counts (posts, projects, open applications) + quick links.
- **Blog manager:** list / create / edit / delete posts.
  - Editor: **BlockNote**, rendered in a `'use client'` component, **dynamically imported with `{ ssr: false }`** (it only runs in the admin).
  - Store **both** `content_json` (BlockNote blocks — source of truth) and `content_html`. Generate `content_html` **server-side** with `@blocknote/server-util` (`ServerBlockNoteEditor.create().blocksToFullHTML(blocks)`) in the **Node.js runtime** (not edge), at save time.
  - Enable **code-block syntax highlighting** via `@blocknote/code-block`.
  - Fields: title, slug (auto from title, editable), excerpt, tags, cover image (Storage), `status` draft/published. The **public blog renders `content_html`** and never loads the editor.
- **Project manager:** CRUD over `projects`. Fields per the data model; cover image upload to Storage; `featured`, `published`, `sort_order`, `categories` (drive the public filter).
- **Job tracker (PRIVATE):** CRUD over `job_applications` in the `private` schema, **via server actions using the service-role client only**.
  - Pipeline / kanban grouped by `status` (applied → screening → interview → offer → rejected → ghosted).
  - Follow-up reminders from `next_follow_up`; a small funnel summary (response rate, interview rate).
  - **Never** queried from the client or exposed on any public route.

---

## 7. Data model (Supabase)

### 7.1 Public schema

```sql
create extension if not exists pgcrypto;

create table public.projects(
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text,
  description text,
  tech_stack text[] default '{}',
  categories text[] default '{}',          -- 'web' | 'mobile' | 'api' (drives the filter)
  cover_image_url text,
  live_url text,
  repo_url text,
  featured boolean default false,
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.posts(
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content_json jsonb not null default '[]',  -- BlockNote blocks (source of truth)
  content_html text not null default '',     -- rendered at save time
  cover_image_url text,
  tags text[] default '{}',
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 7.2 RLS (public schema)

```sql
-- admin check (replace with the real admin email)
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select auth.jwt() ->> 'email' = 'REPLACE_WITH_ADMIN_EMAIL'
$$;

alter table public.projects enable row level security;
create policy "public reads published projects" on public.projects
  for select using (published = true);
create policy "admin full access projects" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

alter table public.posts enable row level security;
create policy "public reads published posts" on public.posts
  for select using (status = 'published');
create policy "admin full access posts" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());
```

### 7.3 Private schema (job tracker — NOT exposed)

```sql
create schema if not exists private;

create table private.job_applications(
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  application_date date,
  status text not null default 'applied'
    check (status in ('applied','screening','interview','offer','rejected','ghosted')),
  source text,                 -- 'linkedin' | 'referral' | 'cold' | 'other'
  job_url text,
  salary_min int,
  salary_max int,
  contact_name text,
  contact_email text,
  next_follow_up date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- lock it down: no API roles get access; only the service role (which bypasses RLS) touches it
revoke all on schema private from anon, authenticated;
revoke all on all tables in schema private from anon, authenticated;
```

> **Also:** do NOT add `private` to Supabase's "Exposed schemas" (Project Settings → API). Keep only `public` exposed. Verify by hitting the REST API with the anon key — `job_applications` must be unreachable.

### 7.4 Storage

One bucket (e.g. `media`) for project and blog cover images: **public read, admin-only write**. Add it to `next.config` `images.remotePatterns` and serve via `next/image`.

---

## 8. Routing & folder structure

```
app/
  (public)/
    page.tsx                  # the single-page portfolio (composes the sections)
    blog/[slug]/page.tsx      # renders post.content_html (SSR, no editor)
    sitemap.ts  robots.ts  opengraph-image.tsx
  (admin)/
    admin/
      login/page.tsx
      page.tsx                # dashboard
      posts/(list|new|[id]/edit)
      projects/(list|new|[id]/edit)
      jobs/(list|[id]/edit)   # private, server-action backed
  api/                        # or server actions for mutations + contact (Resend)
components/
  sections/                   # Hero, About, Projects, Experience, ... (match the mock)
  editor/BlockNoteEditor.tsx  # 'use client', dynamic import ssr:false
  ui/                         # shadcn components
content/site.ts               # typed static content (hero, about, experience, education, certs, skills, testimonials, socials)
lib/
  supabase/client.ts          # browser (anon)
  supabase/server.ts          # server (RLS) + a service-role client (server-only)
  validations/                # Zod schemas
  github.ts                   # GitHub stats fetch + fallback
middleware.ts                 # gate /admin
app/globals.css               # the color tokens (single source)
```

---

## 9. Build order

1. **Phase 1 — Public MVP → deploy.** Tokens + fonts + layout primitives; build all sections from `content/site.ts`; Projects + Blog read from Supabase (seed a few rows); GitHub section (API or fallback); contact form → Resend (+ honeypot); SEO (metadata, OG image, sitemap, robots); Vercel + custom domain. **Match the mock.**
2. **Phase 2 — Admin auth + Project manager.** `@supabase/ssr`, middleware gate, single admin email; project CRUD + Storage uploads; replace seed data.
3. **Phase 3 — Blog.** BlockNote editor, posts CRUD, draft/publish, server-side `content_html`, code highlighting, slugs, cover images.
4. **Phase 4 — Job tracker.** `private` schema + service-role server actions; pipeline view, reminders, funnel summary.
5. **Phase 5 — Tests.** Vitest + RTL for key utilities/components; one Playwright e2e (admin logs in → creates → publishes a post → it appears on the public blog).

---

## 10. Hard rules (do not violate)

1. **Colors only via tokens** in `app/globals.css`. No raw hex, `rgb()/hsl()`, or Tailwind palette colors in components.
2. **Job tracker** lives in the `private` schema, is accessed **only** via service-role server actions, and is **never exposed** to the client or any public route.
3. **RLS enabled** on `posts` and `projects`; public can read published only. Test with the anon key.
4. **BlockNote:** store `content_json` + `content_html`; render `content_html` publicly; the editor is client-only (`ssr:false`) and Node-runtime for HTML generation.
5. **No CI/GitHub Actions, no Docker, no Redis.**
6. The service-role key is **server-only**.
7. Match the mock visually; keep one consistent left-aligned design language.

---

## 11. Placeholders to replace with real data

- Hero **portrait photo** and **project screenshots** (currently gradient placeholders).
- **GitHub username + a read token** for the activity section (store the token server-side as an env var).
- **University name + years** (Education) and **real certifications** (Certifications) — both are `TODO`-marked in the mock.
- **Real testimonials** (currently placeholder quotes).
- **Social links, contact email, Resend sending domain, resume PDF.**
- The **admin email** in `is_admin()` and the middleware allowlist.

---

*Visual reference: `portfolio-neo-tech-mint-final.html`. When a layout/spacing/color question arises, that file is the answer.*
