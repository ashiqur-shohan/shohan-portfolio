import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getBySlug, listPublished } from "@/lib/data/posts";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await listPublished();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBySlug(slug);
  if (!post) return {};
  const description = post.excerpt ?? undefined;
  return {
    title: post.title,
    description,
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.published_at ?? undefined,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-muted-foreground mb-6 -ml-2"
      >
        <Link href="/blog">
          <ArrowLeft className="size-4" /> Back to blog
        </Link>
      </Button>

      {post.published_at ? (
        <time
          dateTime={post.published_at}
          className="text-muted-foreground text-sm"
        >
          {formatDate(post.published_at)}
        </time>
      ) : null}
      <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      {post.excerpt ? (
        <p className="text-muted-foreground mt-3 text-lg">{post.excerpt}</p>
      ) : null}

      {post.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {post.cover_image_url ? (
        <Image
          src={post.cover_image_url}
          alt={post.title}
          width={1200}
          height={675}
          priority
          className="mt-8 aspect-[16/9] w-full rounded-xl object-cover"
        />
      ) : null}

      {/* Server-rendered at save time (lib/blocknote/render). The reading page
          never loads the editor. Styles live in globals.css under .post-body. */}
      <div
        className="post-body mt-8"
        dangerouslySetInnerHTML={{ __html: post.content_html }}
      />
    </article>
  );
}
