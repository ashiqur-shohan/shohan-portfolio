import { getBlogPosts, getBlogPostsStatic } from "@/lib/queries/blog";
import { BlogCard } from "@/components/sections/blog-card";
import { constructMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  try {
    const posts = await getBlogPostsStatic();
    const tags = new Set(posts.flatMap((p) => p.tags));
    return Array.from(tags).map((tag) => ({ tag }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return constructMetadata({ title: `Posts tagged "${tag}"`, description: `Blog posts tagged ${tag}.` });
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const allPosts = await getBlogPosts();
  const posts = allPosts.filter((p) => p.tags.includes(tag));
  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <Button variant="ghost" size="sm" className="mb-8 px-0 text-muted-foreground" render={<Link href="/blog" />}>
        <ArrowLeft className="mr-1.5 h-4 w-4" /> All Posts
      </Button>
      <h1 className="text-3xl font-bold tracking-tight mb-2">#{tag}</h1>
      <p className="text-muted-foreground mb-10">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <BlogCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
