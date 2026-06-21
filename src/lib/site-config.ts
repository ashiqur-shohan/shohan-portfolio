/**
 * Central site configuration — EDIT THIS FILE to personalize the site.
 *
 * Identity, navigation, socials, contact email, resume path, and the
 * About / Skills copy all live here, so content changes never touch components.
 * (Project case studies live in `src/lib/data/projects.ts`.)
 */
export const siteConfig = {
  name: "Ashiqur Rahman Shohan",
  role: "Full-Stack Web Developer",
  // One-line value proposition, shown large in the hero.
  tagline: "I build fast, accessible web apps with Next.js and TypeScript.",
  // Supporting line, reused as the default meta description.
  description:
    "I'm a full-stack developer focused on shipping polished, performant products — from clean, accessible UI to reliable APIs.",
  location: "Dhaka, Bangladesh", // TODO: your location

  // TODO: replace these with your real details.
  email: "hello@example.com",
  resumeUrl: "/resume.pdf",
  socials: {
    github: "https://github.com/your-username",
    linkedin: "https://www.linkedin.com/in/your-handle",
  },

  // Public base URL — used for metadata, sitemap, and OG images.
  // Set NEXT_PUBLIC_SITE_URL in production.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  nav: [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Projects", href: "/projects" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
  ],

  about: {
    headline: "A developer who sweats the details.",
    paragraphs: [
      "I'm Ashiqur — a full-stack web developer who enjoys turning ideas into fast, accessible products. I work mostly with React, Next.js, and TypeScript on the front end, and Node.js with PostgreSQL on the back end.",
      "I care about the things people feel but rarely name: snappy load times, sensible defaults, keyboard accessibility, and interfaces that work just as well on a phone as on a laptop.",
      "Outside of client work I build side projects to learn in public and sharpen my craft. I'm currently open to freelance projects and full-time roles.",
    ],
  },

  skills: [
    {
      group: "Frontend",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "shadcn/ui",
        "React Hook Form",
      ],
    },
    {
      group: "Backend",
      items: ["Node.js", "PostgreSQL", "Supabase", "REST APIs", "Zod"],
    },
    {
      group: "Tooling",
      items: ["Git", "Vercel", "Vitest", "Playwright", "Figma"],
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
