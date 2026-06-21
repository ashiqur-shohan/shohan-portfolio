import type { ComponentType } from "react";
import { Code2, Database, Webhook } from "lucide-react";
import {
  SiDigitalocean,
  SiDjango,
  SiGit,
  SiGithub,
  SiJavascript,
  SiLaravel,
  SiLinux,
  SiMysql,
  SiNextdotjs,
  SiPhp,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiRedux,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";

import { cn } from "@/lib/utils";

type IconComponent = ComponentType<{ className?: string }>;

/**
 * Skill name (from `site-config`) → glyph. Brand marks come from Simple Icons
 * (react-icons/si); generic concepts fall back to lucide. Every glyph renders
 * with `currentColor`, so it inherits the surrounding text token rather than a
 * brand color (CLAUDE.md hard rule #1). Unmapped names get a neutral fallback.
 */
const SKILL_ICONS: Record<string, IconComponent> = {
  PHP: SiPhp,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Python: SiPython,
  SQL: Database,
  Laravel: SiLaravel,
  Django: SiDjango,
  "Django REST Framework": SiDjango,
  "REST APIs": Webhook,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Tailwind CSS": SiTailwindcss,
  "Redux / Context API": SiRedux,
  MySQL: SiMysql,
  PostgreSQL: SiPostgresql,
  Supabase: SiSupabase,
  Git: SiGit,
  GitHub: SiGithub,
  Linux: SiLinux,
  Postman: SiPostman,
  DigitalOcean: SiDigitalocean,
  Vercel: SiVercel,
};

export function SkillIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = SKILL_ICONS[name] ?? Code2;
  return <Icon className={cn("shrink-0", className)} />;
}
