import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Education } from "@/components/sections/education";
import { Certifications } from "@/components/sections/certifications";
import { Skills } from "@/components/sections/skills";
import { GithubActivity } from "@/components/sections/github-activity";
import { Testimonials } from "@/components/sections/testimonials";
import { LatestPosts } from "@/components/sections/latest-posts";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Education />
      <Certifications />
      <Skills />
      <GithubActivity />
      <Testimonials />
      <LatestPosts />
      <Contact />
    </>
  );
}
