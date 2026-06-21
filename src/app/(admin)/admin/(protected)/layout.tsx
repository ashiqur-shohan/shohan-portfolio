import { requireAdmin } from "@/lib/auth";
import { AdminMobileHeader } from "@/components/admin/admin-mobile-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side gate (defense in depth alongside proxy.ts + RLS).
  await requireAdmin();

  return (
    <div className="bg-background flex min-h-dvh">
      <AdminSidebar className="hidden md:flex" />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
