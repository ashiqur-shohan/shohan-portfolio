"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { saveProject } from "@/lib/actions/projects";
import {
  PROJECT_CATEGORIES,
  projectSchema,
  type ProjectCategory,
  type ProjectInput,
} from "@/lib/validations/project";
import type { Project } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive text-sm">{message}</p>;
}

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [coverPreview, setCoverPreview] = React.useState<string | null>(
    project?.cover_image_url ?? null,
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      summary: project?.summary ?? "",
      description: project?.description ?? "",
      problem: project?.problem ?? "",
      approach: project?.approach ?? "",
      outcome: project?.outcome ?? "",
      techStack: project?.tech_stack?.join(", ") ?? "",
      categories: (project?.categories ?? []) as ProjectCategory[],
      liveUrl: project?.live_url ?? "",
      repoUrl: project?.repo_url ?? "",
      year: project?.year ?? undefined,
      sortOrder: project?.sort_order ?? 0,
      featured: project?.featured ?? false,
      published: project?.published ?? false,
    },
  });

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setCoverFile(file);
    if (file) setCoverPreview(URL.createObjectURL(file));
  }

  async function onSubmit(values: ProjectInput) {
    const result = await saveProject(values, coverFile, project?.id);
    if (result.ok) {
      toast.success(result.message);
      router.push("/admin/projects");
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  const numberSetValueAs = (fallback: number | undefined) => (v: string) =>
    v === "" || v == null ? fallback : Number(v);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title")}
            aria-invalid={!!errors.title}
          />
          <FieldError message={errors.title?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} aria-invalid={!!errors.slug} />
          <FieldError message={errors.slug?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          rows={2}
          {...register("summary")}
          aria-invalid={!!errors.summary}
        />
        <FieldError message={errors.summary?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover">Cover image</Label>
        {coverPreview ? (
          <Image
            src={coverPreview}
            alt="Cover preview"
            width={320}
            height={180}
            unoptimized
            className="border-border aspect-[16/9] w-full max-w-xs rounded-md border object-cover"
          />
        ) : null}
        <Input
          id="cover"
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        <p className="text-muted-foreground text-xs">
          {project
            ? "Leave empty to keep the current image."
            : "Optional. Uploaded to Supabase Storage."}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional intro)</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="problem">Problem</Label>
          <Textarea id="problem" rows={5} {...register("problem")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="approach">Approach</Label>
          <Textarea id="approach" rows={5} {...register("approach")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="outcome">Outcome</Label>
          <Textarea id="outcome" rows={5} {...register("outcome")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="techStack">Tech stack</Label>
        <Input
          id="techStack"
          placeholder="Next.js, TypeScript, PostgreSQL"
          {...register("techStack")}
        />
        <p className="text-muted-foreground text-xs">Comma-separated.</p>
      </div>

      <div className="space-y-2">
        <Label>Categories</Label>
        <Controller
          control={control}
          name="categories"
          render={({ field }) => {
            const selected = (field.value ?? []) as ProjectCategory[];
            const toggle = (value: ProjectCategory) => {
              field.onChange(
                selected.includes(value)
                  ? selected.filter((v) => v !== value)
                  : [...selected, value],
              );
            };
            return (
              <div className="flex flex-wrap gap-6">
                {PROJECT_CATEGORIES.map((value) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 text-sm font-medium capitalize"
                  >
                    <input
                      type="checkbox"
                      className="border-input text-primary focus-visible:ring-ring h-4 w-4 rounded border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      checked={selected.includes(value)}
                      onChange={() => toggle(value)}
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
            );
          }}
        />
        <FieldError message={errors.categories?.message} />
        <p className="text-muted-foreground text-xs">
          Used by the public All / Web / Mobile / API filter.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input
            id="liveUrl"
            placeholder="https://…"
            {...register("liveUrl")}
            aria-invalid={!!errors.liveUrl}
          />
          <FieldError message={errors.liveUrl?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repoUrl">Repository URL</Label>
          <Input
            id="repoUrl"
            placeholder="https://github.com/…"
            {...register("repoUrl")}
            aria-invalid={!!errors.repoUrl}
          />
          <FieldError message={errors.repoUrl?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            {...register("year", { setValueAs: numberSetValueAs(undefined) })}
            aria-invalid={!!errors.year}
          />
          <FieldError message={errors.year?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input
            id="sortOrder"
            type="number"
            {...register("sortOrder", { setValueAs: numberSetValueAs(0) })}
            aria-invalid={!!errors.sortOrder}
          />
          <FieldError message={errors.sortOrder?.message} />
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        <Controller
          control={control}
          name="featured"
          render={({ field }) => (
            <label className="flex items-center gap-3">
              <Switch
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
          )}
        />
        <Controller
          control={control}
          name="published"
          render={({ field }) => (
            <label className="flex items-center gap-3">
              <Switch
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
              <span className="text-sm font-medium">Published</span>
            </label>
          )}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : project
              ? "Save changes"
              : "Create project"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/projects">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
