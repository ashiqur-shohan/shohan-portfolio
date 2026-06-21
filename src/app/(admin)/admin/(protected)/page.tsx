import Link from "next/link";

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
  const [projects, posts] = await Promise.all([
    getProjectCounts(),
    getPostCounts(),
  ]);

  const stats = [
    { label: "Total projects", value: projects.total },
    { label: "Published projects", value: projects.published },
    { label: "Total posts", value: posts.total },
    { label: "Published posts", value: posts.published },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your portfolio content.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin/projects">Manage projects</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/blog">Manage blog</Link>
        </Button>
      </div>
    </div>
  );
}
