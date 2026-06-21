import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New project</h1>
        <p className="text-muted-foreground mt-1">
          Add a project. Publish it when you&apos;re ready for it to appear on
          the site.
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
