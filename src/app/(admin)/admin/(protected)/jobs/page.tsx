import Link from "next/link";

import { listAll, summarizeJobs } from "@/lib/data/job-applications";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JobBoard } from "@/components/admin/job-board";

export default async function AdminJobsPage() {
  const jobs = await listAll();
  const stats = summarizeJobs(jobs);

  const summary = [
    { label: "Applications", value: String(stats.total) },
    { label: "Response rate", value: `${stats.responseRate}%` },
    { label: "Interview rate", value: `${stats.interviewRate}%` },
    { label: "Follow-ups due", value: String(stats.followUpsDue) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job tracker</h1>
          <p className="text-muted-foreground mt-1">
            Private — drag a card to change its status.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/jobs/new">New application</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-3xl">{item.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {jobs.length === 0 ? (
        <p className="border-border bg-card text-muted-foreground rounded-lg border p-8 text-center">
          No applications yet. Add your first one.
        </p>
      ) : (
        <JobBoard jobs={jobs} />
      )}
    </div>
  );
}
