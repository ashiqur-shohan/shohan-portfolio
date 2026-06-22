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
    <section className="mx-auto w-full max-w-[1080px] px-6 py-[72px]">
      <header className="max-w-2xl">
        <h1 className="font-display text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="text-muted-foreground mt-3">
          A selection of things I&apos;ve built, written up as short case
          studies.
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="border-border bg-card text-muted-foreground mt-10 rounded-lg border p-8 text-center">
          Projects are coming soon.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
