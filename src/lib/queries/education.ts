import { createClient } from "@/lib/supabase/server";
import type { Education } from "@/types/database";

export async function getEducation(): Promise<Education[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("education")
    .select("*")
    .order("start_date", { ascending: false });
  return data ?? [];
}
