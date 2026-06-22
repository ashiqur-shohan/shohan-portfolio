import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/lib/data/types";
import { siteConfig } from "@/lib/site-config";

const TAG_CLASS =
  "font-mono text-[11px] text-muted-foreground border border-border rounded-md px-2.5 py-0.5 whitespace-nowrap";

const LABEL_CLASS =
  "absolute left-3 bottom-3 font-mono text-[10px] text-foreground bg-background/55 border border-border px-2 py-0.5 rounded-md";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="bg-card border border-border rounded-[14px] overflow-hidden transition-[transform,border-color] hover:-translate-y-1 hover:border-primary">
      {/* Shot / cover */}
      <div className="aspect-[16/10] relative">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-card-2 to-primary" />
        )}
        {!project.cover_image_url && (
          <span className={LABEL_CLASS}>screenshot</span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-display text-[18px] font-semibold">
          <Link
            href={`/projects/${project.slug}`}
            className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
          >
            {project.title}
          </Link>
        </h3>

        {/* Tags */}
        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-[6px] my-[9px]">
            {project.tech_stack.slice(0, 5).map((tech) => (
              <span key={tech} className={TAG_CLASS}>
                {tech}
              </span>
            ))}
          </div>
        )}

        <p className="text-muted-foreground text-[13px] mb-3.5">
          {project.summary}
        </p>

        {/* Links — always shown (mock parity); fall back to the GitHub profile
            and the project's detail page when a specific URL isn't set. */}
        <div className="flex gap-3.5 text-[13px] font-semibold">
          <a
            href={project.repo_url ?? siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub
          </a>
          <Link
            href={project.live_url ?? `/projects/${project.slug}`}
            {...(project.live_url
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="text-secondary hover:underline"
          >
            Live →
          </Link>
        </div>
      </div>
    </article>
  );
}
