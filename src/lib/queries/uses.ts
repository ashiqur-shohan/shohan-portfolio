import { createClient } from "@/lib/supabase/server";
import type { UsesItem } from "@/types/database";

export async function getUsesItems(): Promise<UsesItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("uses_items")
    .select("*")
    .order("category")
    .order("sort_order");
  return data ?? [];
}
