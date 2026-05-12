import { getAdminStats, getAdminMessages } from "@/lib/queries/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, MessageSquare, List } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [stats, messages] = await Promise.all([
    getAdminStats(),
    getAdminMessages(),
  ]);

  const statCards = [
    { label: "Projects",        value: stats.projects,       icon: FileText,      href: "/admin/projects" },
    { label: "Blog Posts",      value: stats.posts,          icon: BookOpen,      href: "/admin/blog" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, href: "/admin/messages" },
    { label: "Skills",          value: stats.skills,         icon: List,          href: "/admin/skills" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, Shohan.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:border-brand/40 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tabular">{value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {messages.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-4">Recent Messages</h2>
          <div className="space-y-2">
            {messages.slice(0, 5).map((msg) => (
              <Link
                key={msg.id}
                href="/admin/messages"
                className="block rounded-lg border border-border bg-card p-4 hover:border-brand/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{msg.name}</p>
                    <p className="text-xs text-muted-foreground">{msg.email}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{msg.message}</p>
                  </div>
                  {!msg.read && (
                    <span className="shrink-0 h-2 w-2 rounded-full bg-brand mt-1" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
