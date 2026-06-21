import { z } from "zod";

/** Shape + calendar validity (rejects 2026-02-30). UTC-parsed so it's correct
 *  regardless of the server's timezone. */
function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const optionalDate = z
  .string()
  .trim()
  .refine((value) => value === "" || isRealDate(value), "Use a valid date.")
  .optional();

export const jobApplicationSchema = z
  .object({
    company: z.string().trim().min(1, "Company is required.").max(200),
    role: z.string().trim().min(1, "Role is required.").max(200),
    applicationDate: z
      .string()
      .trim()
      .refine(isRealDate, "Enter a valid date."),
    status: z.enum([
      "applied",
      "screening",
      "interview",
      "offer",
      "rejected",
      "ghosted",
    ]),
    source: z.string().trim().max(200).optional(),
    jobUrl: z.string().trim().url("Enter a valid URL.").or(z.literal("")).optional(),
    salaryMin: z.number().int().min(0).max(100_000_000).optional(),
    salaryMax: z.number().int().min(0).max(100_000_000).optional(),
    contactName: z.string().trim().max(200).optional(),
    contactEmail: z
      .string()
      .trim()
      .email("Enter a valid email.")
      .or(z.literal(""))
      .optional(),
    nextFollowUp: optionalDate,
    notes: z.string().trim().max(5000).optional(),
  })
  .refine(
    (v) =>
      v.salaryMin == null ||
      v.salaryMax == null ||
      v.salaryMax >= v.salaryMin,
    { message: "Max salary must be ≥ min salary.", path: ["salaryMax"] },
  );

export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
