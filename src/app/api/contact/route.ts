import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ContactInsert = Database["public"]["Tables"]["contact_messages"]["Insert"];

const schema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email().max(200),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const supabase = await createClient();
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex");

    const insertData: ContactInsert = {
      name: data.name,
      email: data.email,
      subject: data.subject ?? null,
      message: data.message,
      ip_hash: ipHash,
      user_agent: req.headers.get("user-agent") ?? null,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from("contact_messages").insert(insertData as any);

    if (error) throw error;

    // Send email via Resend if configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "contact@shohan.dev",
          to:   process.env.RESEND_TO_EMAIL ?? "hello@shohan.dev",
          subject: `Portfolio contact: ${data.subject ?? "(no subject)"}`,
          text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
        });
      } catch {
        // Email failure is non-fatal — message is stored in DB
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
