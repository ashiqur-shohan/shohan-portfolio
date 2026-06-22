/**
 * Central site configuration — EDIT THIS FILE to personalize the site.
 *
 * Identity, navigation, socials, and all static section copy (hero, about,
 * experience, education, certifications, skills, GitHub activity, testimonials,
 * contact) live here, so content changes never touch components. The mock
 * portfolio-neo-tech-mint.html is the visual source of truth; this is its data.
 * (Project case studies and blog posts are managed in the admin / Supabase.)
 */
export const siteConfig = {
  name: "Ashiqur Rahman Shohan",
  /** Wordmark for the nav + footer (the part after the dot renders in mint). */
  brand: "ashiqur.dev",
  role: "Full-stack Software Engineer",
  // One-line value proposition, reused as the OG image headline + meta fallback.
  tagline:
    "I build and ship production web & mobile apps — from real-estate platforms to ERP systems with daily financial reporting.",
  // Supporting line, reused as the default meta description.
  description:
    "Full-stack software engineer shipping production web applications — from a multi-platform real-estate system on web and mobile to a salon ERP with daily financial reporting.",
  location: "Dhaka, Bangladesh",

  email: "ashiqur.shohan@gmail.com",
  resumeUrl: "/resume.pdf",
  socials: {
    github: "https://github.com/ashiqur-shohan",
    linkedin: "https://www.linkedin.com/in/ashiqur-shohan",
  },

  // Public base URL — used for metadata, sitemap, and OG images.
  // Set NEXT_PUBLIC_SITE_URL in production.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // Single-scroll in-page anchors (root-relative so they work from any route).
  nav: [
    { title: "About", href: "/#about" },
    { title: "Projects", href: "/#work" },
    { title: "Experience", href: "/#experience" },
    { title: "Skills", href: "/#skills" },
    { title: "Blog", href: "/#blog" },
    { title: "Contact", href: "/#contact" },
  ],

  hero: {
    availability: "Available for freelance & full-time",
    lede: "I build and ship production web & mobile apps — from real-estate platforms to ERP systems with daily financial reporting.",
  },

  about: {
    eyebrow: "About me",
    title: "From statistics to shipping software",
    body: "I started in statistics and taught myself to build. Since then I've shipped real products across web and mobile, and I care about clean architecture, reliable delivery, and tools people actually use.",
    services: [
      {
        title: "Website Development",
        blurb: "Production web apps with Laravel, Django & React.",
      },
      {
        title: "App Development",
        blurb: "Cross-platform mobile builds with React Native.",
      },
      {
        title: "APIs & Backends",
        blurb: "Clean, documented REST APIs and data models.",
      },
    ],
    // The suffix (+ / %) renders in the mint accent (mock `.stat .n i`).
    stats: [
      { num: "15", suffix: "+", label: "projects shipped" },
      { num: "3", suffix: "+", label: "production systems" },
      { num: "100", suffix: "%", label: "remote-ready" },
    ],
  },

  // TODO: replace with real roles / company names.
  experience: [
    {
      when: "2026 — now",
      role: "Junior Software Engineer",
      company: "Company",
      summary:
        "Building and shipping full-stack features across web and mobile, from API design to UI.",
      tech: ["Laravel", "React"],
    },
    {
      when: "2025",
      role: "Software Engineer Intern",
      company: "Company",
      summary:
        "Contributed to production applications and internal tooling alongside the engineering team.",
      tech: ["Django", "React"],
    },
  ],

  // TODO: replace university name and years with real details.
  education: {
    degree: "B.Sc. in Statistics",
    school: "University name",
    years: "2020 — 2024",
    note: "A foundation in statistics, probability, and data analysis — where my analytical thinking and love of solving problems with logic and data began, and what set up my move into software.",
  },

  // TODO: replace with real certificates / awards.
  certifications: [
    { title: "Meta Back-End Developer", issuer: "Coursera", year: "2025" },
    {
      title: "JavaScript Algorithms & Data Structures",
      issuer: "freeCodeCamp",
      year: "2024",
    },
    { title: "Responsive Web Design", issuer: "freeCodeCamp", year: "2023" },
  ],

  // Grouped exactly as the mock: Frontend / Backend / Database / Tools.
  skills: [
    {
      group: "Frontend",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Redux",
        "Tailwind CSS",
        "HTML5",
        "CSS3",
      ],
    },
    {
      group: "Backend",
      items: ["PHP", "Laravel", "Python", "Django"],
    },
    {
      group: "Database",
      items: ["MySQL", "PostgreSQL", "Supabase"],
    },
    {
      group: "Tools",
      items: ["Git", "GitHub", "React Native", "Docker", "Jest"],
    },
  ],

  // GitHub activity — static placeholder matching the mock (live API later).
  // language `token` ∈ primary | secondary | muted-foreground | data-neutral.
  github: {
    username: "ashiqur-shohan",
    stats: [
      { num: "1,240", label: "contributions" },
      { num: "64", label: "stars earned" },
      { num: "18d", label: "current streak" },
      { num: "28", label: "repositories" },
    ],
    languages: [
      { name: "TypeScript", pct: 36, token: "primary" },
      { name: "PHP", pct: 27, token: "secondary" },
      { name: "Python", pct: 21, token: "muted-foreground" },
      { name: "JavaScript", pct: 16, token: "data-neutral" },
    ],
  },

  // TODO: replace with real testimonials.
  testimonials: [
    {
      quote:
        "Ashiqur shipped our real-estate platform end to end and was a pleasure to work with — reliable and detail-oriented.",
      name: "Maya R.",
      role: "Product Lead",
      initials: "MR",
    },
    {
      quote:
        "Took our messy requirements and turned them into a clean, working ERP. Communicates clearly and delivers.",
      name: "Tanvir K.",
      role: "Founder",
      initials: "TK",
    },
  ],

  contact: {
    heading: "Have a project?",
    headingAccent: "Let's talk!",
    intro:
      "Open to freelance work and full-time roles. Reach out and I'll get back to you within a day.",
    availability: "Open now · GMT+6",
  },
} as const;

export type SiteConfig = typeof siteConfig;
