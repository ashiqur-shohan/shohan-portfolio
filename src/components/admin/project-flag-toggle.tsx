"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { setProjectFlag } from "@/lib/actions/projects";
import { Switch } from "@/components/ui/switch";

export function ProjectFlagToggle({
  id,
  field,
  value,
  label,
}: {
  id: string;
  field: "published" | "featured";
  value: boolean;
  label: string;
}) {
  const router = useRouter();
  const [checked, setChecked] = React.useState(value);
  const [pending, setPending] = React.useState(false);

  async function onChange(next: boolean) {
    setChecked(next);
    setPending(true);
    const result = await setProjectFlag(id, field, next);
    setPending(false);
    if (result.ok) {
      router.refresh();
    } else {
      setChecked(!next);
      toast.error(result.message);
    }
  }

  return (
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      disabled={pending}
      aria-label={label}
    />
  );
}
