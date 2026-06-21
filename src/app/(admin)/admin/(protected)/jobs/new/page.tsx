import { JobForm } from "@/components/admin/job-form";

export default function NewJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New application</h1>
        <p className="text-muted-foreground mt-1">
          Track a job you&apos;ve applied to.
        </p>
      </div>
      <JobForm />
    </div>
  );
}
