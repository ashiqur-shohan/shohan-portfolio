import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New post</h1>
        <p className="text-muted-foreground mt-1">
          Write a post. Publish it when you&apos;re ready for it to appear on the
          site.
        </p>
      </div>
      <PostForm />
    </div>
  );
}
