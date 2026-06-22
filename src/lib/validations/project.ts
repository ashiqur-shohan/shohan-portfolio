import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid URL.")
  .or(z.literal(""))
  .optional();

/** Fixed set used by the public All/Web/Mobile/API filter. Grow here only. */
export const PROJECT_CATEGORIES = ["web", "mobile", "api"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

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
  // Fixed enum set — the form submits a string[] from checkboxes (not a comma
  // string like techStack) because the values are not free text. Optional so
  // it lines up with react-hook-form's input shape; the action defaults
  // undefined to []. Empty array = no categories selected (still valid).
  categories: z.array(z.enum(PROJECT_CATEGORIES)).optional(),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  year: z.number().int().min(1990).max(2200).optional(),
  sortOrder: z.number().int().min(0).max(100000).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
