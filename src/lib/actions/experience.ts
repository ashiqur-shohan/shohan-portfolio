"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const expSchema = z.object({
  company:          z.string().min(1),
  role:             z.string().min(1),
  start_date:       z.string().min(1),
  end_date:         z.string().optional(),
  current:          z.coerce.boolean().default(false),
  location:         z.string().optional(),
  description:      z.string().optional(),
  highlights:       z.array(z.string()).default([]),
  sort_order:       z.coerce.number().default(0),
});

export async function createExperience(formData: unknown) {
  const data = expSchema.parse(formData);
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("experiences") as any).insert(data);
  if (error) return { error: error.message };
  revalidatePath("/experience");
  revalidatePath("/");
  return { success: true };
}

export async function updateExperience(id: string, formData: unknown) {
  const data = expSchema.partial().parse(formData);
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("experiences") as any).update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/experience");
  return { success: true };
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("experiences") as any).delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/experience");
  return { success: true };
}
