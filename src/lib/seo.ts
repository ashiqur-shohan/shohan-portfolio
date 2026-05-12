import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shohan.dev";

export function constructMetadata({
  title,
  description,
  image = "/og-default.png",
  noIndex = false,
}: {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}

export { baseUrl };
