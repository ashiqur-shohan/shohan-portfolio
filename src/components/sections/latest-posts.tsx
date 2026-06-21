import Link from "next/link";

import { listRecent } from "@/lib/data/posts";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";

export async function LatestPosts() {
  const posts = await listRecent(3);
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Latest writing
          </h2>
          <p className="text-muted-foreground mt-2">
            Notes on what I build and learn.
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/blog">All posts →</Link>
        </Button>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
