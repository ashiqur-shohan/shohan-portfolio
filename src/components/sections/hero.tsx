import Link from "next/link";
import { MapPin, Download, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types/database";

interface HeroProps {
  profile: Profile;
}

const availabilityConfig = {
  open:    { label: "Available for opportunities", color: "bg-emerald-500" },
  limited: { label: "Limited availability",         color: "bg-amber-500" },
  closed:  { label: "Not available",                color: "bg-red-500" },
};

export function Hero({ profile }: HeroProps) {
  const availability = availabilityConfig[profile.availability_status];

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Availability badge */}
        <div className="mb-8 flex">
          <Badge
            variant="outline"
            className="gap-2 rounded-full border-border px-3 py-1 text-xs text-muted-foreground"
          >
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${availability.color}`}
            >
              {profile.availability_status === "open" && (
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${availability.color}`}
                />
              )}
            </span>
            {profile.availability_message ?? availability.label}
          </Badge>
        </div>

        {/* Name + headline */}
        <div className="max-w-3xl">
          <p className="font-mono text-sm text-muted-foreground mb-2">Hi, I&apos;m</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {profile.full_name}
          </h1>
          <p className="mt-3 text-2xl font-semibold text-brand sm:text-3xl">
            {profile.headline}
          </p>

          {/* Location */}
          <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            {profile.location}
          </p>

          {/* Bio excerpt */}
          {profile.bio && (
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-xl">
              {profile.bio.slice(0, 180)}
              {profile.bio.length > 180 && "…"}
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button render={<Link href="/projects" />}>
            View Projects
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>

          {profile.resume_url && (
            <Button
              variant="outline"
              render={
                <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" />
              }
            >
              <Download className="mr-1.5 h-4 w-4" />
              Resume
            </Button>
          )}

          {profile.email_public && (
            <Button
              variant="ghost"
              size="icon"
              render={<a href={`mailto:${profile.email_public}`} aria-label="Send email" />}
            >
              <Mail className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
