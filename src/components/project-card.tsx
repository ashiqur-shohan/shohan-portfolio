import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group focus-visible:ring-ring focus-visible:ring-offset-background block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <article className="border-border bg-card group-hover:border-primary/50 flex h-full flex-col overflow-hidden rounded-xl border transition-colors">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            width={640}
            height={360}
            className="aspect-[16/9] w-full object-cover"
          />
        ) : (
          <div className="from-primary/15 via-muted to-accent/15 aspect-[16/9] bg-gradient-to-br" />
        )}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-card-foreground font-semibold tracking-tight">
              {project.title}
            </h3>
            <ArrowUpRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="text-muted-foreground text-sm">{project.summary}</p>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
