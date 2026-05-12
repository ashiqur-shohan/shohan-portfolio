"use client";
import { markMessageRead } from "@/lib/actions/messages";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => { await markMessageRead(id); router.refresh(); }}
    >
      <Check className="mr-1.5 h-3.5 w-3.5" />
      Mark as read
    </Button>
  );
}
