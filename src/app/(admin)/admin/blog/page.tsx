import { getAdminBlogPosts } from "@/lib/queries/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { DeletePostButton } from "@/components/admin/delete-post-button";

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button render={<Link href="/admin/blog/new/edit" />}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{post.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={post.status === "published" ? "default" : "secondary"} className="text-xs">
                    {post.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">/{post.slug}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" render={<Link href={`/admin/blog/${post.id}/edit`} />}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <DeletePostButton id={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
