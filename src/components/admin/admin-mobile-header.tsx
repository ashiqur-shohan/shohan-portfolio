"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminMobileHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="border-border flex h-16 items-center justify-between border-b px-4 md:hidden">
      <Link href="/admin" className="font-semibold tracking-tight">
        Admin
      </Link>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin menu</SheetTitle>
            <SheetDescription>Admin navigation</SheetDescription>
          </SheetHeader>
          <AdminSidebar
            className="flex h-full w-full border-r-0"
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </header>
  );
}
