import Link from "next/link";
import { ExternalLink, GitBranch, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/database";

export function ProjectCard({ project }: { project: Project }) {
  const statusColors: Record<string, string> = {
    shipped:     "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    concept:     "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    archived:    "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  const statusLabel: Record<string, string> = {
    shipped: "Shipped", in_progress: "In Progress", concept: "Concept", archived: "Archived",
  };

  return (
    <Card className="group flex flex-col bg-card transition-colors hover:border-brand/40">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base leading-snug">{project.title}</h3>
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[project.status]}`}>
            {statusLabel[project.status]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed">{project.summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech_stack.slice(0, 5).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs font-mono">
              {tech}
            </Badge>
          ))}
          {project.tech_stack.length > 5 && (
            <Badge variant="secondary" className="text-xs font-mono">
              +{project.tech_stack.length - 5}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2 pt-0">
        <Button variant="ghost" size="sm" className="px-0 text-brand" render={<Link href={`/projects/${project.slug}`} />}>
          Case Study <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
        {project.live_url && (
          <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" render={<a href={project.live_url} target="_blank" rel="noopener noreferrer" aria-label="Live site" />}>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        )}
        {project.repo_url && (
          <Button variant="ghost" size="icon" className="h-7 w-7" render={<a href={project.repo_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" />}>
            <GitBranch className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
