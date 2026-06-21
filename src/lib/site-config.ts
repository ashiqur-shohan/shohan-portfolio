/**
 * Central site configuration — EDIT THIS FILE to personalize the site.
 *
 * Identity, navigation, socials, contact email, resume path, and the
 * About / Skills copy all live here, so content changes never touch components.
 * (Project case studies are managed in the admin and stored in Supabase.)
 */
export const siteConfig = {
  name: "Ashiqur Rahman Shohan",
  role: "Full-Stack Software Engineer",
  // One-line value proposition, shown large in the hero.
  tagline:
    "I build and ship production web apps with Laravel, Django, and React.",
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

  nav: [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Projects", href: "/projects" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
  ],

  about: {
    headline: "Full-stack engineer who ships real products.",
    paragraphs: [
      "I'm Ashiqur — a full-stack software engineer based in Dhaka, Bangladesh. I build and maintain production web applications across Laravel, Django REST Framework, and React, and I'm comfortable moving between PHP, Python, JavaScript, and SQL.",
      "I've shipped products that serve real users: Estate-Link, a multi-platform real-estate management system live on the web, Google Play, and the App Store; and Salon-ERP, a salon ERP in daily use with mobile-money and bank financial reporting.",
      "I like owning a feature end to end — from API and data model to a clean, accessible UI — and I'm currently sharpening up on Next.js, testing, and DevOps. I'm open to freelance projects and full-time roles.",
    ],
  },

  skills: [
    {
      group: "Languages",
      items: ["PHP", "JavaScript", "TypeScript", "Python", "SQL"],
    },
    {
      group: "Backend",
      items: ["Laravel", "Django", "Django REST Framework", "REST APIs"],
    },
    {
      group: "Frontend",
      items: ["React", "Next.js", "Tailwind CSS", "Redux / Context API"],
    },
    {
      group: "Databases",
      items: ["MySQL", "PostgreSQL", "Supabase"],
    },
    {
      group: "Tools & Deploy",
      items: ["Git", "GitHub", "Linux", "Postman", "DigitalOcean", "Vercel"],
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
