"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createPost, updatePost } from "@/lib/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2, Plus, X } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/types/database";

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    slug: "", title: "", excerpt: "", content: "",
    tags: [] as string[], status: "draft" as "draft" | "published",
    reading_time_minutes: "",
  });

  useEffect(() => {
    if (isNew) return;
    const supabase = createClient();
    supabase.from("blog_posts").select("*").eq("id", id).single().then(({ data }) => {
      if (data) {
        const p = data as BlogPost;
        setForm({
          slug: p.slug, title: p.title, excerpt: p.excerpt ?? "",
          content: p.content ?? "", tags: p.tags,
          status: p.status, reading_time_minutes: String(p.reading_time_minutes ?? ""),
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  const handleSave = async () => {
    setSaving(true);
    const data = {
      ...form,
      reading_time_minutes: form.reading_time_minutes ? Number(form.reading_time_minutes) : undefined,
    };
    const result = isNew ? await createPost(data) : await updatePost(id, data);
    setSaving(false);
    if (result?.error) toast.error(result.error);
    else { toast.success("Post saved!"); router.push("/admin/blog"); }
  };

  if (loading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" render={<Link href="/admin/blog" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{isNew ? "New Post" : "Edit Post"}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Select value={form.status} onValueChange={(v) => setForm(f => ({...f, status: v as "draft" | "published"}))}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Post title" />
          </div>
          <div className="space-y-1.5">
            <Label>Slug *</Label>
            <Input value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))} placeholder="my-post-slug" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Excerpt</Label>
          <Textarea rows={2} value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} placeholder="Brief summary…" />
        </div>

        <div className="space-y-1.5">
          <Label>Content (Markdown)</Label>
          <Textarea
            rows={20}
            value={form.content}
            onChange={e => setForm(f => ({...f, content: e.target.value}))}
            placeholder="# My Post&#10;&#10;Write your content here in Markdown…"
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); }}}
              placeholder="Add tag and press Enter"
            />
            <Button variant="outline" size="icon" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="rounded-full hover:bg-muted p-0.5" aria-label={`Remove tag ${tag}`}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Reading Time (minutes)</Label>
          <Input
            type="number"
            className="w-32"
            value={form.reading_time_minutes}
            onChange={e => setForm(f => ({...f, reading_time_minutes: e.target.value}))}
            placeholder="Auto"
          />
        </div>
      </div>
    </div>
  );
}
