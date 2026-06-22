import { siteConfig } from "@/lib/site-config";
import { Section, SectionHeader } from "@/components/sections/section";

export function Experience() {
  const { experience } = siteConfig;

  return (
    <Section id="experience" alt={true}>
      <SectionHeader eyebrow="Career" title="Experience" />

      {/* Timeline container: left padding makes room for the absolute rule + dots */}
      <div className="relative pl-7">
        {/* Vertical rule */}
        <div
          aria-hidden="true"
          className="absolute left-[6px] top-[6px] bottom-[6px] w-0.5 bg-border"
        />

        {experience.map((item, index) => (
          <div
            key={index}
            className={`relative${index !== experience.length - 1 ? " pb-7" : ""}`}
          >
            {/* Timeline dot */}
            <div
              aria-hidden="true"
              className="absolute -left-[27px] top-[5px] h-3 w-3 rounded-full bg-primary shadow-[0_0_0_4px] shadow-background"
            />

            {/* Date range */}
            <p className="font-mono text-xs text-secondary">{item.when}</p>

            {/* Role + company */}
            <h4 className="font-display text-[17px] font-semibold mt-0.5">
              {item.role}{" "}
              <span className="text-muted-foreground font-sans font-normal">
                · {item.company}
              </span>
            </h4>

            {/* Summary */}
            <p className="text-muted-foreground text-sm my-[5px]">
              {item.summary}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-[7px]">
              {item.tech.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] text-muted-foreground border border-border rounded-md px-2.5 py-0.5 whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
