import { siteConfig } from "@/lib/site-config";
import { Section, SectionHeader } from "@/components/sections/section";

// ---------------------------------------------------------------------------
// Deterministic contribution-graph opacity
// Uses a multiplicative hash of (week, day) to pick from the opacity levels
// so the pattern is stable across SSR and client renders (no Math.random()).
// ---------------------------------------------------------------------------
const OPACITY_LEVELS = [0.1, 0.1, 0.28, 0.5, 0.72, 1] as const;

function cellOpacity(week: number, day: number): number {
  // Knuth's multiplicative hash (32-bit unsigned)
  const hash = (((week * 7 + day) * 2654435761) >>> 0) % OPACITY_LEVELS.length;
  return OPACITY_LEVELS[hash];
}

// ---------------------------------------------------------------------------
// Language bar / legend token → Tailwind utility class mapping
// Only semantic token classes are used — never raw palette colours.
// ---------------------------------------------------------------------------
const TOKEN_CLASS: Record<string, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  "muted-foreground": "bg-muted-foreground",
  "data-neutral": "bg-data-neutral",
};

// Pre-build the 52×7 grid at module evaluation time (server, static).
const WEEKS = Array.from({ length: 52 }, (_, w) => w);
const DAYS = Array.from({ length: 7 }, (_, d) => d);

export function GithubActivity() {
  const { stats, languages } = siteConfig.github;

  return (
    <Section id="activity" alt>
      <SectionHeader eyebrow="Open source" title="GitHub activity" />

      {/* ── Stat tiles ── */}
      <div className="grid grid-cols-2 gap-4 mb-[18px] sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-[12px] p-4"
          >
            <div className="font-display text-[26px] font-bold text-foreground leading-none">
              {s.num}
            </div>
            <div className="font-mono text-[11px] text-muted-foreground mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main card: graph + language bar ── */}
      <div className="bg-card border border-border rounded-[14px] p-5 overflow-hidden">

        {/* Contribution graph */}
        <div className="flex gap-[3px] overflow-x-auto">
          {WEEKS.map((w) => (
            <div key={w} className="flex flex-col gap-[3px] flex-1 min-w-[10px]">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="aspect-square w-full rounded-[2px] bg-primary"
                  style={{ opacity: cellOpacity(w, d) }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 justify-end font-mono text-[11px] text-muted-foreground mt-2.5">
          Less
          {([0.2, 0.45, 0.72, 1] as const).map((op) => (
            <div
              key={op}
              className="size-[11px] rounded-[2px] bg-primary shrink-0"
              style={{ opacity: op }}
            />
          ))}
          More
        </div>

        {/* Language bar */}
        <div className="flex h-[10px] rounded-[6px] overflow-hidden mt-[18px]">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className={TOKEN_CLASS[lang.token] ?? "bg-muted-foreground"}
              style={{ width: `${lang.pct}%` }}
            />
          ))}
        </div>

        {/* Language legend */}
        <div className="flex flex-wrap gap-4 mt-2.5 font-mono text-xs text-muted-foreground">
          {languages.map((lang) => (
            <span key={lang.name} className="inline-flex items-center gap-1.5">
              <span
                className={`size-[9px] rounded-full shrink-0 ${TOKEN_CLASS[lang.token] ?? "bg-muted-foreground"}`}
              />
              {lang.name} {lang.pct}%
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
