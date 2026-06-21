import Link from "next/link";

import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

export function ContactCta() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <div className="border-border bg-muted/40 rounded-2xl border px-6 py-12 text-center sm:px-12">
        <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          Let&apos;s build something
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-md">
          Have a project in mind or a role to fill? I&apos;d love to hear about
          it.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/contact">Start a conversation</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={`mailto:${siteConfig.email}`}>Email me</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
