import Link from "next/link";

import { listAll } from "@/lib/data/projects";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { ProjectFlagToggle } from "@/components/admin/project-flag-toggle";

export default async function AdminProjectsPage() {
  const projects = await listAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">New project</Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="border-border bg-card text-muted-foreground rounded-lg border p-8 text-center">
          No projects yet. Create your first one.
        </p>
      ) : (
        <div className="border-border overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-28 text-center">Published</TableHead>
                <TableHead className="w-28 text-center">Featured</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {project.title}
                    </Link>
                    <p className="text-muted-foreground text-xs">
                      /{project.slug}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <ProjectFlagToggle
                      id={project.id}
                      field="published"
                      value={project.published}
                      label={`Toggle published for ${project.title}`}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <ProjectFlagToggle
                      id={project.id}
                      field="featured"
                      value={project.featured}
                      label={`Toggle featured for ${project.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                      <DeleteProjectButton
                        id={project.id}
                        title={project.title}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
