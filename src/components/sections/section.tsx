import { cn } from "@/lib/utils";

/**
 * Page-section primitives shared by every public section, matching the mock
 * (portfolio-neo-tech-mint.html): `section{padding:72px 0}`, the `.alt` band
 * background, and the `.wrap` 1080px container.
 */
export function Section({
  id,
  alt = false,
  className,
  children,
}: {
  id?: string;
  /** Alternating band background (mock `.alt`). */
  alt?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-16 py-[72px]", alt && "bg-band", className)}
    >
      <div className="mx-auto w-full max-w-[1080px] px-6">{children}</div>
    </section>
  );
}

/**
 * Section header pattern (mock `.sec-head`): mono eyebrow in the primary color,
 * a display h2, and a hairline rule filling the remaining width. Left-aligned,
 * used on every section.
 */
export function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-[38px]">
      <div className="text-primary font-mono text-xs tracking-[0.12em] uppercase">
        {eyebrow}
      </div>
      <div className="mt-2.5 flex items-center gap-[18px]">
        <h2 className="font-display text-[clamp(26px,4vw,38px)] font-semibold tracking-[-0.01em] whitespace-nowrap">
          {title}
        </h2>
        <div className="bg-border h-px flex-1" />
      </div>
    </div>
  );
}
