import { createClient } from "@/lib/supabase/server";
import type { BlogPost, ContactMessage } from "@/types/database";

export async function getAdminBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function getAdminMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminStats() {
  const supabase = await createClient();
  const [projects, posts, messages, skills] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false).eq("archived", false),
    supabase.from("skills").select("id", { count: "exact", head: true }),
  ]);
  return {
    projects: projects.count ?? 0,
    posts:    posts.count ?? 0,
    unreadMessages: messages.count ?? 0,
    skills:   skills.count ?? 0,
  };
}
