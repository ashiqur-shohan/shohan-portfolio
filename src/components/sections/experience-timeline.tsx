import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Experience } from "@/types/database";

interface ExperienceTimelineProps {
  experiences: Experience[];
}

function formatDateRange(start: string, end: string | null, current: boolean): string {
  const fmt = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  return `${fmt(start)} — ${current || !end ? "Present" : fmt(end)}`;
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight mb-10">Experience</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border hidden sm:block" />

          <ul className="space-y-10">
            {experiences.map((exp) => (
              <li key={exp.id} className="relative sm:pl-16">
                {/* Dot */}
                <div className="absolute left-3.5 top-1.5 hidden sm:flex h-3 w-3 items-center justify-center rounded-full border-2 border-brand bg-background" />

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-base">{exp.role}</h3>
                    <span className="text-muted-foreground">·</span>
                    <span className="font-medium text-brand">{exp.company}</span>
                    {exp.current && (
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                    <span>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  {exp.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {exp.highlights.length > 0 && (
                    <ul className="space-y-1 mt-2">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
