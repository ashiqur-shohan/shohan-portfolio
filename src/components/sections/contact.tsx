import { Mail, MapPin, Clock } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { ContactForm } from "@/components/contact-form";

/**
 * Contact section (mock #contact): two columns — left heading + intro + details
 * (email, location, availability); right the Resend-backed form. Details are
 * static config; the form is the existing client component.
 */
export function Contact() {
  const details = [
    {
      icon: Mail,
      label: "Email",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    { icon: MapPin, label: "Location", value: siteConfig.location },
    { icon: Clock, label: "Availability", value: siteConfig.contact.availability },
  ];

  return (
    <section id="contact" className="scroll-mt-16 py-[72px]">
      <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 items-start gap-12 px-6 md:grid-cols-2">
        <div>
          <div className="text-primary font-mono text-xs tracking-[0.12em] uppercase">
            Contact
          </div>
          <h2 className="font-display mt-2.5 text-[clamp(30px,5vw,46px)] font-bold leading-[1.05]">
            {siteConfig.contact.heading}
            <br />
            <span className="text-primary">{siteConfig.contact.headingAccent}</span>
          </h2>
          <p className="text-muted-foreground my-6 max-w-md">
            {siteConfig.contact.intro}
          </p>
          <div className="flex flex-col gap-3.5">
            {details.map(({ icon: Icon, label, value, href }) => {
              const body = (
                <>
                  <span className="border-border text-primary grid size-[38px] shrink-0 place-items-center rounded-[10px] border">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span>
                    <small className="text-muted-foreground block font-mono text-[11px]">
                      {label}
                    </small>
                    {value}
                  </span>
                </>
              );
              return href ? (
                <a
                  key={label}
                  href={href}
                  className="hover:text-primary flex items-center gap-3 text-sm transition-colors"
                >
                  {body}
                </a>
              ) : (
                <div key={label} className="flex items-center gap-3 text-sm">
                  {body}
                </div>
              );
            })}
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
