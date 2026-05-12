import { getBlogPosts, getBlogTags } from "@/lib/queries/blog";
import { BlogCard } from "@/components/sections/blog-card";
import { constructMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Blog",
  description: "Engineering articles by Ashiqur Rahman Shohan on backend, DevOps, and tooling.",
});

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getBlogPosts(), getBlogTags()]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Blog</h1>
      <p className="text-muted-foreground mb-8">Notes on engineering, tools, and the craft of building things.</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {tags.map((tag) => (
            <Link key={tag} href={`/blog/tags/${tag}`}>
              <Badge variant="outline" className="hover:border-brand hover:text-brand transition-colors cursor-pointer">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => <BlogCard key={p.id} post={p} />)}
        </div>
      )}
    </div>
  );
}
