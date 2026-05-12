import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types/database";

export function BlogCard({ post }: { post: BlogPost }) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : null;

  return (
    <article>
      <Link
        href={`/blog/${post.slug}`}
        className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand/40"
      >
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="font-semibold text-base leading-snug group-hover:text-brand transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground font-mono">
          {date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {date}
            </span>
          )}
          {post.reading_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.reading_time_minutes} min read
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
