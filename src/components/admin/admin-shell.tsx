"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, User, List, Briefcase, GraduationCap,
  Award, FileText, BookOpen, Wrench, Server, MessageSquare,
  Settings, LogOut
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard",      label: "Dashboard",      icon: LayoutDashboard },
  { href: "/admin/profile",        label: "Profile",        icon: User },
  { href: "/admin/skills",         label: "Skills",         icon: List },
  { href: "/admin/experience",     label: "Experience",     icon: Briefcase },
  { href: "/admin/education",      label: "Education",      icon: GraduationCap },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/projects",       label: "Projects",       icon: FileText },
  { href: "/admin/blog",           label: "Blog",           icon: BookOpen },
  { href: "/admin/now",            label: "Now",            icon: Server },
  { href: "/admin/uses",           label: "Uses",           icon: Wrench },
  { href: "/admin/messages",       label: "Messages",       icon: MessageSquare },
  { href: "/admin/settings",       label: "Settings",       icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/" className="font-mono text-sm font-semibold text-brand">shohan.dev</Link>
          <span className="ml-2 rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">admin</span>
        </div>
        <nav className="flex-1 overflow-auto py-3 px-2">
          <ul className="space-y-0.5">
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    pathname.startsWith(href)
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-border p-2">
          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-2.5 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b border-border px-4 lg:hidden">
          <Link href="/" className="font-mono text-sm font-semibold text-brand">shohan.dev</Link>
          <span className="ml-2 text-xs text-muted-foreground">/ admin</span>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
