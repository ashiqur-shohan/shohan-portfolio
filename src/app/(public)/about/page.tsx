import { getProfile } from "@/lib/queries/profile";
import { getEducation } from "@/lib/queries/education";
import { constructMetadata } from "@/lib/seo";
import { GraduationCap, MapPin } from "lucide-react";
import { notFound } from "next/navigation";

export const metadata = constructMetadata({
  title: "About",
  description: "About Ashiqur Rahman Shohan — Software & DevOps Engineer based in Bangladesh.",
});

export default async function AboutPage() {
  const [profile, education] = await Promise.all([getProfile(), getEducation()]);
  if (!profile) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-8">About</h1>

      {profile.bio && (
        <div className="prose prose-neutral dark:prose-invert max-w-none mb-12">
          {profile.bio.split("\n").map((line, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>
          ))}
        </div>
      )}

      {/* Location */}
      {profile.location && (
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-brand shrink-0" />
          {profile.location}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-brand" />
            Education
          </h2>
          <ul className="space-y-6">
            {education.map((edu) => (
              <li key={edu.id} className="border-l-2 border-brand pl-5">
                <p className="font-semibold">{edu.degree} in {edu.field_of_study}</p>
                <p className="text-brand text-sm font-medium">{edu.institution}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  {new Date(edu.start_date).getFullYear()} — {edu.end_date ? new Date(edu.end_date).getFullYear() : "Present"}
                  {edu.gpa && ` · GPA: ${edu.gpa}`}
                </p>
                {edu.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{edu.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
