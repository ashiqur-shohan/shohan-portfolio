"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { saveJobApplication } from "@/lib/actions/job-applications";
import { JOB_STATUS_LABELS, JOB_STATUSES } from "@/lib/data/types";
import type { JobApplication } from "@/lib/data/types";
import {
  jobApplicationSchema,
  type JobApplicationInput,
} from "@/lib/validations/job-application";
import { todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive text-sm">{message}</p>;
}

export function JobForm({ job }: { job?: JobApplication }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobApplicationInput>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      company: job?.company ?? "",
      role: job?.role ?? "",
      applicationDate: job?.application_date ?? todayISO(),
      status: job?.status ?? "applied",
      source: job?.source ?? "",
      jobUrl: job?.job_url ?? "",
      salaryMin: job?.salary_min ?? undefined,
      salaryMax: job?.salary_max ?? undefined,
      contactName: job?.contact_name ?? "",
      contactEmail: job?.contact_email ?? "",
      nextFollowUp: job?.next_follow_up ?? "",
      notes: job?.notes ?? "",
    },
  });

  const numberSetValueAs = (value: string) =>
    value === "" || value == null ? undefined : Number(value);

  async function onSubmit(values: JobApplicationInput) {
    const result = await saveJobApplication(values, job?.id);
    if (result.ok) {
      toast.success(result.message);
      router.push("/admin/jobs");
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  const selectClass =
    "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            {...register("company")}
            aria-invalid={!!errors.company}
          />
          <FieldError message={errors.company?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" {...register("role")} aria-invalid={!!errors.role} />
          <FieldError message={errors.role?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="applicationDate">Application date</Label>
          <Input
            id="applicationDate"
            type="date"
            {...register("applicationDate")}
            aria-invalid={!!errors.applicationDate}
          />
          <FieldError message={errors.applicationDate?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" className={selectClass} {...register("status")}>
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {JOB_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            placeholder="LinkedIn, referral, company site…"
            {...register("source")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobUrl">Job posting URL</Label>
          <Input
            id="jobUrl"
            placeholder="https://…"
            {...register("jobUrl")}
            aria-invalid={!!errors.jobUrl}
          />
          <FieldError message={errors.jobUrl?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="salaryMin">Salary min</Label>
          <Input
            id="salaryMin"
            type="number"
            {...register("salaryMin", { setValueAs: numberSetValueAs })}
            aria-invalid={!!errors.salaryMin}
          />
          <FieldError message={errors.salaryMin?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryMax">Salary max</Label>
          <Input
            id="salaryMax"
            type="number"
            {...register("salaryMax", { setValueAs: numberSetValueAs })}
            aria-invalid={!!errors.salaryMax}
          />
          <FieldError message={errors.salaryMax?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nextFollowUp">Next follow-up</Label>
          <Input
            id="nextFollowUp"
            type="date"
            {...register("nextFollowUp")}
            aria-invalid={!!errors.nextFollowUp}
          />
          <FieldError message={errors.nextFollowUp?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactName">Contact name</Label>
          <Input id="contactName" {...register("contactName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact email</Label>
          <Input
            id="contactEmail"
            type="email"
            {...register("contactEmail")}
            aria-invalid={!!errors.contactEmail}
          />
          <FieldError message={errors.contactEmail?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={4} {...register("notes")} />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : job
              ? "Save changes"
              : "Add application"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/jobs">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
