import { notFound } from "next/navigation";

import { getById } from "@/lib/data/posts";
import { PostForm } from "@/components/admin/post-form";

type Params = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Params) {
  const { id } = await params;
  const post = await getById(id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit post</h1>
        <p className="text-muted-foreground mt-1">{post.title}</p>
      </div>
      <PostForm post={post} />
    </div>
  );
}
