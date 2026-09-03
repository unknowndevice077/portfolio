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
import LanguageBar from "./LanguageBar";

const visualMap = {
  ecovision: EcoVisionVisual,
  studia: StudiaVisual,
  questscribe: QuestScribeVisual,
  aurum: AurumVisual,
  notion: NotionAIVisual,
};

function DemoFrame({ project }: { project: Project }) {
  if (project.demoUrl) {
    return (
      <div className="rounded-lg overflow-hidden border border-[#23232f] bg-[#0a0a0f]">
        <div className="flex items-center gap-2 px-3 py-2 bg-[#0f0f16] border-b border-[#23232f]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span
            className="mono text-[10px] ml-3 px-2 py-0.5 rounded bg-[#050507] truncate flex-1"
            style={{ color: project.accent }}
          >
            {project.demoUrl.replace("https://", "")}
          </span>
          <span
            className="mono text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0"
            style={{ background: project.accent, color: "#08090c" }}
          >
            LIVE
          </span>
        </div>
        <iframe
          src={project.demoUrl}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          className="w-full h-[520px] sm:h-[640px] bg-white"
          title={`${project.name} live demo`}
        />
      </div>
    );
  }
  const Visual = visualMap[project.visual];
  return project.slug === "ecovision" ? <EcoVisionVisual animated /> : <Visual />;
}

export default function ProjectBlock({
  project,
  index,
  total,
  onActive,
}: {
  project: Project;
  index: number;
  total: number;
  onActive: (accent: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reversed = index % 2 === 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onActive(project.accent);
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
      className={`snap-section min-h-screen flex items-center py-16 border-t border-[var(--border)]`}
    >
      <div
        className={
          project.demoUrl
            ? "flex flex-col gap-8 w-full"
            : `grid lg:grid-cols-2 gap-10 items-center w-full ${
                reversed ? "lg:[&>*:first-child]:order-2" : ""
              }`
        }
      >
        <div>
          <p className="mono text-xs mb-3 tracking-[0.25em]" style={{ color: project.accent }}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-display text-2xl sm:text-3xl font-800 leading-tight">
              {project.name}
            </h3>
            {project.flagship && (
              <span
                className="mono text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0"
                style={{ background: project.accent, color: "#08090c" }}
              >
                FLAGSHIP
              </span>
            )}
          </div>
          <p className="text-base text-[var(--text-dim)] mb-5">{project.tagline}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-full border border-[var(--glass-border)] text-[var(--text-faint)]"
              >
                {t}
              </span>
            ))}
          </div>
          {project.languages && <LanguageBar languages={project.languages} />}
          <ul className="space-y-2.5 mb-7">
            {project.bullets.map((b, bi) => (
              <li key={bi} className="text-sm text-[var(--text-dim)] leading-relaxed pl-5 relative">
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
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-5 py-3 rounded-full font-semibold"
              style={{ background: project.accent, color: "#08090c" }}
            >
              Project link →
            </Link>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-5 py-3 rounded-full glass font-semibold"
            >
              Source ↗
            </a>
          </div>
        </div>
        <DemoFrame project={project} />
      </div>
    </div>
  );
}
