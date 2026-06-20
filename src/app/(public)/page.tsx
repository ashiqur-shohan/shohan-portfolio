import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-4 py-24 sm:px-6 sm:py-32">
      <span className="border-border bg-muted text-muted-foreground inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
        Phase 0 · scaffold complete
      </span>

      <h1 className="text-foreground max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Hi, I&apos;m Ashiqur — I build fast, accessible web apps.
      </h1>

      <p className="text-muted-foreground max-w-xl text-lg">
        The full marketing site lands in Phase 1. This placeholder confirms the
        design system, semantic color tokens, and light/dark theming are wired
        up correctly.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href="/admin">View admin stub</Link>
        </Button>
        <Button asChild variant="outline">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </Button>
      </div>

      {/* Token sanity strip — a quick visual check that every status token
          resolves correctly in both light and dark mode. */}
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="bg-primary text-primary-foreground rounded-md px-3 py-1 text-sm">
          primary
        </span>
        <span className="bg-accent text-accent-foreground rounded-md px-3 py-1 text-sm">
          accent
        </span>
        <span className="bg-success text-success-foreground rounded-md px-3 py-1 text-sm">
          success
        </span>
        <span className="bg-info text-info-foreground rounded-md px-3 py-1 text-sm">
          info
        </span>
        <span className="bg-warning text-warning-foreground rounded-md px-3 py-1 text-sm">
          warning
        </span>
        <span className="bg-destructive text-destructive-foreground rounded-md px-3 py-1 text-sm">
          destructive
        </span>
      </div>
    </section>
  );
}
