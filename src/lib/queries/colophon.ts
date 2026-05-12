import { createClient } from "@/lib/supabase/server";
import type { ColophonItem, SiteSettings } from "@/types/database";

export async function getColophonItems(): Promise<ColophonItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("colophon_items")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  return data;
}
