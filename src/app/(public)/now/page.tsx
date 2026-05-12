import { getCurrentNow } from "@/lib/queries/now";
import { constructMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

export const metadata = constructMetadata({
  title: "Now",
  description: "What Ashiqur Rahman Shohan is focused on right now.",
});

export default async function NowPage() {
  const entry = await getCurrentNow();
  if (!entry) notFound();

  const updatedAt = new Date(entry.updated_at).toLocaleDateString("en-US", {
    month: "long", year: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <p className="font-mono text-sm text-brand mb-2">now /</p>
      <h1 className="text-3xl font-bold tracking-tight mb-2">What I&apos;m doing now</h1>
      <p className="text-xs text-muted-foreground font-mono mb-10">Updated {updatedAt}</p>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {entry.content.split("\n").map((line, i) => {
          if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold mt-6 mb-2">{line.slice(3)}</h2>;
          if (line.startsWith("- ")) return <li key={i} className="text-muted-foreground ml-4 list-disc">{line.slice(2)}</li>;
          if (line.trim() === "") return <div key={i} className="h-3" />;
          return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
        })}
      </div>
      <p className="mt-12 text-xs text-muted-foreground border-t border-border pt-4">
        A <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">now page</a> is a snapshot of what someone is focused on at this point in their life.
      </p>
    </div>
  );
}
