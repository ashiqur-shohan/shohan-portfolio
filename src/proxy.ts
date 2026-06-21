import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next 16 proxy (formerly "middleware"). Refreshes the Supabase session and
 * gates `/admin/*`: only the single allowlisted ADMIN_EMAIL may proceed;
 * everyone else is sent to /admin/login. (CLAUDE.md hard rule #2 — access is
 * enforced here AND in the admin layout / RLS, never by UI hiding alone.)
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Supabase not configured yet: allow only the login page through.
  if (!supabaseUrl || !supabasePublishableKey) {
    if (!isLoginRoute) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  let isAdmin = false;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isAdmin = !!user && user.email === process.env.ADMIN_EMAIL;
  } catch {
    isAdmin = false;
  }

  // Signed-in admin on the login page -> dashboard.
  if (isLoginRoute && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Anyone else on a protected /admin route -> login.
  if (!isLoginRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
