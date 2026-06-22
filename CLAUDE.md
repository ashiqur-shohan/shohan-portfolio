# CLAUDE.md

Guidance for any AI or developer working in this repository. Read this, `PRD.md`, and `design.md` before writing code, and follow all three strictly. **`design.md`** and the static mock **`portfolio-neo-tech-mint.html`** are the visual source of truth for the public site — reproduce their layout, spacing, palette, and typography faithfully.

## Project

Personal portfolio + private admin panel for **Ashiqur Rahman Shohan**. Two surfaces:

- **Public** — a marketing site for freelance clients and employers: home, about, projects, blog, contact.
- **Admin** (`/admin`, private) — CRUD for blog posts and projects, plus a private job-application tracker that replaces a manual Excel sheet.

**Ship the public site first.** The admin is secondary; nobody hiring cares that a CMS exists. See `PRD.md` for full requirements and the build order.

## Stack

- Next.js (App Router) + TypeScript
- Supabase: Postgres, Auth (`@supabase/ssr`), Storage
- Tailwind CSS + shadcn/ui (lucide-react icons)
- Fonts via `next/font`: **Space Grotesk** (display/headings), **Inter** (body/UI), **JetBrains Mono** (mono — eyebrows, labels, code)
- React Hook Form + Zod (forms + validation)
- BlockNote (blog editor): `@blocknote/react`, `@blocknote/mantine`, `@blocknote/code-block`, `@blocknote/server-util`
- Resend (contact-form email)
- Vitest + React Testing Library + Playwright (tests)
- Deployed on Vercel

## Project structure

Standard Next.js App Router layout. Guiding principle: **the backend lives behind a seam.** Today that backend is Supabase; the rest of the app must not know or care. Put new code in the right layer so a future custom backend is a one-layer rewrite, not a hunt through pages and components.

```
src/
├── app/                      # App Router — routing, layouts, pages ONLY
│   ├── (public)/             # public group: home, about, projects, projects/[slug], blog, contact
│   ├── (admin)/              # admin group: admin/login + admin/(protected) CRUD
│   ├── layout.tsx · globals.css · robots.ts · sitemap.ts · opengraph-image.tsx
│   └── error.tsx/loading.tsx/not-found.tsx   # route boundaries — colocate per segment, add as needed
├── components/
│   ├── ui/                   # shadcn/ui primitives (generated; leave mostly alone)
│   ├── sections/             # composed page sections (hero, skills, featured-projects…)
│   ├── admin/                # admin-only feature components
│   └── *.tsx                 # shared app components (site-header, project-card, icons…)
├── lib/
│   ├── data/                 # ★ DATA-ACCESS SEAM — the ONLY place Supabase is imported for data
│   │   ├── projects.ts       #   per-entity module: read + write functions over the backend
│   │   ├── storage.ts        #   file uploads (Supabase Storage today)
│   │   ├── posts.ts          #   (add with the blog)
│   │   ├── job-applications.ts#   (add with the tracker; secret key only)
│   │   └── types.ts          #   domain types (Project, ProjectWrite…) — import these, NOT supabase/*
│   ├── actions/              # 'use server' mutations — auth + zod + revalidate; call lib/data
│   ├── validations/          # Zod schemas (one per entity); validated server-side in actions
│   ├── supabase/             # Supabase client factories (the adapter; used ONLY by lib/data + auth.ts)
│   ├── auth.ts               # auth seam — wraps Supabase Auth (getAdminUser, requireAdmin, signIn…)
│   ├── site-config.ts        # static site config (nav, socials, identity, skills)
│   └── utils.ts              # pure, dependency-free helpers (cn, formatters…)
├── hooks/                    # custom React hooks (add only when one is actually reused)
└── proxy.ts                  # Next 16 middleware — gates /admin (edge auth; uses Supabase directly)
```

**Layering — who may import what (top depends on bottom; never the reverse):**

```
components   →  render only — never fetch data
pages (RSC)  →  lib/data  (reads)        +  lib/actions (mutations)
lib/actions  →  lib/data + lib/validations + lib/auth
lib/data     →  lib/supabase     ← the ONLY data layer that imports @/lib/supabase/*
lib/auth     →  lib/supabase     (auth adapter — allowed exception)
proxy.ts     →  @supabase/ssr    (edge middleware — allowed exception)
```

**Backend-swap principle.** The app depends on the backend-agnostic functions `lib/data` exports, not on Supabase. Swapping to a custom API later = rewrite `lib/data/*` (and the `supabase/` factories + `auth.ts`) only; every page, component, action, and validation stays unchanged.

**Where things go:**

| Thing | Location |
| --- | --- |
| Data reads/writes (DB/storage calls) | `lib/data/<entity>.ts`, `lib/data/storage.ts` |
| Domain types (`Project`, `Post`…) | `lib/data/types.ts` |
| Zod schemas | `lib/validations/` |
| Mutations / server actions | `lib/actions/` |
| Static config (nav, socials) | `lib/site-config.ts` |
| Pure helpers | `lib/utils.ts` |
| Custom hooks | `src/hooks/` (add only when reused) |
| shadcn primitives | `components/ui/` |
| Page sections | `components/sections/` |
| Feature components | `components/<feature>/` (e.g. `admin/`); shared ones at `components/` root |

**App Router conventions going forward:** Server Components by default (`'use client'` only where interactivity requires it); keep the `(public)`/`(admin)` route groups; colocate `loading.tsx`/`error.tsx`/`not-found.tsx` in the segment they cover; `app/` is for routing/layout/pages only — never define data-fetching helpers inline in a page, move them to `lib/data`.

## Commands

- `pnpm dev` — local dev
- `pnpm build` — production build
- `pnpm lint` — ESLint
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm test` — Vitest unit/component tests
- `pnpm test:e2e` — Playwright end-to-end tests

## Hard rules

### 1. Colors — never hardcode

- Every color is a semantic CSS variable defined **once** in `src/app/globals.css`. v1 is **dark-only**: a single `:root` theme, with `.dark` pinned on `<html>` so shadcn `dark:` variants resolve. Tokens are structured so a light theme could be added later, but none exists now. **That file is the single source of truth for the entire palette.**
- Use only semantic Tailwind utilities that map to those tokens: `bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `text-primary-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-accent`, `text-destructive`, etc.
- **NEVER** write a raw hex, an `rgb()`/`hsl()` literal, or a Tailwind palette color (`bg-emerald-500`, `text-slate-500`) inside a component. If a color you need doesn't exist as a token, **add a token** — do not inline a value.
- Re-theming the whole app must be possible by editing variable values in `src/app/globals.css` and nothing else.
- The token list and values are in `design.md` (§4).

### 2. Security — the job tracker holds real personal data

- The `job_applications` table lives in a separate **`private`** Postgres schema. That schema is added to Supabase's **Exposed Schemas** but granted to the **`service_role`** Postgres role — which only the **secret key** can act as — **ONLY**; `anon` and `authenticated` get no privileges and are denied. It is read/written **only from admin-gated server actions using the secret key**, which never reaches the client/browser.
- Public tables (`posts`, `projects`) have **RLS enabled**: anonymous users may `SELECT` only published rows; the admin user (matched by email) has full CRUD.
- Never expose the secret key client-side. Never rely on UI hiding for access control — enforce at the database/API layer.

### 3. Blog (BlockNote)

- The editor is **client-only**: render inside a `'use client'` component, dynamically imported with `{ ssr: false }`. It exists only in the admin.
- Store **both** `content_json` (BlockNote blocks — the source of truth) and `content_html` (rendered at save time).
- Render `content_html` with `ServerBlockNoteEditor.blocksToFullHTML()` on the server in the **Node.js runtime** (not edge). The public post page renders the HTML and **never loads the editor**.
- Enable code-block syntax highlighting via `@blocknote/code-block`.

### 4. Data access — isolate the backend

- **Supabase is imported in exactly three places: `src/lib/data/` (the data seam), `src/lib/auth.ts` (auth adapter), and `src/proxy.ts` (edge middleware).** Nowhere else.
- **Pages, components, and `lib/actions` must NOT import `@/lib/supabase/*`** — not the client factories, not `supabase/types`. Server Component pages read by calling `lib/data/<entity>`; mutations call `lib/actions`, which call `lib/data`. Import domain types from `@/lib/data/types`.
- **Components never fetch data.** A Server Component fetches via `lib/data` and passes props down; client components mutate via server actions only.
- The app depends on the **backend-agnostic** functions `lib/data` exports. Today the implementation is Supabase; swapping to a custom backend later must be a rewrite of `lib/data/*` (+ the `supabase/` factories and `auth.ts`) only — callers unchanged. If you reach for `@/lib/supabase` outside those three places, stop and add/extend a `lib/data` function instead.

## Conventions

- App Router route groups: `(public)` and `(admin)`.
- Server Components + Server Actions by default; use client components only where interactivity requires it.
- Zod schemas live in `src/lib/validations/`; validate on the server inside actions.
- Data access goes through `src/lib/data/` (see Hard rule 4 and Project structure). The Supabase clients in `src/lib/supabase/` (`client.ts` browser/anon, `server.ts` server + secret key) are used **only** by `lib/data` and `lib/auth.ts`.
- `/admin` is gated in `src/proxy.ts` (Next 16's renamed middleware) with a single allowlisted admin email.
- Build UI from shadcn/ui components wherever possible.
- Responsive (mobile-first) and dark-mode-ready from the start. Target WCAG AA contrast.

## Out of scope — do not build

- CI pipelines / GitHub Actions.
- Redis, caching layers, or rate-limiting infrastructure. (Contact-form spam protection = a honeypot field only.)
- Docker.
- Multi-user / multi-author support, public accounts, or comments.
