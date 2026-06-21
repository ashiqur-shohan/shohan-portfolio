import { Mail } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

const socialLinks = [
  { href: siteConfig.socials.github, label: "GitHub", icon: GitHubIcon },
  { href: siteConfig.socials.linkedin, label: "LinkedIn", icon: LinkedInIcon },
  { href: `mailto:${siteConfig.email}`, label: "Email", icon: Mail },
];

export function SiteFooter() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <nav className="flex items-center gap-1" aria-label="Social">
          {socialLinks.map(({ href, label, icon: Icon }) => {
            const external = href.startsWith("http");
            return (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors"
              >
                <Icon className="size-5" />
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
