import { getProjectBySlug, getProjectsStatic } from "@/lib/queries/projects";
import { constructMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, GitBranch, ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  try {
    const projects = await getProjectsStatic();
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return constructMetadata({ title: project.title, description: project.summary });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <Button variant="ghost" size="sm" className="mb-8 px-0 text-muted-foreground" render={<Link href="/projects" />}>
        <ArrowLeft className="mr-1.5 h-4 w-4" /> All Projects
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <div className="flex gap-2">
          {project.live_url && (
            <Button variant="outline" size="sm" render={<a href={project.live_url} target="_blank" rel="noopener noreferrer" />}>
              <ExternalLink className="mr-1.5 h-4 w-4" /> Live
            </Button>
          )}
          {project.repo_url && (
            <Button variant="outline" size="sm" render={<a href={project.repo_url} target="_blank" rel="noopener noreferrer" />}>
              <GitBranch className="mr-1.5 h-4 w-4" /> Repo
            </Button>
          )}
        </div>
      </div>

      <p className="text-muted-foreground mb-6">{project.summary}</p>

      <div className="flex flex-wrap gap-1.5 mb-10">
        {project.tech_stack.map((t) => (
          <Badge key={t} variant="secondary" className="font-mono text-xs">{t}</Badge>
        ))}
      </div>

      {project.content && (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {project.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
            if (line.startsWith("# ")) return <h1 key={i}>{line.slice(2)}</h1>;
            if (line.startsWith("- **")) return <p key={i} className="text-muted-foreground">{line.slice(2)}</p>;
            if (line.trim() === "") return <br key={i} />;
            return <p key={i} className="text-muted-foreground">{line}</p>;
          })}
        </div>
      )}
    </div>
  );
}
