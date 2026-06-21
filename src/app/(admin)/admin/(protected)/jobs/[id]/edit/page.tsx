import { notFound } from "next/navigation";

import { getById } from "@/lib/data/job-applications";
import { JobForm } from "@/components/admin/job-form";

type Params = { params: Promise<{ id: string }> };

export default async function EditJobPage({ params }: Params) {
  const { id } = await params;
  const job = await getById(id);
  if (!job) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit application</h1>
        <p className="text-muted-foreground mt-1">
          {job.role} · {job.company}
        </p>
      </div>
      <JobForm job={job} />
    </div>
  );
}
