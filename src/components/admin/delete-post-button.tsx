"use client";
import { useState } from "react";
import { deletePost } from "@/lib/actions/blog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeletePostButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this post permanently?")) return;
    setLoading(true);
    const result = await deletePost(id);
    if (result?.error) toast.error(result.error);
    else { toast.success("Post deleted"); router.refresh(); }
    setLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-destructive"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}
