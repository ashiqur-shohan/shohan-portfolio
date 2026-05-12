import { getExperiences } from "@/lib/queries/experience";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Experience",
  description: "Work history and professional experience of Ashiqur Rahman Shohan.",
});

export default async function ExperiencePage() {
  const experiences = await getExperiences();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Experience</h1>
      <p className="text-muted-foreground mb-10">My professional journey.</p>
      <ExperienceTimeline experiences={experiences} />
    </div>
  );
}
