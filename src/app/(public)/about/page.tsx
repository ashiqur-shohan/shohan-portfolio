import { redirect } from "next/navigation";

// The About content now lives in the single-scroll homepage (#about section).
export default function AboutPage() {
  redirect("/#about");
}
