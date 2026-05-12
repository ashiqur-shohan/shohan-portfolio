import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://shohan.dev"
  ),
  title: {
    default: "Ashiqur Rahman Shohan — Software & DevOps Engineer",
    template: "%s | Ashiqur Rahman Shohan",
  },
  description:
    "Software Engineer and DevOps Engineer specialising in Laravel, Django, FastAPI, React, Next.js, and cloud infrastructure. Open to opportunities.",
  keywords: [
    "Software Engineer",
    "DevOps Engineer",
    "Full Stack Developer",
    "Laravel",
    "Django",
    "FastAPI",
    "React",
    "Next.js",
    "Bangladesh",
  ],
  authors: [{ name: "Ashiqur Rahman Shohan" }],
  creator: "Ashiqur Rahman Shohan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Ashiqur Rahman Shohan",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@shohan_dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    types: {
      "application/rss+xml": `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://shohan.dev"}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            {children}
            <Toaster richColors closeButton position="bottom-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
