import { ContactForm } from "@/components/sections/contact-form";
import { constructMetadata } from "@/lib/seo";
import { getProfile } from "@/lib/queries/profile";
import { Mail, MapPin } from "lucide-react";

export const metadata = constructMetadata({
  title: "Contact",
  description: "Get in touch with Ashiqur Rahman Shohan.",
});

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-3">Get in Touch</h1>
      <p className="text-muted-foreground mb-12 max-w-md">
        Whether you have a project in mind, a question, or just want to say hi — my inbox is open.
      </p>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Info */}
        <div className="space-y-6">
          {profile?.email_public && (
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-0.5 text-brand shrink-0" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <a href={`mailto:${profile.email_public}`} className="text-sm text-muted-foreground hover:text-brand transition-colors">
                  {profile.email_public}
                </a>
              </div>
            </div>
          )}
          {profile?.location && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-brand shrink-0" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{profile.location}</p>
              </div>
            </div>
          )}
          {profile?.availability_status === "open" && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-sm font-medium text-emerald-400">Open to opportunities</p>
              <p className="text-xs text-muted-foreground mt-1">
                {profile.availability_message ?? "Available for freelance and full-time roles."}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <ContactForm />
      </div>
    </div>
  );
}
