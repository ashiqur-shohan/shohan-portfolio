"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { siteConfig } from "@/lib/site-config";

/** Brand wordmark — the part after the first dot renders in the primary color. */
function Brand({ className }: { className?: string }) {
  const i = siteConfig.brand.indexOf(".");
  const main = i === -1 ? siteConfig.brand : siteConfig.brand.slice(0, i);
  const suffix = i === -1 ? "" : siteConfig.brand.slice(i);
  return (
    <Link href="/" className={className}>
      {main}
      <span className="text-primary">{suffix}</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-[10px]">
      <div className="mx-auto flex h-16 w-full max-w-[1080px] items-center justify-between px-6">
        <Brand className="font-display text-[17px] font-semibold" />

        {/* Desktop nav */}
        <nav
          className="text-muted-foreground hidden items-center gap-6 text-sm md:flex"
          aria-label="Main"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.title}
            </Link>
          ))}
          <a
            href={siteConfig.resumeUrl}
            download
            aria-label="Download résumé"
            className="border-border text-foreground hover:border-primary hover:text-primary rounded-lg border px-[15px] py-[7px] font-semibold transition-colors"
          >
            Résumé
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="border-border text-foreground grid size-10 place-items-center rounded-lg border md:hidden"
        >
          {open ? <X className="size-[22px]" /> : <Menu className="size-[22px]" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open ? (
        <nav
          id="mobile-nav"
          className="border-border bg-background flex flex-col border-b px-6 pt-2 pb-[18px] shadow-lg md:hidden"
          aria-label="Mobile"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="border-border text-muted-foreground hover:text-foreground border-b py-3 transition-colors last:border-b-0"
            >
              {item.title}
            </Link>
          ))}
          <a
            href={siteConfig.resumeUrl}
            download
            onClick={close}
            aria-label="Download résumé"
            className="border-primary text-primary mt-3 rounded-lg border py-3 text-center font-semibold"
          >
            Résumé
          </a>
        </nav>
      ) : null}
    </header>
  );
}
