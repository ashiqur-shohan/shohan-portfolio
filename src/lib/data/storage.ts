import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * File storage seam. The only place that talks to Supabase Storage — swap the
 * body to move to another provider (S3/R2/a custom API) without touching callers.
 *
 * Uploads `file` to a PUBLIC bucket at `path` and returns its public URL.
 */
export async function uploadPublicFile(
  bucket: string,
  path: string,
  file: File,
  contentType?: string,
): Promise<string> {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: contentType || file.type || undefined,
  });
  if (error) throw error;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
