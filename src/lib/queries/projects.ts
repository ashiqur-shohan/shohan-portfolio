import { createClient, createStaticClient } from "@/lib/supabase/server";
import type { Project } from "@/types/database";

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("sort_order");
  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

/** Cookie-free version for use in generateStaticParams and sitemap (build time). */
export async function getProjectsStatic(): Promise<Project[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("projects")
    .select("id,slug,updated_at")
    .order("sort_order");
  return (data as Project[]) ?? [];
}
