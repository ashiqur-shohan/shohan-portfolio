import { redirect } from "next/navigation";

// Contact now lives in the single-scroll homepage (#contact section).
export default function ContactPage() {
  redirect("/#contact");
}
