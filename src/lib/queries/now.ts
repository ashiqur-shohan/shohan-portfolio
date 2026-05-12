import { createClient } from "@/lib/supabase/server";
import type { NowEntry } from "@/types/database";

export async function getCurrentNow(): Promise<NowEntry | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("now_entries")
    .select("*")
    .eq("is_current", true)
    .single();
  return data;
}
