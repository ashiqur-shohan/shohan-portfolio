import { getBlogPostBySlug, getBlogPostsStatic } from "@/lib/queries/blog";
import { constructMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

export async function generateStaticParams() {
  try {
    const posts = await getBlogPostsStatic();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return constructMetadata({
    title: post.title,
    description: post.excerpt ?? post.title,
    image: post.cover_image_url ?? undefined,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <Button variant="ghost" size="sm" className="mb-8 px-0 text-muted-foreground" render={<Link href="/blog" />}>
        <ArrowLeft className="mr-1.5 h-4 w-4" /> All Posts
      </Button>

      <header className="mb-10">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/blog/tags/${tag}`}>
              <Badge variant="secondary" className="text-xs hover:border-brand">{tag}</Badge>
            </Link>
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl leading-tight">{post.title}</h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono">
          {publishedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {publishedDate}
            </span>
          )}
          {post.reading_time_minutes && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.reading_time_minutes} min read
            </span>
          )}
        </div>
      </header>

      {post.content && (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {post.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold mt-8 mb-3">{line.slice(3)}</h2>;
            if (line.startsWith("# "))  return <h1 key={i} className="text-2xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
            if (line.trim() === "") return <div key={i} className="h-4" />;
            return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
          })}
        </div>
      )}
    </div>
  );
}
