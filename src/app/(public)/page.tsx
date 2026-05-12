import { Hero } from "@/components/sections/hero";
import { SkillsBento } from "@/components/sections/skills-bento";
import { ProjectCard } from "@/components/sections/project-card";
import { BlogCard } from "@/components/sections/blog-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProfile } from "@/lib/queries/profile";
import { getSkills } from "@/lib/queries/skills";
import { getFeaturedProjects } from "@/lib/queries/projects";
import { getLatestBlogPosts } from "@/lib/queries/blog";
import { getCurrentNow } from "@/lib/queries/now";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Ashiqur Rahman Shohan — Software & DevOps Engineer",
  description: "Software Engineer and DevOps Engineer. Laravel, Django, FastAPI, React, Next.js, and cloud infrastructure.",
});

export default async function HomePage() {
  const [profile, skills, featuredProjects, latestPosts, nowEntry] =
    await Promise.all([
      getProfile(),
      getSkills(),
      getFeaturedProjects(),
      getLatestBlogPosts(3),
      getCurrentNow(),
    ]);

  if (!profile) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <p className="text-muted-foreground">Setting up portfolio…</p>
      </div>
    );
  }

  return (
    <>
      <Hero profile={profile} />

      {skills.length > 0 && <SkillsBento skills={skills} />}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
              <Button variant="ghost" size="sm" render={<Link href="/projects" />}>
                All Projects <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Latest blog */}
      {latestPosts.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Latest Writing</h2>
              <Button variant="ghost" size="sm" render={<Link href="/blog" />}>
                All Posts <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((p) => <BlogCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Now */}
      {nowEntry && (
        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-base font-semibold text-brand mb-3 font-mono">now /</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                {nowEntry.content.replace(/^#+\s.*/gm, "").trim()}
              </p>
              <Button variant="ghost" size="sm" className="mt-4 px-0 text-brand" render={<Link href="/now" />}>
                Read more <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Let&apos;s build something together</h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Open to freelance projects, full-time roles, and interesting conversations.
          </p>
          <Button className="mt-6" render={<Link href="/contact" />}>
            Get in Touch <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </section>
    </>
  );
}
