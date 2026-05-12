"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { toast } from "sonner";
import { upsertProfile } from "@/lib/actions/profile";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import type { Profile } from "@/types/database";

const schema = z.object({
  full_name:            z.string().min(1),
  headline:             z.string().min(1),
  bio:                  z.string().optional(),
  location:             z.string().min(1),
  availability_status:  z.enum(["open", "limited", "closed"]),
  availability_message: z.string().optional(),
  email_public:         z.string().optional(),
  resume_url:           z.string().optional(),
  github:               z.string().optional(),
  linkedin:             z.string().optional(),
  twitter:              z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.from("profile").select("*").single().then(({ data }) => {
      if (data) {
        const p = data as Profile;
        reset({
          full_name:            p.full_name,
          headline:             p.headline,
          bio:                  p.bio ?? "",
          location:             p.location,
          availability_status:  p.availability_status,
          availability_message: p.availability_message ?? "",
          email_public:         p.email_public ?? "",
          resume_url:           p.resume_url ?? "",
          github:               (p.social_links as Record<string, string>)?.github ?? "",
          linkedin:             (p.social_links as Record<string, string>)?.linkedin ?? "",
          twitter:              (p.social_links as Record<string, string>)?.twitter ?? "",
        });
      }
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    const result = await upsertProfile({
      full_name:            values.full_name,
      headline:             values.headline,
      bio:                  values.bio,
      location:             values.location,
      availability_status:  values.availability_status,
      availability_message: values.availability_message,
      email_public:         values.email_public,
      resume_url:           values.resume_url,
      social_links: {
        github:   values.github,
        linkedin: values.linkedin,
        twitter:  values.twitter,
      },
    });
    setSaving(false);
    if (result?.error) toast.error(result.error);
    else toast.success("Profile updated!");
  };

  if (loading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input id="full_name" {...register("full_name")} />
            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">Location *</Label>
            <Input id="location" {...register("location")} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="headline">Headline *</Label>
          <Input id="headline" {...register("headline")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={5} {...register("bio")} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Availability</Label>
            <Select
              value={watch("availability_status")}
              onValueChange={(v) => setValue("availability_status", v as "open" | "limited" | "closed")}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="availability_message">Availability Message</Label>
            <Input id="availability_message" {...register("availability_message")} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="email_public">Public Email</Label>
            <Input id="email_public" type="email" {...register("email_public")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="resume_url">Resume URL</Label>
            <Input id="resume_url" type="url" placeholder="https://..." {...register("resume_url")} />
          </div>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Social Links</legend>
          <div className="space-y-2">
            <Input placeholder="GitHub URL" {...register("github")} />
            <Input placeholder="LinkedIn URL" {...register("linkedin")} />
            <Input placeholder="Twitter/X URL" {...register("twitter")} />
          </div>
        </fieldset>

        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? "Saving…" : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
