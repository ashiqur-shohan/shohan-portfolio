import { ImageResponse } from "next/og";

import { getBySlug, listPublished } from "@/lib/data/posts";
import { siteConfig } from "@/lib/site-config";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = await listPublished();
  return posts.map((post) => ({ slug: post.slug }));
}

/**
 * Per-post Open Graph image. Like the root opengraph-image, this renders with
 * Satori, which cannot read CSS variables or Tailwind classes — only inline
 * styles with literal values. The colors below intentionally mirror the Neo
 * Tech Mint theme tokens in src/app/globals.css.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBySlug(slug);
  const title = post?.title ?? "Blog";
  const excerpt = post?.excerpt ?? siteConfig.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0B1120", // --background (dark)
          color: "#F8FAFC", // --foreground
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: "#10B981", // --primary (emerald)
          }}
        >
          {siteConfig.name} — Blog
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            marginTop: 12,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 28,
            maxWidth: 900,
            color: "#94A3B8", // --muted-foreground (dark)
          }}
        >
          {excerpt}
        </div>
      </div>
    ),
    { ...size },
  );
}
