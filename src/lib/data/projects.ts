/**
 * Seed project data (Phase 1). Replaced by Supabase-backed content in Phase 2.
 *
 * EDIT or add entries here — each one becomes a card on /projects and a
 * full case study at /projects/[slug].
 */
export type Project = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  approach: string;
  outcome: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  sortOrder: number;
  year: number;
};

export const projects: Project[] = [
  {
    slug: "taskflow",
    title: "TaskFlow — team task manager",
    summary:
      "A real-time task board for small teams, with drag-and-drop and instant sync.",
    problem:
      "Small teams were juggling tasks across spreadsheets and chat threads, with no shared source of truth and a lot of duplicated work.",
    approach:
      "I built a real-time Kanban board with optimistic UI and websocket sync, plus role-based access and email notifications — all tuned for a fast, keyboard-friendly experience.",
    outcome:
      "Teams cut their status-update meetings roughly in half and reported a much clearer picture of who was working on what.",
    techStack: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Tailwind CSS",
      "WebSockets",
    ],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/your-username/taskflow",
    featured: true,
    sortOrder: 1,
    year: 2025,
  },
  {
    slug: "ledgerlite",
    title: "LedgerLite — invoicing for freelancers",
    summary:
      "A minimal invoicing app that turns tracked hours into polished, sendable invoices.",
    problem:
      "Freelancers were spending hours each month formatting invoices by hand and chasing payments without a clear overview of what was outstanding.",
    approach:
      "I designed a streamlined flow from time entry to PDF invoice, with reusable client profiles, tax handling, and a simple payment-status pipeline.",
    outcome:
      "Invoice creation dropped from ~30 minutes to under 2, with an at-a-glance view of every outstanding payment.",
    techStack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Resend"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/your-username/ledgerlite",
    featured: true,
    sortOrder: 2,
    year: 2024,
  },
  {
    slug: "wanderlog",
    title: "WanderLog — travel journal",
    summary:
      "A map-first travel journal for logging trips, photos, and notes by location.",
    problem:
      "Travel memories were scattered across camera rolls and notes apps, with no easy way to revisit a whole trip in one place.",
    approach:
      "I built a map-centric interface where each pin opens a rich entry, plus offline-friendly drafts and fast image uploads with automatic optimization.",
    outcome:
      "A genuinely delightful way to relive trips — and a great playground for experimenting with maps and image performance.",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Mapbox"],
    repoUrl: "https://github.com/your-username/wanderlog",
    featured: false,
    sortOrder: 3,
    year: 2024,
  },
];

export function getProjects(): Project[] {
  return [...projects].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
