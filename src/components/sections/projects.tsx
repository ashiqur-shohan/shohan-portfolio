import Image from "next/image";
import Link from "next/link";

import { listFeatured, listPublished } from "@/lib/data/projects";
import { siteConfig } from "@/lib/site-config";
import { Section, SectionHeader } from "@/components/sections/section";
import { ProjectsFilter } from "@/components/sections/projects-filter";

const TAG_CLASS =
  "font-mono text-[11px] text-muted-foreground border border-border rounded-md px-2.5 py-0.5 whitespace-nowrap";

const LABEL_CLASS =
  "absolute left-3 bottom-3 font-mono text-[10px] text-foreground bg-background/55 border border-border px-2 py-0.5 rounded-md";

export async function Projects() {
  const [featured, all] = await Promise.all([listFeatured(), listPublished()]);

  const spotlight = featured[0] ?? null;

  return (
    <Section id="work" alt={false}>
      <SectionHeader eyebrow="Selected work" title="Projects" />

      {/* Featured spotlight */}
      {spotlight && (
        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-[34px] items-center mb-[34px]">
          {/* Visual / shot */}
          <div className="aspect-[16/10] rounded-[16px] border border-border overflow-hidden relative">
            {spotlight.cover_image_url ? (
              <Image
                src={spotlight.cover_image_url}
                alt={spotlight.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 560px"
                priority
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-linear-to-br from-card-2 to-primary" />
                <span className={LABEL_CLASS}>screenshot</span>
              </>
            )}
          </div>

          {/* Info */}
          <div>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] uppercase text-primary border border-border rounded-full px-[11px] py-1 mb-[14px]">
              ★ Featured
            </span>

            <h3 className="font-display text-[26px] font-semibold">
              {spotlight.title}
            </h3>

            {/* Tech tags */}
            {spotlight.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-[7px] my-[12px]">
                {spotlight.tech_stack.slice(0, 6).map((tech) => (
                  <span key={tech} className={TAG_CLASS}>
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <p className="text-muted-foreground text-sm mb-5">
              {spotlight.summary}
            </p>

            <div className="flex gap-[14px] items-center">
              <a
                href={spotlight.repo_url ?? siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground text-[13px] font-semibold px-4 py-2.5 rounded-[9px] hover:-translate-y-px transition-transform"
              >
                View GitHub
              </a>
              <Link
                href={spotlight.live_url ?? `/projects/${spotlight.slug}`}
                {...(spotlight.live_url
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-secondary text-[13px] font-semibold hover:underline"
              >
                View project →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filterable grid — client component */}
      <ProjectsFilter projects={all} />
    </Section>
  );
}
