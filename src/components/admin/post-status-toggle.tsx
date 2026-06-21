"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { setPostStatus } from "@/lib/actions/posts";
import type { PostStatus } from "@/lib/data/types";
import { Switch } from "@/components/ui/switch";

export function PostStatusToggle({
  id,
  status,
  label,
}: {
  id: string;
  status: PostStatus;
  label: string;
}) {
  const router = useRouter();
  const [published, setPublished] = React.useState(status === "published");
  const [pending, setPending] = React.useState(false);

  async function onChange(next: boolean) {
    setPublished(next);
    setPending(true);
    const result = await setPostStatus(id, next ? "published" : "draft");
    setPending(false);
    if (result.ok) {
      router.refresh();
    } else {
      setPublished(!next);
      toast.error(result.message);
    }
  }

  return (
    <Switch
      checked={published}
      onCheckedChange={onChange}
      disabled={pending}
      aria-label={label}
    />
  );
}
