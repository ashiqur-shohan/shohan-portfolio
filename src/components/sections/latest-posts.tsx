import Link from "next/link";

import { listRecent } from "@/lib/data/posts";
import { Section, SectionHeader } from "@/components/sections/section";
import { PostCard } from "@/components/post-card";

export async function LatestPosts() {
  const posts = await listRecent(3);

  return (
    <Section id="blog" alt>
      <SectionHeader eyebrow="Writing" title="From the blog" />

      {posts.length === 0 ? (
        <p className="border-border text-muted-foreground rounded-[14px] border p-8 text-center">
          Posts are coming soon.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/blog"
              className="text-secondary text-sm font-semibold hover:underline"
            >
              View all posts →
            </Link>
          </div>
        </>
      )}
    </Section>
  );
}
