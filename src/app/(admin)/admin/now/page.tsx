"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { upsertNow } from "@/lib/actions/now";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import type { NowEntry } from "@/types/database";

export default function AdminNowPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("now_entries").select("*").eq("is_current", true).single().then(({ data }) => {
      if (data) {
        const e = data as NowEntry;
        setContent(e.content);
        setLastUpdated(e.updated_at);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    const result = await upsertNow({ content });
    setSaving(false);
    if (result?.error) toast.error(result.error);
    else toast.success("Now page updated!");
  };

  if (loading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Now</h1>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {new Date(lastUpdated).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          )}
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
      <div className="space-y-1.5">
        <Label>Content (Markdown)</Label>
        <Textarea
          rows={20}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="## What I'm doing now&#10;&#10;- Working on…"
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
}
