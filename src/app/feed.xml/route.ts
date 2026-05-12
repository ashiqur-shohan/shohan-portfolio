import { getBlogPosts } from "@/lib/queries/blog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shohan.dev";

export async function GET() {
  const posts = await getBlogPosts();

  const items = posts
    .map((p) => {
      const pubDate = p.published_at ? new Date(p.published_at).toUTCString() : new Date().toUTCString();
      return `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${BASE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${BASE}/blog/${p.slug}</guid>
      <description><![CDATA[${p.excerpt ?? ""}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${p.tags.map((t) => `<category>${t}</category>`).join("\n      ")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ashiqur Rahman Shohan — Blog</title>
    <link>${BASE}</link>
    <description>Engineering articles on backend, DevOps, and tooling.</description>
    <language>en-us</language>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
