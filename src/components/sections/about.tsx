import { Code2, Smartphone, Cloud } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { Section, SectionHeader } from "@/components/sections/section";

/** Maps each service card (by index) to its lucide icon. */
const SERVICE_ICONS: LucideIcon[] = [Code2, Smartphone, Cloud];

export function About() {
  return (
    <Section id="about" alt>
      <SectionHeader
        eyebrow={siteConfig.about.eyebrow}
        title={siteConfig.about.title}
      />

      {/* Body paragraph */}
      <p className="text-muted-foreground text-base max-w-[700px] mb-[26px]">
        {siteConfig.about.body}
      </p>

      {/* Services row */}
      <div className="grid grid-cols-1 gap-[18px] mb-[22px] sm:grid-cols-3">
        {siteConfig.about.services.map((svc, i) => {
          const Icon = SERVICE_ICONS[i] ?? Code2;
          return (
            <div
              key={svc.title}
              className="bg-card border border-border rounded-[14px] p-5"
            >
              <span className="inline-flex text-primary mb-2.5" aria-hidden="true">
                <Icon size={24} strokeWidth={2} />
              </span>
              <h4 className="font-display text-base font-semibold text-foreground">
                {svc.title}
              </h4>
              <p className="text-[13px] text-muted-foreground mt-1">
                {svc.blurb}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-3">
        {siteConfig.about.stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card-2 border border-border rounded-[14px] p-[18px]"
          >
            <div className="font-display text-[32px] font-bold leading-none text-foreground">
              {stat.num}
              <span className="text-secondary">{stat.suffix}</span>
            </div>
            <div className="font-mono text-[11px] text-muted-foreground mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
