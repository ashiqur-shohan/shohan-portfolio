"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { savePost } from "@/lib/actions/posts";
import { postSchema, type PostInput } from "@/lib/validations/post";
import type { Post } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Client-only editor: dynamically imported so BlockNote never renders on the
// server (CLAUDE.md hard rule #3). Allowed here because this form is a Client
// Component.
const BlocknoteEditor = dynamic(
  () => import("./blocknote-editor").then((m) => m.BlocknoteEditor),
  {
    ssr: false,
    loading: () => (
      <div className="border-border bg-muted/40 text-muted-foreground flex min-h-[320px] items-center justify-center rounded-md border">
        Loading editor…
      </div>
    ),
  },
);

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive text-sm">{message}</p>;
}

export function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [coverPreview, setCoverPreview] = React.useState<string | null>(
    post?.cover_image_url ?? null,
  );
  const [content, setContent] = React.useState<unknown[]>(
    Array.isArray(post?.content_json) ? (post.content_json as unknown[]) : [],
  );
  const handleEditorChange = React.useCallback(
    (blocks: unknown[]) => setContent(blocks),
    [],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      tags: post?.tags?.join(", ") ?? "",
      status: post?.status ?? "draft",
    },
  });

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setCoverFile(file);
    if (file) setCoverPreview(URL.createObjectURL(file));
  }

  async function onSubmit(values: PostInput) {
    const result = await savePost(values, coverFile, content, post?.id);
    if (result.ok) {
      toast.success(result.message);
      router.push("/admin/blog");
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

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
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          rows={2}
          placeholder="A short summary shown in listings and search results."
          {...register("excerpt")}
          aria-invalid={!!errors.excerpt}
        />
        <FieldError message={errors.excerpt?.message} />
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
          {post
            ? "Leave empty to keep the current image."
            : "Optional. Uploaded to Supabase Storage."}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <div className="border-border focus-within:border-ring rounded-md border bg-card py-2 transition-colors">
          <BlocknoteEditor
            initialContent={post?.content_json}
            onChange={handleEditorChange}
          />
        </div>
        <p className="text-muted-foreground text-xs">
          Type &ldquo;/&rdquo; for blocks (headings, lists, code, images).
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="Next.js, TypeScript, Supabase"
          {...register("tags")}
        />
        <p className="text-muted-foreground text-xs">Comma-separated.</p>
      </div>

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <label className="flex items-center gap-3">
            <Switch
              checked={field.value === "published"}
              onCheckedChange={(checked) =>
                field.onChange(checked ? "published" : "draft")
              }
            />
            <span className="text-sm font-medium">Published</span>
          </label>
        )}
      />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : post ? "Save changes" : "Create post"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/blog">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
