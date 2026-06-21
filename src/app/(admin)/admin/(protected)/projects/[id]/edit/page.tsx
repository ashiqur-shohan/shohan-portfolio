import { notFound } from "next/navigation";

import { getById } from "@/lib/data/projects";
import { ProjectForm } from "@/components/admin/project-form";

type Params = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Params) {
  const { id } = await params;
  const project = await getById(id);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit project</h1>
        <p className="text-muted-foreground mt-1">{project.title}</p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
