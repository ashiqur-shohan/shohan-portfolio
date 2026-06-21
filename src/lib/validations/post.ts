import { z } from "zod";

export const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only.",
    ),
  excerpt: z.string().trim().max(500).optional(),
  // Comma-separated in the form; split into text[] in the action.
  tags: z.string().trim().max(500).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export type PostInput = z.infer<typeof postSchema>;
