import type { MetadataRoute } from "next";

import { listPublished as listPublishedPosts } from "@/lib/data/posts";
import { listPublished as listPublishedProjects } from "@/lib/data/projects";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/projects", priority: 0.8 },
    { path: "/blog", priority: 0.5 },
    { path: "/contact", priority: 0.7 },
  ].map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority,
  }));

  const [projects, posts] = await Promise.all([
    listPublishedProjects(),
    listPublishedPosts(),
  ]);

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
