import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("profile").select("*").single();
  return data;
}
