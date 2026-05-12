"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const skillSchema = z.object({
  name:        z.string().min(1),
  category:    z.enum(["language","framework","database","devops","cloud","tool","other"]),
  proficiency: z.coerce.number().min(1).max(5),
  icon_slug:   z.string().optional(),
  sort_order:  z.coerce.number().default(0),
});

export async function createSkill(formData: unknown) {
  const data = skillSchema.parse(formData);
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("skills") as any).insert(data);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

export async function updateSkill(id: string, formData: unknown) {
  const data = skillSchema.partial().parse(formData);
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("skills") as any).update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("skills") as any).delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

export async function reorderSkills(ids: string[]) {
  const supabase = await createClient();
  const updates = ids.map((id, i) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("skills") as any).update({ sort_order: i }).eq("id", id)
  );
  await Promise.all(updates);
  revalidatePath("/");
  return { success: true };
}
