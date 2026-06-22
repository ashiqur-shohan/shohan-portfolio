import { GraduationCap } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Section, SectionHeader } from "@/components/sections/section";

export function Education() {
  const { education } = siteConfig;

  return (
    <Section id="education" alt={false}>
      <SectionHeader eyebrow="Education" title="Where it started" />

      <div className="flex gap-[18px] items-start bg-card border border-border rounded-[14px] p-[22px]">
        {/* Icon */}
        <div
          aria-hidden="true"
          className="w-[50px] h-[50px] shrink-0 rounded-[12px] border border-border grid place-items-center text-primary"
        >
          <GraduationCap size={24} strokeWidth={2} />
        </div>

        {/* Content */}
        <div>
          <h4 className="font-display text-lg font-semibold">{education.degree}</h4>
          <p className="font-mono text-xs text-secondary my-[4px]">
            {education.school} · {education.years}
          </p>
          <p className="text-muted-foreground text-sm max-w-[620px]">
            {education.note}
          </p>
        </div>
      </div>
    </Section>
  );
}
