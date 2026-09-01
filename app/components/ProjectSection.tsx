"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Project } from "../data/projects";
import {
  EcoVisionVisual,
  StudiaVisual,
  QuestScribeVisual,
  AurumVisual,
  NotionAIVisual,
} from "./ProjectVisual";

const visualMap = {
  ecovision: EcoVisionVisual,
  studia: StudiaVisual,
  questscribe: QuestScribeVisual,
  aurum: AurumVisual,
  notion: NotionAIVisual,
};

export default function ProjectTile({
  project,
  onActive,
  large = false,
}: {
  project: Project;
  onActive: (accent: string) => void;
  large?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const Visual = visualMap[project.visual];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onActive(project.accent);
        }
      },
      { threshold: 0.3, rootMargin: "-15% 0px -15% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.accent]);

  return (
    <Link
      href={`/projects/${project.slug}`}
      ref={ref}
      onClick={() => {
        // Manual scroll-position handoff: Next.js's automatic scroll
        // restoration doesn't reliably fire when leaving via a client-side
        // Link click here, so we save it ourselves and restore it when the
        // home page remounts after the user hits Back.
        sessionStorage.setItem("portfolio-scroll-y", String(window.scrollY));
      }}
      className={`glass group relative flex flex-col overflow-hidden rounded-2xl p-1 transition-transform duration-500 hover:-translate-y-1 ${
        large ? "lg:col-span-2 lg:row-span-2" : ""
      }`}
    >
      <div className="rounded-xl overflow-hidden">
        <Visual />
      </div>
      <div className="p-6 sm:p-8 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className={`font-display font-800 ${large ? "text-2xl sm:text-3xl" : "text-xl"}`}>
            {project.name}
          </h3>
          {project.flagship && (
            <span
              className="mono text-[10px] px-2 py-0.5 rounded-full font-semibold soft-pulse shrink-0"
              style={{ background: `${project.accent}20`, color: project.accent, border: `1px solid ${project.accent}50` }}
            >
              LIVE
            </span>
          )}
        </div>
        <p className={`text-[var(--text-dim)] mb-4 ${large ? "text-base" : "text-sm"}`}>
          {project.tagline}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.slice(0, large ? 6 : 3).map((t) => (
            <span
              key={t}
              className="mono text-[11px] px-2.5 py-1 rounded-full border border-[var(--glass-border)] text-[var(--text-faint)]"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 text-sm font-semibold" style={{ color: project.accent }}>
          View project
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
