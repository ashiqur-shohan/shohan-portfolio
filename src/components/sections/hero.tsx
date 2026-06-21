import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
      <p className="text-primary text-sm font-medium">{siteConfig.role}</p>
      <h1 className="text-foreground mt-3 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
        {siteConfig.tagline}
      </h1>
      <p className="text-muted-foreground mt-5 max-w-xl text-lg">
        {siteConfig.description}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button asChild size="lg">
          <Link href="/projects">
            View work <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/contact">Get in touch</Link>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <a href={siteConfig.resumeUrl} download>
            <Download className="size-4" /> Resume
          </a>
        </Button>
      </div>

      <div className="mt-8 flex items-center gap-2">
        <a
          href={siteConfig.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors"
        >
          <GitHubIcon className="size-5" />
        </a>
        <a
          href={siteConfig.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors"
        >
          <LinkedInIcon className="size-5" />
        </a>
      </div>
    </section>
  );
}
