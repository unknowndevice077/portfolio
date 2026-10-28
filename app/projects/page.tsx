import { redirect } from "next/navigation";

// the work index lives on the home page now
export default function ProjectsPage() {
  redirect("/");
}
