import { Mail } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

const socialLinks = [
  { href: siteConfig.socials.github, label: "GitHub", icon: GitHubIcon },
  { href: siteConfig.socials.linkedin, label: "LinkedIn", icon: LinkedInIcon },
  { href: `mailto:${siteConfig.email}`, label: "Email", icon: Mail },
];

function Brand() {
  const i = siteConfig.brand.indexOf(".");
  const main = i === -1 ? siteConfig.brand : siteConfig.brand.slice(0, i);
  const suffix = i === -1 ? "" : siteConfig.brand.slice(i);
  return (
    <span className="font-display font-semibold">
      {main}
      <span className="text-primary">{suffix}</span>
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-border border-t py-[30px]">
      <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-3.5 px-6">
        <Brand />
        <p className="text-muted-foreground text-[13px]">
          Designed &amp; built by {siteConfig.name} · {new Date().getFullYear()}
        </p>
        <nav className="flex items-center gap-3" aria-label="Social">
          {socialLinks.map(({ href, label, icon: Icon }) => {
            const external = href.startsWith("http");
            return (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="border-border text-muted-foreground hover:text-primary hover:border-primary grid size-[38px] place-items-center rounded-full border transition-colors"
              >
                <Icon className="size-[17px]" />
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
