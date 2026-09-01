"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import TiltCard from "./TiltCard";
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

export default function ProjectSection({
  project,
  index,
  onActive,
}: {
  project: Project;
  index: number;
  onActive: (accent: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const Visual = visualMap[project.visual];
  const reversed = index % 2 === 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onActive(project.accent);
          }
        }
      },
      { threshold: 0.4, rootMargin: "-10% 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.accent]);

  return (
    <div
      ref={ref}
      className="min-h-[85vh] flex items-center py-16 border-t border-[var(--border)]"
    >
      <div
        className={`grid sm:grid-cols-2 gap-10 items-center w-full ${
          reversed ? "sm:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div>
          <p
            className="mono text-xs mb-3 tracking-[0.3em]"
            style={{ color: project.accent }}
          >
            0{index + 1} // {project.visual.toUpperCase()}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-display text-3xl sm:text-4xl font-700 leading-tight">
              {project.name}
            </h3>
            {project.flagship && (
              <span
                className="mono text-[10px] px-2 py-0.5 rounded-full font-bold pulse-glow shrink-0"
                style={{ background: project.accent, color: "#000" }}
              >
                LIVE
              </span>
            )}
          </div>
          <p className="text-base text-[var(--text-dim)] mb-5">{project.tagline}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="mono text-[11px] px-2 py-1 rounded-full border"
                style={{ borderColor: `${project.accent}55`, color: project.accent }}
              >
                {t}
              </span>
            ))}
          </div>
          <ul className="space-y-2 mb-7">
            {project.bullets.map((b, bi) => (
              <li
                key={bi}
                className="text-sm text-[var(--text-dim)] leading-relaxed pl-4 relative"
              >
                <span className="absolute left-0" style={{ color: project.accent }}>
                  ▸
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/projects/${project.slug}`}
              className="mono text-xs font-bold px-5 py-3 transition-shadow"
              style={{
                background: project.accent,
                color: "#000",
                boxShadow: `0 0 0 rgba(${project.accentRgb},0)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 25px rgba(${project.accentRgb},0.6)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 rgba(${project.accentRgb},0)`;
              }}
            >
              VIEW PROJECT →
            </Link>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mono text-xs font-bold px-5 py-3 border"
              style={{ borderColor: `${project.accent}55`, color: project.accent }}
            >
              SOURCE ↗
            </a>
          </div>
        </div>
        <TiltCard>
          <Link href={`/projects/${project.slug}`} className="block">
            <Visual />
          </Link>
        </TiltCard>
      </div>
    </div>
  );
}
