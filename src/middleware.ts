import { NextResponse } from "next/server";

/**
 * Phase 0 stub. `/admin` is matched here so the gate exists from day one.
 * Real auth (Supabase session + a single allowlisted ADMIN_EMAIL) is wired in
 * Phase 2 — see CLAUDE.md hard rule #2.
 */
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
