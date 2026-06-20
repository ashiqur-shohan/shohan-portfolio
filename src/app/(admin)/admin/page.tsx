export default function AdminPage() {
  return (
    <div className="bg-background flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-foreground text-2xl font-semibold">Admin</h1>
      <p className="text-muted-foreground max-w-md">
        Private admin panel — authentication and content management arrive in
        Phase 2. This route is already matched by the middleware gate.
      </p>
    </div>
  );
}
