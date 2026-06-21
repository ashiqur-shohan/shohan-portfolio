import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import { Skills } from "@/components/sections/skills";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — ${siteConfig.role} based in ${siteConfig.location}.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          {siteConfig.about.headline}
        </h1>
        <div className="text-muted-foreground mt-6 space-y-4 text-lg leading-relaxed">
          {siteConfig.about.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>
      <Skills />
    </>
  );
}
