"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const projectSchema = z.object({
  slug:            z.string().min(1).regex(/^[a-z0-9-]+$/),
  title:           z.string().min(1),
  summary:         z.string().min(1),
  content:         z.string().optional(),
  tech_stack:      z.array(z.string()).default([]),
  live_url:        z.string().url().optional().or(z.literal("")),
  repo_url:        z.string().url().optional().or(z.literal("")),
  status:          z.enum(["concept","in_progress","shipped","archived"]),
  featured:        z.coerce.boolean().default(false),
  sort_order:      z.coerce.number().default(0),
});

export async function createProject(formData: unknown) {
  const data = projectSchema.parse(formData);
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("projects") as any).insert(data);
  if (error) return { error: error.message };
  revalidatePath("/projects");
  revalidatePath("/");
  return { success: true };
}

export async function updateProject(id: string, formData: unknown) {
  const data = projectSchema.partial().parse(formData);
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("projects") as any).update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/projects");
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("projects") as any).delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/projects");
  return { success: true };
}
