"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Projects", href: "/admin/projects", icon: FolderKanban },
];

export function AdminSidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        "border-border bg-card w-60 shrink-0 flex-col border-r",
        className,
      )}
    >
      <div className="border-border flex h-16 items-center border-b px-6">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="text-foreground font-semibold tracking-tight"
        >
          Admin
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Admin">
        {links.map(({ title, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={isActive(href) ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(href)
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {title}
          </Link>
        ))}
      </nav>

      <div className="border-border flex flex-col gap-1 border-t p-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground justify-start"
        >
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4" /> View site
          </Link>
        </Button>
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-muted-foreground w-full justify-start"
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
