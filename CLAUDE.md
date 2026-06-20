# CLAUDE.md

Guidance for any AI or developer working in this repository. Read this and `PRD.md` before writing code, and follow both strictly.

## Project

Personal portfolio + private admin panel for **Ashiqur Rahman Shohan**. Two surfaces:

- **Public** — a marketing site for freelance clients and employers: home, about, projects, blog, contact.
- **Admin** (`/admin`, private) — CRUD for blog posts and projects, plus a private job-application tracker that replaces a manual Excel sheet.

**Ship the public site first.** The admin is secondary; nobody hiring cares that a CMS exists. See `PRD.md` for full requirements and the build order.

## Stack

- Next.js (App Router) + TypeScript
- Supabase: Postgres, Auth (`@supabase/ssr`), Storage
- Tailwind CSS + shadcn/ui (lucide-react icons)
- React Hook Form + Zod (forms + validation)
- BlockNote (blog editor): `@blocknote/react`, `@blocknote/mantine`, `@blocknote/code-block`, `@blocknote/server-util`
- Resend (contact-form email)
- Vitest + React Testing Library + Playwright (tests)
- Deployed on Vercel

## Commands

- `pnpm dev` — local dev
- `pnpm build` — production build
- `pnpm lint` — ESLint
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm test` — Vitest unit/component tests
- `pnpm test:e2e` — Playwright end-to-end tests

## Hard rules

### 1. Colors — never hardcode

- Every color is a semantic CSS variable defined **once** in `src/app/globals.css` (`:root` for light, `.dark` for dark). **That file is the single source of truth for the entire palette.**
- Use only semantic Tailwind utilities that map to those tokens: `bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `text-primary-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-accent`, `text-destructive`, etc.
- **NEVER** write a raw hex (`#4F46E5`), an `rgb()`/`hsl()` literal, or a Tailwind palette color (`bg-indigo-600`, `text-slate-500`) inside a component. If a color you need doesn't exist as a token, **add a token** — do not inline a value.
- Re-theming the whole app must be possible by editing variable values in `src/app/globals.css` and nothing else.
- The token list and values are in `PRD.md` (Design → Color system).

### 2. Security — the job tracker holds real personal data

- The `job_applications` table lives in a **separate Postgres schema that is NOT exposed** through the Supabase API.
- It is read/written **only from server actions using the service-role key**. The service-role key never reaches the client/browser.
- Public tables (`posts`, `projects`) have **RLS enabled**: anonymous users may `SELECT` only published rows; the admin user (matched by email) has full CRUD.
- Never expose the service-role key client-side. Never rely on UI hiding for access control — enforce at the database/API layer.

### 3. Blog (BlockNote)

- The editor is **client-only**: render inside a `'use client'` component, dynamically imported with `{ ssr: false }`. It exists only in the admin.
- Store **both** `content_json` (BlockNote blocks — the source of truth) and `content_html` (rendered at save time).
- Render `content_html` with `ServerBlockNoteEditor.blocksToFullHTML()` on the server in the **Node.js runtime** (not edge). The public post page renders the HTML and **never loads the editor**.
- Enable code-block syntax highlighting via `@blocknote/code-block`.

## Conventions

- App Router route groups: `(public)` and `(admin)`.
- Server Components + Server Actions by default; use client components only where interactivity requires it.
- Zod schemas live in `src/lib/validations/`; validate on the server inside actions.
- Supabase clients in `src/lib/supabase/`: `client.ts` (browser/anon) and `server.ts` (server + service-role).
- `/admin` is gated in `src/middleware.ts` with a single allowlisted admin email.
- Build UI from shadcn/ui components wherever possible.
- Responsive (mobile-first) and dark-mode-ready from the start. Target WCAG AA contrast.

## Out of scope — do not build

- CI pipelines / GitHub Actions.
- Redis, caching layers, or rate-limiting infrastructure. (Contact-form spam protection = a honeypot field only.)
- Docker.
- Multi-user / multi-author support, public accounts, or comments.
