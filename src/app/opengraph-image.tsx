import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * NOTE: next/og renders with Satori, which cannot read CSS variables or
 * Tailwind classes — only inline styles with literal values. The colors below
 * intentionally mirror the Neo Tech Mint theme tokens in src/app/globals.css.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0B1120", // --background (dark)
        color: "#F8FAFC", // --foreground
      }}
    >
      <div
        style={{
          fontSize: 30,
          fontWeight: 600,
          color: "#10B981", // --primary (emerald)
        }}
      >
        {siteConfig.role}
      </div>
      <div
        style={{
          fontSize: 68,
          fontWeight: 700,
          marginTop: 12,
          lineHeight: 1.1,
        }}
      >
        {siteConfig.name}
      </div>
      <div
        style={{
          fontSize: 30,
          marginTop: 28,
          maxWidth: 820,
          color: "#94A3B8", // --muted-foreground (dark)
        }}
      >
        {siteConfig.tagline}
      </div>
    </div>,
    { ...size },
  );
}
