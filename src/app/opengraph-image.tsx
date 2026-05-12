import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ashiqur Rahman Shohan — Software & DevOps Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "oklch(0.14 0.005 240)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 16,
            color: "oklch(0.75 0.16 175)",
            margin: 0,
            marginBottom: 16,
            letterSpacing: "0.05em",
          }}
        >
          shohan.dev
        </p>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "oklch(0.97 0.005 240)",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Ashiqur Rahman Shohan
        </h1>
        <p
          style={{
            fontSize: 28,
            color: "oklch(0.75 0.16 175)",
            margin: 0,
            marginTop: 16,
          }}
        >
          Software Engineer &amp; DevOps Engineer
        </p>
      </div>
    ),
    { ...size }
  );
}
