import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "That name is a little long."),
  email: z.email("Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "Your message is a little short.")
    .max(2000, "Please keep your message under 2000 characters."),
  // Honeypot — real visitors never see or fill this; bots do.
  company: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
