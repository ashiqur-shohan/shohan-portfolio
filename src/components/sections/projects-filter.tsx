"use client";

import { useState } from "react";

import type { Project } from "@/lib/data/types";
import { ProjectCard } from "@/components/project-card";

type FilterKey = "all" | "web" | "mobile" | "api";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "web", label: "Web" },
  { key: "mobile", label: "Mobile" },
  { key: "api", label: "API" },
];

export function ProjectsFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<FilterKey>("all");

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) => p.categories?.includes(active));

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-[10px] mb-6" role="group" aria-label="Filter projects by category">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            aria-pressed={active === key}
            className={[
              "font-mono text-[13px] border border-border rounded-full px-4 py-[7px] transition cursor-pointer",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              active === key
                ? "bg-primary text-primary-foreground border-primary"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
