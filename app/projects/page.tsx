import type { Metadata } from "next";
import SiteShell, { PageHeading } from "../components/SiteShell";
import ProjectGrid from "../components/ProjectGrid";

export const metadata: Metadata = { title: "Projects — Fritz Dela Cruz" };

export default function ProjectsPage() {
  return (
    <SiteShell>
      <PageHeading title="Projects" note="Filter by area, open Details for the full write-up, or jump straight to the code or live demo." />
      <ProjectGrid />
      <p className="text-sm text-[var(--text-faint)] pt-8">
        Plus 12+ additional repos: EcoVision Smartpole, a wall-climbing robot, VA Hub (client/invoicing workspace for
        virtual assistants), LeadPilot (job-board matching), a motorshop inventory system, and embedded builds (fire
        alarms, toll gates, energy harvesting).
      </p>
    </SiteShell>
  );
}
