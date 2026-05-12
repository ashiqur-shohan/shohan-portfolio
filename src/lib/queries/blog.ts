import { createClient, createStaticClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types/database";

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data ?? [];
}

/** Cookie-free version for use in generateStaticParams and sitemap (build time). */
export async function getBlogPostsStatic(): Promise<BlogPost[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id,slug,tags,status,updated_at")
    .eq("status", "published");
  return (data as BlogPost[]) ?? [];
}

export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id,slug,title,excerpt,tags,reading_time_minutes,published_at,cover_image_url")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data as BlogPost[]) ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

export async function getBlogTags(): Promise<string[]> {
  const posts = await getBlogPosts();
  const tags = new Set(posts.flatMap((p) => p.tags));
  return Array.from(tags).sort();
}
