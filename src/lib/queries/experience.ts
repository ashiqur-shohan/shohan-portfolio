import { createClient } from "@/lib/supabase/server";
import type { Experience } from "@/types/database";

export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order");
  return data ?? [];
}
