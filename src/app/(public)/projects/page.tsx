import type { Metadata } from "next";

import { listPublished } from "@/lib/data/projects";
import { ProjectCard } from "@/components/project-card";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work and case studies — the problem, my approach, and the outcome.",
};

export default async function ProjectsPage() {
  const projects = await listPublished();

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="text-muted-foreground mt-3">
          A selection of things I&apos;ve built, written up as short case
          studies.
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="border-border bg-muted/40 text-muted-foreground mt-10 rounded-lg border p-8 text-center">
          Projects are coming soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
