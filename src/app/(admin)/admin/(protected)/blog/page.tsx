import Link from "next/link";

import { listAll } from "@/lib/data/posts";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { PostStatusToggle } from "@/components/admin/post-status-toggle";

export default async function AdminBlogPage() {
  const posts = await listAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
        <Button asChild>
          <Link href="/admin/blog/new">New post</Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="border-border bg-card text-muted-foreground rounded-lg border p-8 text-center">
          No posts yet. Write your first one.
        </p>
      ) : (
        <div className="border-border overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-40">Published</TableHead>
                <TableHead className="w-28 text-center">Live</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {post.title}
                    </Link>
                    <p className="text-muted-foreground text-xs">/{post.slug}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {post.published_at ? formatDate(post.published_at) : "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <PostStatusToggle
                      id={post.id}
                      status={post.status}
                      label={`Toggle published for ${post.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/blog/${post.id}/edit`}>Edit</Link>
                      </Button>
                      <DeletePostButton id={post.id} title={post.title} />
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
