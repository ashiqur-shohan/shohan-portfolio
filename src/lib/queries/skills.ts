import { createClient } from "@/lib/supabase/server";
import type { Skill } from "@/types/database";

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order");
  return data ?? [];
}
