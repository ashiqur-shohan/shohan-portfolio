import { Download, Mail, User } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

export function Hero() {
  return (
    <header className="pt-[66px] pb-[50px]">
      <div className="mx-auto w-full max-w-[1080px] px-6">
        <div className="grid grid-cols-1 items-center gap-[48px] md:grid-cols-[1.1fr_.9fr]">
          {/* ── Left: text ── */}
          <div className="animate-[up_0.7s_both]">
            {/* Availability pill */}
            <div className="font-mono text-[13px] text-muted-foreground mb-[14px] inline-flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px] shadow-primary/20"
                aria-hidden="true"
              />
              {siteConfig.hero.availability}
            </div>

            {/* Name */}
            <h1 className="font-display text-[clamp(38px,5.6vw,60px)] font-bold leading-[1.02] tracking-[-0.02em] text-foreground">
              {siteConfig.name}
            </h1>

            {/* Role */}
            <div
              className="font-display text-[clamp(18px,2.4vw,22px)] font-medium text-primary mt-2 animate-[up_0.7s_both]"
              style={{ animationDelay: "0.05s" }}
            >
              {siteConfig.role}
            </div>

            {/* Lede */}
            <p
              className="text-muted-foreground text-base max-w-[440px] mt-4 mb-[26px] animate-[up_0.7s_both]"
              style={{ animationDelay: "0.1s" }}
            >
              {siteConfig.hero.lede}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap items-center gap-3 animate-[up_0.7s_both]"
              style={{ animationDelay: "0.16s" }}
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Get in touch
              </a>
              <a
                href={siteConfig.resumeUrl}
                download
                className="inline-flex items-center gap-2 rounded-[10px] border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary"
              >
                <Download className="size-4" aria-hidden="true" />
                Resume
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-[14px] mt-[22px]">
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-[38px] w-[38px] place-items-center rounded-[9px] border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <GitHubIcon className="size-[18px]" />
              </a>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid h-[38px] w-[38px] place-items-center rounded-[9px] border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <LinkedInIcon className="size-[18px]" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Send email"
                className="grid h-[38px] w-[38px] place-items-center rounded-[9px] border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Mail className="size-[18px]" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* ── Right: portrait ── */}
          <div
            className="relative aspect-square grid place-items-center mx-auto w-full max-w-[320px] md:max-w-none animate-[up_0.7s_both]"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Orbit rings */}
            <div
              className="absolute inset-0 rounded-full border border-primary opacity-25"
              aria-hidden="true"
            />
            <div
              className="absolute inset-[6%] rounded-full border border-secondary opacity-40"
              aria-hidden="true"
            />

            {/* Glow */}
            <div
              className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--primary)_30%,transparent),transparent_65%)]"
              aria-hidden="true"
            />

            {/* Brackets */}
            <span
              className="absolute left-[-6px] font-mono text-[42px] text-secondary opacity-50 leading-none select-none"
              aria-hidden="true"
            >
              {"<"}
            </span>
            <span
              className="absolute right-[-6px] font-mono text-[42px] text-secondary opacity-50 leading-none select-none"
              aria-hidden="true"
            >
              {"/>"}
            </span>

            {/* Photo placeholder */}
            <div className="relative w-[74%] aspect-[4/5] rounded-[18px] border border-border overflow-hidden grid place-items-center bg-linear-to-b from-card to-band">
              {/* TODO: replace with real photo via next/image */}
              <User
                className="w-[46%] text-muted-foreground opacity-50"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="absolute bottom-3 left-3 font-mono text-[10px] text-muted-foreground bg-background/60 border border-border px-2 py-0.5 rounded-md">
                your photo here
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
