import { getUsesItems } from "@/lib/queries/uses";
import { constructMetadata } from "@/lib/seo";
import type { UsesItem } from "@/types/database";

export const metadata = constructMetadata({
  title: "Uses",
  description: "The tools, hardware, and software Ashiqur Rahman Shohan uses daily.",
});

export default async function UsesPage() {
  const items = await getUsesItems();

  const grouped = items.reduce<Record<string, UsesItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-3">Uses</h1>
      <p className="text-muted-foreground mb-10">
        The tools and hardware I use day-to-day.
      </p>
      <div className="space-y-10">
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <section key={category}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{category}</h2>
            <ul className="space-y-4">
              {categoryItems.map((item) => (
                <li key={item.id} className="flex flex-col gap-0.5">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-brand transition-colors">
                      {item.name}
                    </a>
                  ) : (
                    <span className="font-medium">{item.name}</span>
                  )}
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
