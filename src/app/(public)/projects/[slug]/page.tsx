import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { getBySlug, listPublished } from "@/lib/data/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/icons";
import { Separator } from "@/components/ui/separator";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await listPublished();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = await getBySlug(slug);
  if (!project) notFound();

  const sections = [
    { title: "The problem", body: project.problem },
    { title: "My approach", body: project.approach },
    { title: "The outcome", body: project.outcome },
  ].filter((section) => Boolean(section.body));

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

      {project.year ? (
        <p className="text-muted-foreground text-sm">{project.year}</p>
      ) : null}
      <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {project.title}
      </h1>
      <p className="text-muted-foreground mt-3 text-lg">{project.summary}</p>

      {(project.live_url || project.repo_url) && (
        <div className="mt-5 flex flex-wrap gap-3">
          {project.live_url && (
            <Button asChild>
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live site <ExternalLink className="size-4" />
              </a>
            </Button>
          )}
          {project.repo_url && (
            <Button asChild variant="outline">
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon className="size-4" /> Source
              </a>
            </Button>
          )}
        </div>
      )}

      {project.tech_stack.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tech_stack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      )}

      {project.cover_image_url ? (
        <Image
          src={project.cover_image_url}
          alt={project.title}
          width={1200}
          height={675}
          priority
          className="mt-8 aspect-[16/9] w-full rounded-xl object-cover"
        />
      ) : (
        <div className="from-primary/15 via-muted to-accent/15 mt-8 aspect-[16/9] w-full rounded-xl bg-gradient-to-br" />
      )}

      {project.description ? (
        <p className="text-muted-foreground mt-8 text-lg leading-relaxed">
          {project.description}
        </p>
      ) : null}

      {sections.length > 0 && (
        <>
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
        </>
      )}
    </article>
  );
}
