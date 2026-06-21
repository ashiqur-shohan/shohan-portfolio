import Link from "next/link";

import { getStats as getJobStats } from "@/lib/data/job-applications";
import { getCounts as getPostCounts } from "@/lib/data/posts";
import { getCounts as getProjectCounts } from "@/lib/data/projects";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [projects, posts, jobs] = await Promise.all([
    getProjectCounts(),
    getPostCounts(),
    getJobStats(),
  ]);

  const contentStats = [
    { label: "Total projects", value: projects.total },
    { label: "Published projects", value: projects.published },
    { label: "Total posts", value: posts.total },
    { label: "Published posts", value: posts.published },
  ];

  const jobStats = [
    { label: "Applications", value: jobs.total },
    { label: "Response rate", value: `${jobs.responseRate}%` },
    { label: "Interview rate", value: `${jobs.interviewRate}%` },
    { label: "Follow-ups due", value: jobs.followUpsDue },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your portfolio content and job search.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-muted-foreground text-sm font-medium">Content</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contentStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-muted-foreground text-sm font-medium">Job tracker</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {jobStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin/projects">Manage projects</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/blog">Manage blog</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/jobs">Job tracker</Link>
        </Button>
      </div>
    </div>
  );
}
