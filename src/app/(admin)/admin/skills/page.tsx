"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { createSkill, deleteSkill } from "@/lib/actions/skills";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { Skill, SkillCategory } from "@/types/database";

const categories: SkillCategory[] = ["language","framework","database","devops","cloud","tool","other"];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", category: "tool" as SkillCategory, proficiency: 3, icon_slug: "" });

  const fetchSkills = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("skills").select("*").order("sort_order");
    setSkills((data as Skill[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const handleAdd = async () => {
    if (!newSkill.name) return;
    setAdding(true);
    const result = await createSkill({ ...newSkill, sort_order: skills.length });
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Skill added!");
      setNewSkill({ name: "", category: "tool", proficiency: 3, icon_slug: "" });
      fetchSkills();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    await deleteSkill(id);
    toast.success("Skill deleted");
    fetchSkills();
  };

  if (loading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold">Skills</h1>

      {/* Add form */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <p className="text-sm font-medium">Add Skill</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name *</Label>
            <Input value={newSkill.name} onChange={e => setNewSkill(s => ({...s, name: e.target.value}))} placeholder="e.g. Python" />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={newSkill.category} onValueChange={(v) => setNewSkill(s => ({...s, category: v as SkillCategory}))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Proficiency (1–5)</Label>
            <Input type="number" min={1} max={5} value={newSkill.proficiency} onChange={e => setNewSkill(s => ({...s, proficiency: Number(e.target.value)}))} />
          </div>
          <div className="space-y-1.5">
            <Label>Icon Slug (Simple Icons)</Label>
            <Input value={newSkill.icon_slug} onChange={e => setNewSkill(s => ({...s, icon_slug: e.target.value}))} placeholder="e.g. python" />
          </div>
        </div>
        <Button onClick={handleAdd} disabled={adding}>
          {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Add Skill
        </Button>
      </div>

      {/* Skills list */}
      <div className="space-y-2">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="font-medium text-sm">{skill.name}</span>
              <Badge variant="secondary" className="text-xs">{skill.category}</Badge>
              <span className="text-xs text-muted-foreground font-mono">{skill.proficiency}/5</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => handleDelete(skill.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
