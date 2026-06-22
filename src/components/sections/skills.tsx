import { siteConfig } from "@/lib/site-config";
import { SkillIcon } from "@/components/skill-icon";
import { Section, SectionHeader } from "@/components/sections/section";

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader eyebrow="Tech stack" title="Skills" />

      {/* 2-col grid on tablet+; single column on mobile */}
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        {siteConfig.skills.map((group) => (
          <div
            key={group.group}
            className="bg-card border border-border rounded-[14px] p-5"
          >
            {/* Group heading with leading mint dot */}
            <h4 className="font-display text-sm font-semibold mb-[14px] flex items-center gap-2">
              <span className="size-[7px] rounded-full bg-primary shrink-0" />
              {group.group}
            </h4>

            {/* Skill chips */}
            <div className="flex flex-wrap gap-2.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 bg-card-2 border border-border rounded-[8px] px-3 py-[7px] text-[13px] text-foreground transition hover:border-primary"
                >
                  <SkillIcon
                    name={item}
                    className="size-[18px] text-muted-foreground"
                  />
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
