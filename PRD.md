# Product Requirements Document — Personal Portfolio & Admin Panel

**Owner:** Ashiqur Rahman Shohan
**Status:** Planning → Build
**Last updated:** June 2026

---

## 1. Summary

A personal portfolio website with two surfaces: a **public** marketing site used for freelance outreach and job applications, and a **private admin panel** for managing content and tracking job applications (replacing a manual Excel sheet).

## 2. Goals

- Present a polished, fast, professional public presence that converts visitors into freelance leads and interview callbacks.
- Let the owner manage blog posts and projects without code changes.
- Replace spreadsheet-based job-application tracking with a private, structured tool.
- Serve as a learning/showcase project for Next.js, TypeScript, and testing.

## 3. Non-goals

- Multi-user / multi-author support (single admin only).
- Public accounts, comments, or social features.
- CI/CD pipelines, Docker, Redis, or rate-limiting infrastructure.

## 4. Users

- **Visitor** (unauthenticated): recruiters, hiring managers, potential freelance clients. Wants to quickly understand who the owner is, see proof of work, and get in touch.
- **Admin** (the owner, authenticated): manages all content and the private job tracker.

## 5. Tech stack

Next.js (App Router) + TypeScript · Supabase (Postgres, Auth via `@supabase/ssr`, Storage) · Tailwind CSS + shadcn/ui · React Hook Form + Zod · BlockNote (`@blocknote/react`, `@blocknote/mantine`, `@blocknote/code-block`, `@blocknote/server-util`) · Resend · Vitest + React Testing Library + Playwright · Vercel.

---

## 6. Features & requirements

### 6.1 Public site

- **Home / hero** — clear value proposition (who you are, what you do), primary CTA (contact / view work), links to GitHub + LinkedIn, resume PDF download.
- **About** — background, skills, short narrative.
- **Projects** — list of featured work and a detail page per project (problem → approach → tech stack → outcome → live link + repo). Presented as case studies, not bare screenshots.
- **Blog** — list of published posts and a per-post reading page with code syntax highlighting.
- **Contact** — form (name, email, message) with a honeypot field, delivered via Resend; plus email + social links.

### 6.2 Blog (admin authored, public read)

- Admin can create, edit, delete posts using the BlockNote editor.
- Posts have **draft** and **published** states; only published posts appear publicly.
- SEO-friendly slugs; per-post Open Graph image.
- Content stored as `content_json` (source of truth) plus `content_html` rendered at save time and served on the public page.

### 6.3 Projects (admin managed, public read)

- Admin CRUD for projects, with image upload via Supabase Storage.
- Fields include title, summary, description, tech stack, links, featured flag, sort order, published flag.

### 6.4 Job tracker (admin only, private)

- Admin CRUD for job applications, replacing the Excel workflow.
- Status pipeline: applied → screening → interview → offer → rejected → ghosted (kanban / pipeline view).
- Follow-up reminders via `next_follow_up` date.
- A small funnel summary (response rate, interview rate).
- **Data is never exposed to the public API** (see Security).

### 6.5 Auth

- Supabase Auth (`@supabase/ssr`), email/password or magic link.
- Single allowlisted admin email; `/admin` gated in middleware.

---

## 7. Design requirements

### Color system (single source of truth, no hardcoded colors)

All colors are semantic CSS variables defined **once** in `app/globals.css` (`:root` + `.dark`), wired into Tailwind. Components reference semantic tokens only (`bg-primary`, `text-muted-foreground`, …) — never raw hex or palette colors. Re-theming = editing values in that one file.

**Palette — "Indigo & Amber" (warm-neutral base):**

| Token | Light | Dark | Use |
|---|---|---|---|
| `background` | `#FAFAF9` | `#0C0A09` | Page background |
| `foreground` | `#1C1917` | `#FAFAF9` | Primary text |
| `card` | `#FFFFFF` | `#1C1917` | Surfaces / cards |
| `card-foreground` | `#1C1917` | `#FAFAF9` | Text on cards |
| `muted` | `#F5F5F4` | `#292524` | Subtle fills |
| `muted-foreground` | `#78716C` | `#A8A29E` | Secondary text |
| `border` | `#E7E5E4` | `#292524` | Borders / inputs |
| `primary` | `#4F46E5` | `#818CF8` | CTAs, links, active state |
| `primary-foreground` | `#FFFFFF` | `#1C1917` | Text on primary |
| `accent` | `#F59E0B` | `#FBBF24` | Highlights (sparing) |
| `accent-foreground` | `#1C1917` | `#1C1917` | Text on accent |
| `ring` | `#4F46E5` | `#818CF8` | Focus rings |
| `success` | `#16A34A` | `#4ADE80` | Success / offer |
| `info` | `#0284C7` | `#38BDF8` | Info / screening |
| `warning` | `#D97706` | `#FBBF24` | Warning |
| `destructive` | `#DC2626` | `#F87171` | Errors / rejected |

**Job-tracker status → token:** applied = `muted-foreground` · screening = `info` · interview = `accent` · offer = `success` · rejected = `destructive` · ghosted = `muted-foreground`.

### Other design requirements

- Light + dark mode, both fully supported.
- Fully responsive, mobile-first (recruiters often open links on phones).
- Accessible: semantic HTML, alt text, keyboard navigation, WCAG AA contrast.
- Consistent shadcn/ui component usage; clean, modern, uncluttered.

---

## 8. Non-functional requirements

- **Performance:** SSR/SSG for public pages, optimized images via `next/image`, strong Lighthouse scores (target 90+).
- **SEO:** Next Metadata API, per-post OG images, `sitemap.ts`, `robots.ts`.
- **Security:** job-tracker schema isolation, RLS on public tables, secret key never client-side.
- **Analytics:** Vercel Web Analytics + Speed Insights.

---

## 9. Data model

**`projects`** — `id`, `title`, `slug`, `summary`, `description`, `tech_stack` (text[]), `cover_image_url`, `live_url`, `repo_url`, `featured` (bool), `sort_order` (int), `published` (bool), `created_at`, `updated_at`.

**`posts`** — `id`, `title`, `slug`, `excerpt`, `content_json` (jsonb), `content_html` (text), `cover_image_url`, `tags` (text[]), `status` (`draft`|`published`), `published_at`, `created_at`, `updated_at`.

**`job_applications`** (private, non-exposed schema) — `id`, `company`, `role`, `application_date`, `status`, `source`, `job_url`, `salary_min`, `salary_max`, `contact_name`, `contact_email`, `next_follow_up`, `notes`, `created_at`, `updated_at`.

---

## 10. Milestones (build order)

1. **Phase 1 — Public MVP → launch.** Home, about, projects (seed data), contact (Resend), SEO, analytics, custom domain. Update the resume first. Get this live before building any admin.
2. **Phase 2 — Admin auth + projects CRUD.** Replace seed data; image upload via Storage.
3. **Phase 3 — Blog.** BlockNote editor, posts CRUD, draft/publish, server HTML render, code highlighting, OG images.
4. **Phase 4 — Job tracker.** Private schema, server actions, pipeline view, reminders, funnel summary.
5. **Phase 5 — Tests.** Vitest + RTL for key utilities/components; one Playwright e2e (admin logs in → creates → publishes a post → it appears publicly).

---

## 11. Success criteria

- Public site live on a custom domain, Lighthouse 90+, mobile-friendly, light/dark.
- Owner can publish a blog post and add a project entirely from the admin, no code changes.
- Job tracker fully replaces the Excel sheet, with its data confirmed unreachable from the public API.
