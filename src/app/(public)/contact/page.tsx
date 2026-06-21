import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { ContactForm } from "@/components/contact-form";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
};

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Get in touch
        </h1>
        <p className="text-muted-foreground mt-3">
          Have a project, a role, or a question? Send a message and I&apos;ll
          get back to you.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ContactForm />

        <aside className="space-y-6">
          <div className="space-y-3">
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-muted-foreground hover:text-foreground flex items-center gap-3 text-sm transition-colors"
            >
              <Mail className="size-5 shrink-0" />
              {siteConfig.email}
            </a>
            <p className="text-muted-foreground flex items-center gap-3 text-sm">
              <MapPin className="size-5 shrink-0" />
              {siteConfig.location}
            </p>
          </div>

          <Separator />

          <div className="flex items-center gap-2">
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
        </aside>
      </div>
    </section>
  );
}
