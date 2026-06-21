"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";

import { setJobStatus } from "@/lib/actions/job-applications";
import { JOB_STATUS_LABELS, JOB_STATUSES } from "@/lib/data/types";
import type { JobApplication, JobStatus } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { JobCard } from "@/components/admin/job-card";

// Dot colors — the PRD §7 status→token mapping. Only the dot is colored, so the
// card text always meets contrast (avoids amber-on-light failing AA).
const STATUS_DOT: Record<JobStatus, string> = {
  applied: "bg-muted-foreground",
  screening: "bg-info",
  interview: "bg-accent",
  offer: "bg-success",
  rejected: "bg-destructive",
  ghosted: "bg-muted-foreground",
};

function Column({
  status,
  jobs,
}: {
  status: JobStatus;
  jobs: JobApplication[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-border bg-muted/30 flex w-72 shrink-0 flex-col rounded-lg border p-3 transition-colors",
        isOver && "border-primary/50 bg-muted/60",
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className={cn("size-2 rounded-full", STATUS_DOT[status])} />
          {JOB_STATUS_LABELS[status]}
        </span>
        <span className="text-muted-foreground text-xs tabular-nums">
          {jobs.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {jobs.length === 0 ? (
          <p className="border-border text-muted-foreground rounded-md border border-dashed p-4 text-center text-xs">
            Drop here
          </p>
        ) : (
          jobs.map((job) => <DraggableCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
}

function DraggableCard({ job }: { job: JobApplication }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: job.id });
  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const handle = (
    <button
      type="button"
      aria-label={`Drag ${job.role} at ${job.company} to change status`}
      className="text-muted-foreground hover:text-foreground -ml-1 mt-0.5 cursor-grab touch-none"
      {...listeners}
      {...attributes}
    >
      <GripVertical className="size-4" />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && "opacity-40")}
    >
      <JobCard job={job} handle={handle} />
    </div>
  );
}

export function JobBoard({ jobs: initialJobs }: { jobs: JobApplication[] }) {
  const router = useRouter();
  const [jobs, setJobs] = React.useState(initialJobs);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  // Cards whose status change is still in flight. Their optimistic status must
  // survive a concurrent server resync (e.g. a refresh triggered by deleting a
  // different card) until the mutation resolves.
  const [pending, setPending] = React.useState<Record<string, JobStatus>>({});

  // Re-sync with the server list whenever it changes (after refresh / delete /
  // add). Adjusting state during render is React's recommended alternative to a
  // setState-in-effect; merging `pending` keeps in-flight optimistic moves.
  const [syncedJobs, setSyncedJobs] = React.useState(initialJobs);
  if (syncedJobs !== initialJobs) {
    setSyncedJobs(initialJobs);
    setJobs(
      initialJobs.map((job) => {
        const optimistic = pending[job.id];
        return optimistic ? { ...job, status: optimistic } : job;
      }),
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    // Keyboard drag: focus a card's handle, Space to pick up, arrows to move,
    // Space to drop. Makes the board's primary interaction keyboard-accessible.
    useSensor(KeyboardSensor),
  );

  const activeJob = jobs.find((j) => j.id === activeId) ?? null;

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const id = String(active.id);
    const target = String(over.id) as JobStatus;
    const job = jobs.find((j) => j.id === id);
    if (!job || job.status === target) return;

    const previous = job.status;
    // Optimistic move; revert if the server rejects it.
    setPending((p) => ({ ...p, [id]: target }));
    setJobs((current) =>
      current.map((j) => (j.id === id ? { ...j, status: target } : j)),
    );

    const result = await setJobStatus(id, target);
    setPending((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });
    if (result.ok) {
      router.refresh();
    } else {
      setJobs((current) =>
        current.map((j) => (j.id === id ? { ...j, status: previous } : j)),
      );
      toast.error(result.message);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {JOB_STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            jobs={jobs.filter((j) => j.status === status)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeJob ? <JobCard job={activeJob} dragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
