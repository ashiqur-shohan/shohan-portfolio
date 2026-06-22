import Link from "next/link";

import type { Post } from "@/lib/data/types";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  const firstTag = post.tags[0] ?? null;
  const dateStr = post.published_at ? formatDate(post.published_at) : null;

  return (
    <article className="bg-card border border-border rounded-[14px] p-5 transition-[transform,border-color] hover:-translate-y-1 hover:border-primary">
      {/* Meta row */}
      <div className="flex gap-2.5 items-center font-mono text-[11px] text-muted-foreground mb-3">
        {dateStr && <span>{dateStr}</span>}
        {firstTag && (
          <span className="text-primary border border-border rounded-md px-2 py-0.5">
            {firstTag}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-display text-[18px] font-semibold leading-snug">
        <Link
          href={`/blog/${post.slug}`}
          className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
        >
          {post.title}
        </Link>
      </h3>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-muted-foreground text-[13px] my-2">{post.excerpt}</p>
      )}

      {/* Read more */}
      <a
        href={`/blog/${post.slug}`}
        className="text-secondary text-[13px] font-semibold hover:underline"
      >
        Read more →
      </a>
    </article>
  );
}
