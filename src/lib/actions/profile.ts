"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  full_name:            z.string().min(1),
  headline:             z.string().min(1),
  bio:                  z.string().optional(),
  location:             z.string().min(1),
  availability_status:  z.enum(["open", "limited", "closed"]),
  availability_message: z.string().optional(),
  email_public:         z.string().email().optional().or(z.literal("")),
  resume_url:           z.string().url().optional().or(z.literal("")),
  social_links:         z.object({
    github:   z.string().optional(),
    linkedin: z.string().optional(),
    twitter:  z.string().optional(),
  }).optional(),
});

export async function upsertProfile(formData: unknown) {
  const data = profileSchema.parse(formData);
  const supabase = await createClient();
  const upsertData = { ...data, social_links: data.social_links ?? {} };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profile") as any).upsert(upsertData);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/about");
  return { success: true };
}
