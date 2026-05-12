"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const nowSchema = z.object({ content: z.string().min(1) });

export async function upsertNow(formData: unknown) {
  const { content } = nowSchema.parse(formData);
  const supabase = await createClient();
  // Set all existing entries to not current, then insert new
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("now_entries") as any).update({ is_current: false }).eq("is_current", true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("now_entries") as any).insert({ content, is_current: true });
  if (error) return { error: error.message };
  revalidatePath("/now");
  revalidatePath("/");
  return { success: true };
}
