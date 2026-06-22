import { Award } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Section, SectionHeader } from "@/components/sections/section";

export function Certifications() {
  const { certifications } = siteConfig;

  return (
    <Section id="certs" alt={true}>
      <SectionHeader eyebrow="Credentials" title="Certifications & achievements" />

      {/* 3-col grid on desktop, 1-col on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
        {certifications.map((cert) => (
          <div
            key={cert.title}
            className="bg-card border border-border rounded-[14px] p-[18px] flex gap-[14px] items-start"
          >
            {/* Icon */}
            <div aria-hidden="true" className="text-primary shrink-0 mt-0.5">
              <Award size={22} strokeWidth={2} />
            </div>

            {/* Content */}
            <div>
              <h4 className="font-display text-[15px] font-semibold leading-snug">
                {cert.title}
              </h4>
              <p className="font-mono text-[11px] text-muted-foreground mt-[5px]">
                {cert.issuer} · {cert.year}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
