"use server";

import { Resend } from "resend";

import { siteConfig } from "@/lib/site-config";
import { contactSchema } from "@/lib/validations/contact";

export type ContactResult = { ok: boolean; message: string };

export async function sendContactMessage(
  values: unknown,
): Promise<ContactResult> {
  // Re-validate on the server — never trust the client (CLAUDE.md convention).
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: "Please check the form and try again." };
  }

  const { name, email, message, company } = parsed.data;

  // Honeypot tripped: pretend success so the bot learns nothing, send nothing.
  if (company && company.trim().length > 0) {
    return { ok: true, message: "Thanks! Your message has been sent." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    console.error(
      "[contact] Missing RESEND_API_KEY or CONTACT_TO_EMAIL — email not sent.",
    );
    return {
      ok: false,
      message: `Email isn't configured yet — please reach me at ${siteConfig.email}.`,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      // TODO: replace with a sender on your Resend-verified domain.
      from: `${siteConfig.name} <onboarding@resend.dev>`,
      to,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return {
        ok: false,
        message: "Something went wrong sending your message. Please try again.",
      };
    }

    return {
      ok: true,
      message: "Thanks! Your message has been sent — I'll reply soon.",
    };
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return {
      ok: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
