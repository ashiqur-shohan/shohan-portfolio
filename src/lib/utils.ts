import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an ISO date string as e.g. "June 21, 2026". Returns "" for nullish. */
export function formatDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Today's date as a local "YYYY-MM-DD" string (matches `date` columns). */
export function todayISO(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

/**
 * Whether a job application's follow-up is due: it has a date that is today or
 * earlier and the application is still in an active pipeline stage. Pure and
 * client-safe (used to highlight kanban cards).
 */
export function isFollowUpDue(
  nextFollowUp?: string | null,
  status?: string,
): boolean {
  if (!nextFollowUp) return false;
  if (status && !["applied", "screening", "interview"].includes(status)) {
    return false;
  }
  return nextFollowUp <= todayISO();
}
