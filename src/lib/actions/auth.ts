"use server";

import { redirect } from "next/navigation";

import { signInWithPassword, signOut as authSignOut } from "@/lib/auth";
import { signInSchema } from "@/lib/validations/auth";

export type AuthResult = { ok: boolean; message: string };

export async function signIn(input: unknown): Promise<AuthResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Enter a valid email and password." };
  }

  const { email, password } = parsed.data;

  // Only the single allowlisted admin may even attempt to sign in.
  if (!process.env.ADMIN_EMAIL || email !== process.env.ADMIN_EMAIL) {
    return { ok: false, message: "This account is not authorized." };
  }

  try {
    const { ok } = await signInWithPassword(email, password);
    if (!ok) return { ok: false, message: "Invalid email or password." };
    return { ok: true, message: "Signed in." };
  } catch (err) {
    console.error("[auth] signIn failed:", err);
    return { ok: false, message: "Sign-in is unavailable right now." };
  }
}

export async function signOut(): Promise<void> {
  await authSignOut();
  redirect("/admin/login");
}
