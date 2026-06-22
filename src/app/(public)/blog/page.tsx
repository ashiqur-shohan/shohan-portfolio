import type { Metadata } from "next";

import { listPublished } from "@/lib/data/posts";
import { PostCard } from "@/components/post-card";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building for the web — projects, lessons, and tools.",
};

export default async function BlogPage() {
  const posts = await listPublished();

  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 py-[72px]">
      <header className="max-w-2xl">
        <h1 className="font-display text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Blog
        </h1>
        <p className="text-muted-foreground mt-3">
          Notes on what I build and learn — web development, tools, and lessons
          from shipping real products.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="border-border bg-card text-muted-foreground mt-10 rounded-lg border p-8 text-center">
          Posts are coming soon.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
