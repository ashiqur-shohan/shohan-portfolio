import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { getProjectBySlug, getProjects } from "@/lib/data/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/icons";
import { Separator } from "@/components/ui/separator";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const sections = [
    { title: "The problem", body: project.problem },
    { title: "My approach", body: project.approach },
    { title: "The outcome", body: project.outcome },
  ];

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-muted-foreground mb-6 -ml-2"
      >
        <Link href="/projects">
          <ArrowLeft className="size-4" /> Back to projects
        </Link>
      </Button>

      <p className="text-muted-foreground text-sm">{project.year}</p>
      <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {project.title}
      </h1>
      <p className="text-muted-foreground mt-3 text-lg">{project.summary}</p>

      {(project.liveUrl || project.repoUrl) && (
        <div className="mt-5 flex flex-wrap gap-3">
          {project.liveUrl && (
            <Button asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live site <ExternalLink className="size-4" />
              </a>
            </Button>
          )}
          {project.repoUrl && (
            <Button asChild variant="outline">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon className="size-4" /> Source
              </a>
            </Button>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <Badge key={tech} variant="secondary">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="from-primary/15 via-muted to-accent/15 mt-8 aspect-[16/9] w-full rounded-xl bg-gradient-to-br" />

      <Separator className="my-10" />

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-foreground text-xl font-semibold tracking-tight">
              {section.title}
            </h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
