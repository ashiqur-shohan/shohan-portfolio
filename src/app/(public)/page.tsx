import { ContactCta } from "@/components/sections/contact-cta";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Hero } from "@/components/sections/hero";
import { LatestPosts } from "@/components/sections/latest-posts";
import { Skills } from "@/components/sections/skills";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <LatestPosts />
      <Skills />
      <ContactCta />
    </>
  );
}
