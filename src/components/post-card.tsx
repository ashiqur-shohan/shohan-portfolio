import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Post } from "@/lib/data/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group focus-visible:ring-ring focus-visible:ring-offset-background block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <article className="border-border bg-card group-hover:border-primary/50 flex h-full flex-col overflow-hidden rounded-xl border transition-colors">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            width={640}
            height={360}
            className="aspect-[16/9] w-full object-cover"
          />
        ) : (
          <div className="from-primary/15 via-muted to-accent/15 aspect-[16/9] bg-gradient-to-br" />
        )}
        <div className="flex flex-1 flex-col gap-3 p-5">
          {post.published_at ? (
            <time
              dateTime={post.published_at}
              className="text-muted-foreground text-xs"
            >
              {formatDate(post.published_at)}
            </time>
          ) : null}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-card-foreground font-semibold tracking-tight">
              {post.title}
            </h3>
            <ArrowUpRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          {post.excerpt ? (
            <p className="text-muted-foreground text-sm">{post.excerpt}</p>
          ) : null}
          {post.tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {post.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
