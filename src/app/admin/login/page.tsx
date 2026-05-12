"use client";
import { useState } from "react";
import { signInWithEmail } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const result = await signInWithEmail(email);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      setSent(true);
      toast.success("Check your email for the sign-in link!");
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="font-mono text-sm text-brand mb-1">shohan.dev</p>
          <h1 className="text-2xl font-bold">Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {sent ? "Magic link sent — check your inbox." : "Enter your email to receive a sign-in link."}
          </p>
        </div>
        {!sent && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
              {loading ? "Sending…" : "Send Magic Link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
