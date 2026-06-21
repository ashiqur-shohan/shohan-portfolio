import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid URL.")
  .or(z.literal(""))
  .optional();

export const projectSchema = z.object({
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
  summary: z.string().trim().min(1, "Summary is required.").max(500),
  description: z.string().trim().max(5000).optional(),
  problem: z.string().trim().max(5000).optional(),
  approach: z.string().trim().max(5000).optional(),
  outcome: z.string().trim().max(5000).optional(),
  // Comma-separated in the form; split into text[] in the action.
  techStack: z.string().trim().max(500).optional(),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  year: z.number().int().min(1990).max(2200).optional(),
  sortOrder: z.number().int().min(0).max(100000).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
