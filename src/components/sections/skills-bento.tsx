import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Skill, SkillCategory } from "@/types/database";

interface SkillsBentoProps {
  skills: Skill[];
}

const categoryLabels: Record<SkillCategory, string> = {
  language:  "Languages",
  framework: "Frameworks",
  database:  "Databases",
  devops:    "DevOps",
  cloud:     "Cloud",
  tool:      "Tools",
  other:     "Other",
};

const categoryOrder: SkillCategory[] = [
  "language", "framework", "database", "devops", "cloud", "tool", "other"
];

function ProficiencyDots({ level }: { level: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`Proficiency: ${level} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i < level ? "bg-brand" : "bg-border"}`}
        />
      ))}
    </span>
  );
}

export function SkillsBento({ skills }: SkillsBentoProps) {
  const grouped = categoryOrder.reduce<Record<string, Skill[]>>((acc, cat) => {
    const items = skills.filter((s) => s.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight mb-8">Skills &amp; Stack</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(grouped).map(([cat, items]) => (
            <Card key={cat} className="bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {categoryLabels[cat as SkillCategory]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2">
                  {items.map((skill) => (
                    <li key={skill.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <ProficiencyDots level={skill.proficiency} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
