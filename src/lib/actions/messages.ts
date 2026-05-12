"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markMessageRead(id: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("contact_messages") as any).update({ read: true }).eq("id", id);
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function archiveMessage(id: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("contact_messages") as any).update({ archived: true }).eq("id", id);
  revalidatePath("/admin/messages");
  return { success: true };
}
