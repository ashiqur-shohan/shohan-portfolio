import Link from "next/link";
import { CalendarClock, ExternalLink, Pencil } from "lucide-react";

import type { JobApplication } from "@/lib/data/types";
import { cn, formatDate, isFollowUpDue } from "@/lib/utils";
import { DeleteJobButton } from "@/components/admin/delete-job-button";

function formatSalaryRange(min: number | null, max: number | null): string | null {
  const fmt = (n: number) => n.toLocaleString("en-US");
  if (min != null && max != null) return `${fmt(min)}–${fmt(max)}`;
  if (min != null) return `${fmt(min)}+`;
  if (max != null) return `up to ${fmt(max)}`;
  return null;
}

/**
 * Presentational kanban card. Drag behaviour lives in the board (the optional
 * `handle` slot carries the dnd-kit listeners); this component stays dumb so it
 * can also render inside the drag overlay.
 */
export function JobCard({
  job,
  handle,
  dragging,
}: {
  job: JobApplication;
  handle?: React.ReactNode;
  dragging?: boolean;
}) {
  const salary = formatSalaryRange(job.salary_min, job.salary_max);
  const due = isFollowUpDue(job.next_follow_up, job.status);

  return (
    <div
      className={cn(
        "border-border bg-card rounded-md border p-3 shadow-sm",
        dragging && "shadow-lg",
        due && "ring-warning/60 ring-1",
      )}
    >
      <div className="flex items-start gap-1.5">
        {handle}
        <div className="min-w-0 flex-1">
          <p className="text-card-foreground truncate text-sm font-medium">
            {job.role}
          </p>
          <p className="text-muted-foreground truncate text-xs">{job.company}</p>
        </div>
        <div className="flex shrink-0 items-center">
          {job.job_url ? (
            <a
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open posting for ${job.role} at ${job.company}`}
              className="text-muted-foreground hover:text-foreground inline-flex size-7 items-center justify-center rounded-md"
            >
              <ExternalLink className="size-3.5" />
            </a>
          ) : null}
          <Link
            href={`/admin/jobs/${job.id}/edit`}
            aria-label={`Edit ${job.role} at ${job.company}`}
            className="text-muted-foreground hover:text-foreground inline-flex size-7 items-center justify-center rounded-md"
          >
            <Pencil className="size-3.5" />
          </Link>
          <DeleteJobButton id={job.id} label={`${job.role} at ${job.company}`} />
        </div>
      </div>

      {(salary || job.next_follow_up) && (
        <div className="mt-2 space-y-1">
          {salary ? (
            <p className="text-muted-foreground text-xs">{salary}</p>
          ) : null}
          {job.next_follow_up ? (
            <p
              className={cn(
                "flex items-center gap-1 text-xs",
                due
                  ? "text-warning-strong font-medium"
                  : "text-muted-foreground",
              )}
            >
              <CalendarClock className="size-3" />
              Follow up {formatDate(job.next_follow_up)}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
