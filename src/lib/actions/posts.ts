"use server";

import { revalidatePath } from "next/cache";

import { getAdminUser } from "@/lib/auth";
import { renderPostHtml } from "@/lib/blocknote/render";
import { createPost, removePost, updatePost } from "@/lib/data/posts";
import { uploadPublicFile } from "@/lib/data/storage";
import type { PostStatus, PostWrite } from "@/lib/data/types";
import { postSchema } from "@/lib/validations/post";

export type PostActionResult = { ok: boolean; message: string };

const COVER_BUCKET = "post-images";

function parseTags(input?: string): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/**
 * Whether the block document holds real content. BlockNote always seeds a new
 * document with a single empty paragraph, so a plain `length` check never catches
 * a blank post. Any non-paragraph block (heading, list, image, code…) counts as
 * content; a paragraph counts only if it has non-whitespace text.
 */
function hasContent(blocks: unknown[]): boolean {
  return blocks.some((block) => {
    const { type, content } = (block ?? {}) as {
      type?: string;
      content?: unknown;
    };
    if (type !== "paragraph") return true;
    if (typeof content === "string") return content.trim().length > 0;
    if (Array.isArray(content)) {
      return content.some((item) => {
        const text = (item as { text?: string })?.text;
        return typeof text === "string" && text.trim().length > 0;
      });
    }
    return false;
  });
}

function revalidatePostViews(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
    // The per-post OG image is a separate (statically generated) route segment;
    // revalidate it too so edited titles/excerpts don't keep stale preview art.
    revalidatePath(`/blog/${slug}/opengraph-image`);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/blog");
}

export async function savePost(
  input: unknown,
  coverFile: File | null,
  contentJson: unknown,
  id?: string,
): Promise<PostActionResult> {
  if (!(await getAdminUser())) return { ok: false, message: "Not authorized." };

  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields." };
  }
  if (!Array.isArray(contentJson) || !hasContent(contentJson)) {
    return { ok: false, message: "Add some content before saving." };
  }
  const v = parsed.data;

  try {
    let coverImageUrl: string | undefined;
    if (coverFile && coverFile.size > 0) {
      const ext = coverFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${v.slug}-${Date.now()}.${ext}`;
      coverImageUrl = await uploadPublicFile(COVER_BUCKET, path, coverFile);
    }

    // Render the public HTML once, here, server-side (CLAUDE.md hard rule #3).
    const contentHtml = await renderPostHtml(contentJson);
    const status: PostStatus =
      v.status === "published" ? "published" : "draft";

    // `published_at` is intentionally absent — the DB trigger owns it.
    const fields: Omit<PostWrite, "cover_image_url"> = {
      title: v.title,
      slug: v.slug,
      excerpt: v.excerpt || null,
      content_json: contentJson,
      content_html: contentHtml,
      tags: parseTags(v.tags),
      status,
    };

    if (id) {
      // Omit cover_image_url unless a new file was uploaded, so an edit that
      // doesn't change the cover keeps the existing image.
      await updatePost(id, {
        ...fields,
        ...(coverImageUrl ? { cover_image_url: coverImageUrl } : {}),
      });
    } else {
      await createPost({ ...fields, cover_image_url: coverImageUrl ?? null });
    }

    revalidatePostViews(v.slug);
    return { ok: true, message: id ? "Post updated." : "Post created." };
  } catch (err) {
    console.error("[posts] savePost failed:", err);
    const code = (err as { code?: string })?.code;
    return {
      ok: false,
      message:
        code === "23505"
          ? "That slug is already taken."
          : "Could not save the post.",
    };
  }
}

export async function deletePost(id: string): Promise<PostActionResult> {
  if (!(await getAdminUser())) return { ok: false, message: "Not authorized." };
  try {
    await removePost(id);
    revalidatePostViews();
    return { ok: true, message: "Post deleted." };
  } catch (err) {
    console.error("[posts] deletePost failed:", err);
    return { ok: false, message: "Could not delete the post." };
  }
}

export async function setPostStatus(
  id: string,
  status: PostStatus,
): Promise<PostActionResult> {
  if (!(await getAdminUser())) return { ok: false, message: "Not authorized." };
  try {
    await updatePost(id, { status });
    revalidatePostViews();
    return { ok: true, message: "Updated." };
  } catch (err) {
    console.error("[posts] setPostStatus failed:", err);
    return { ok: false, message: "Could not update." };
  }
}
