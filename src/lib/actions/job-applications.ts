"use server";

import { revalidatePath } from "next/cache";

import { getAdminUser } from "@/lib/auth";
import {
  createJobApplication,
  removeJobApplication,
  updateJobApplication,
} from "@/lib/data/job-applications";
import { JOB_STATUSES } from "@/lib/data/types";
import type { JobApplicationWrite, JobStatus } from "@/lib/data/types";
import { jobApplicationSchema } from "@/lib/validations/job-application";

export type JobActionResult = { ok: boolean; message: string };

function revalidateJobViews() {
  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
}

export async function saveJobApplication(
  input: unknown,
  id?: string,
): Promise<JobActionResult> {
  if (!(await getAdminUser())) return { ok: false, message: "Not authorized." };

  const parsed = jobApplicationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields." };
  }
  const v = parsed.data;

  try {
    const fields: JobApplicationWrite = {
      company: v.company,
      role: v.role,
      application_date: v.applicationDate,
      status: v.status,
      source: v.source || null,
      job_url: v.jobUrl || null,
      salary_min: v.salaryMin ?? null,
      salary_max: v.salaryMax ?? null,
      contact_name: v.contactName || null,
      contact_email: v.contactEmail || null,
      next_follow_up: v.nextFollowUp || null,
      notes: v.notes || null,
    };

    if (id) {
      await updateJobApplication(id, fields);
    } else {
      await createJobApplication(fields);
    }

    revalidateJobViews();
    return {
      ok: true,
      message: id ? "Application updated." : "Application added.",
    };
  } catch (err) {
    console.error("[job-applications] saveJobApplication failed:", err);
    return { ok: false, message: "Could not save the application." };
  }
}

export async function deleteJobApplication(
  id: string,
): Promise<JobActionResult> {
  if (!(await getAdminUser())) return { ok: false, message: "Not authorized." };
  try {
    await removeJobApplication(id);
    revalidateJobViews();
    return { ok: true, message: "Application deleted." };
  } catch (err) {
    console.error("[job-applications] deleteJobApplication failed:", err);
    return { ok: false, message: "Could not delete the application." };
  }
}

export async function setJobStatus(
  id: string,
  status: JobStatus,
): Promise<JobActionResult> {
  if (!(await getAdminUser())) return { ok: false, message: "Not authorized." };
  if (!JOB_STATUSES.includes(status)) {
    return { ok: false, message: "Invalid status." };
  }
  try {
    await updateJobApplication(id, { status });
    revalidateJobViews();
    return { ok: true, message: "Status updated." };
  } catch (err) {
    console.error("[job-applications] setJobStatus failed:", err);
    return { ok: false, message: "Could not update the status." };
  }
}
