import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-foreground font-semibold tracking-tight"
          >
            Ashiqur Rahman Shohan
          </Link>
          {/* Full nav (About · Projects · Blog · Contact) is added in Phase 1. */}
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 text-sm sm:px-6">
          <span>© {new Date().getFullYear()} Ashiqur Rahman Shohan</span>
          <span>Built with Next.js</span>
        </div>
      </footer>
    </div>
  );
}
