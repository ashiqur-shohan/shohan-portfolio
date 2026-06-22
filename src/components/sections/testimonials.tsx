import { siteConfig } from "@/lib/site-config";
import { Section, SectionHeader } from "@/components/sections/section";

export function Testimonials() {
  return (
    <Section id="testimonials">
      <SectionHeader eyebrow="Feedback" title="Kind words" />

      {/* 2-col grid on tablet+; single column on mobile */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {siteConfig.testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-card border border-border rounded-[14px] p-[22px]"
          >
            {/* Quote text — wrapped in typographic curly quotes */}
            <p className="text-[15px] text-foreground mb-4">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Attribution row */}
            <div className="flex items-center gap-3">
              {/* Avatar: gradient circle with initials */}
              <div className="size-[38px] rounded-full grid place-items-center font-display font-semibold text-secondary-foreground text-sm bg-linear-to-br from-primary to-secondary shrink-0 select-none">
                {t.initials}
              </div>

              <div>
                <b className="text-sm text-foreground">{t.name}</b>
                <small className="block text-muted-foreground text-xs">
                  {t.role}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
