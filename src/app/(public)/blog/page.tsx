import type { Metadata } from "next";
import { Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building for the web — coming soon.",
};

export default function BlogPage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
        <Newspaper className="size-6" />
      </div>
      <h1 className="text-foreground mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
        Blog
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md">
        I&apos;m putting together writing on what I build and learn. Posts are
        coming soon — check back shortly.
      </p>
    </section>
  );
}
