import Link from "next/link";

import { listFeatured } from "@/lib/data/projects";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";

export async function FeaturedProjects() {
  const projects = await listFeatured();
  if (projects.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Featured work
          </h2>
          <p className="text-muted-foreground mt-2">
            A few projects I&apos;m proud of.
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/projects">All projects →</Link>
        </Button>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
