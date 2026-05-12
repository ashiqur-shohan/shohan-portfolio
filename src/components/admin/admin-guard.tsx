import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function AdminGuard({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return <>{children}</>;
}
