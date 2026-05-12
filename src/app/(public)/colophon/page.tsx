import { getColophonItems, getSiteSettings } from "@/lib/queries/colophon";
import { constructMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import type { ColophonItem, ColophonLayer } from "@/types/database";

export const metadata = constructMetadata({
  title: "Colophon",
  description: "What this site is built with — the tech stack, hosting, and tools.",
});

const layerLabels: Record<ColophonLayer, string> = {
  framework:  "Framework",
  hosting:    "Hosting",
  database:   "Database",
  ci:         "CI / CD",
  monitoring: "Monitoring",
  dns:        "DNS",
  other:      "Other",
};

const layerOrder: ColophonLayer[] = [
  "framework", "hosting", "database", "ci", "monitoring", "dns", "other"
];

export default async function ColophonPage() {
  const [items, settings] = await Promise.all([getColophonItems(), getSiteSettings()]);

  const grouped = layerOrder.reduce<Record<string, ColophonItem[]>>((acc, layer) => {
    const layerItems = items.filter((i) => i.layer === layer);
    if (layerItems.length > 0) acc[layer] = layerItems;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-3">Colophon</h1>
      <p className="text-muted-foreground mb-10">
        What this site is built with. As a DevOps engineer, I believe the stack should be as observable as the app.
      </p>

      {settings?.uptime_badge_url && (
        <div className="mb-10 rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium mb-2">Site Uptime</p>
          <a href={settings.uptime_badge_url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand hover:underline">
            Check status →
          </a>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(grouped).map(([layer, layerItems]) => (
          <section key={layer}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {layerLabels[layer as ColophonLayer]}
            </h2>
            <ul className="space-y-3">
              {layerItems.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4">
                  <div>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-brand transition-colors text-sm">
                        {item.name}
                      </a>
                    ) : (
                      <span className="font-medium text-sm">{item.name}</span>
                    )}
                    {item.notes && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.notes}</p>
                    )}
                  </div>
                  {item.version && (
                    <Badge variant="outline" className="font-mono text-xs shrink-0">{item.version}</Badge>
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
