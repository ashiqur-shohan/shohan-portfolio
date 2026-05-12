"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const postSchema = z.object({
  slug:                 z.string().min(1).regex(/^[a-z0-9-]+$/),
  title:                z.string().min(1),
  excerpt:              z.string().optional(),
  content:              z.string().optional(),
  tags:                 z.array(z.string()).default([]),
  reading_time_minutes: z.coerce.number().optional(),
  status:               z.enum(["draft","published"]),
  published_at:         z.string().optional(),
});

export async function createPost(formData: unknown) {
  const data = postSchema.parse(formData);
  const supabase = await createClient();
  const insertData = {
    ...data,
    published_at: data.status === "published" ? (data.published_at ?? new Date().toISOString()) : null,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("blog_posts") as any).insert(insertData);
  if (error) return { error: error.message };
  revalidatePath("/blog");
  return { success: true };
}

export async function updatePost(id: string, formData: unknown) {
  const data = postSchema.partial().parse(formData);
  const supabase = await createClient();
  const updateData = {
    ...data,
    published_at: data.status === "published" ? (data.published_at ?? new Date().toISOString()) : null,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("blog_posts") as any).update(updateData).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/blog");
  if (data.slug) revalidatePath(`/blog/${data.slug}`);
  return { success: true };
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("blog_posts") as any).delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/blog");
  return { success: true };
}
