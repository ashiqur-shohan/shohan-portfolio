"use server";

import { revalidatePath } from "next/cache";

import { getAdminUser } from "@/lib/auth";
import {
  createProject,
  removeProject,
  updateProject,
} from "@/lib/data/projects";
import { uploadPublicFile } from "@/lib/data/storage";
import type { ProjectWrite } from "@/lib/data/types";
import { projectSchema } from "@/lib/validations/project";

export type ProjectActionResult = { ok: boolean; message: string };

const COVER_BUCKET = "project-images";

function parseTechStack(input?: string): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);
}

function revalidateProjectViews(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  if (slug) revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function saveProject(
  input: unknown,
  coverFile: File | null,
  id?: string,
): Promise<ProjectActionResult> {
  if (!(await getAdminUser())) return { ok: false, message: "Not authorized." };

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields." };
  }
  const v = parsed.data;

  try {
    let coverImageUrl: string | undefined;
    if (coverFile && coverFile.size > 0) {
      const ext = coverFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${v.slug}-${Date.now()}.${ext}`;
      coverImageUrl = await uploadPublicFile(COVER_BUCKET, path, coverFile);
    }

    // Map the validated form input to the domain write shape (snake_case column
    // names are defined by ProjectWrite in lib/data/types).
    const fields: Omit<ProjectWrite, "cover_image_url"> = {
      title: v.title,
      slug: v.slug,
      summary: v.summary,
      description: v.description || null,
      problem: v.problem || null,
      approach: v.approach || null,
      outcome: v.outcome || null,
      tech_stack: parseTechStack(v.techStack),
      live_url: v.liveUrl || null,
      repo_url: v.repoUrl || null,
      year: v.year ?? null,
      featured: v.featured ?? false,
      sort_order: v.sortOrder ?? 0,
      published: v.published ?? false,
    };

    if (id) {
      // Omit cover_image_url unless a new file was uploaded, so we don't wipe
      // the existing image on an edit that doesn't change the cover.
      await updateProject(id, {
        ...fields,
        ...(coverImageUrl ? { cover_image_url: coverImageUrl } : {}),
      });
    } else {
      await createProject({
        ...fields,
        cover_image_url: coverImageUrl ?? null,
      });
    }

    revalidateProjectViews(v.slug);
    return { ok: true, message: id ? "Project updated." : "Project created." };
  } catch (err) {
    console.error("[projects] saveProject failed:", err);
    const code = (err as { code?: string })?.code;
    return {
      ok: false,
      message:
        code === "23505"
          ? "That slug is already taken."
          : "Could not save the project.",
    };
  }
}

export async function deleteProject(id: string): Promise<ProjectActionResult> {
  if (!(await getAdminUser())) return { ok: false, message: "Not authorized." };
  try {
    await removeProject(id);
    revalidateProjectViews();
    return { ok: true, message: "Project deleted." };
  } catch (err) {
    console.error("[projects] deleteProject failed:", err);
    return { ok: false, message: "Could not delete the project." };
  }
}

export async function setProjectFlag(
  id: string,
  field: "published" | "featured",
  value: boolean,
): Promise<ProjectActionResult> {
  if (!(await getAdminUser())) return { ok: false, message: "Not authorized." };
  try {
    const patch: Partial<ProjectWrite> =
      field === "published" ? { published: value } : { featured: value };
    await updateProject(id, patch);
    revalidateProjectViews();
    return { ok: true, message: "Updated." };
  } catch (err) {
    console.error("[projects] setProjectFlag failed:", err);
    return { ok: false, message: "Could not update." };
  }
}
