import { getProjects } from "@/lib/queries/projects";
import { ProjectCard } from "@/components/sections/project-card";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Projects",
  description: "Software projects by Ashiqur Rahman Shohan — backend systems, DevOps tooling, and web apps.",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-3">Projects</h1>
      <p className="text-muted-foreground mb-10">Things I&apos;ve built or am building.</p>
      {projects.length === 0 ? (
        <p className="text-muted-foreground">No projects yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  );
}
