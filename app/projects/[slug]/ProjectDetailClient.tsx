"use client";

import Link from "next/link";
import SceneBackground from "../../components/SceneBackground";
import GlitchText from "../../components/GlitchText";
import type { Project } from "../../data/projects";
import {
  EcoVisionVisual,
  StudiaVisual,
  QuestScribeVisual,
  AurumVisual,
  NotionAIVisual,
} from "../../components/ProjectVisual";

const visualMap = {
  ecovision: EcoVisionVisual,
  studia: StudiaVisual,
  questscribe: QuestScribeVisual,
  aurum: AurumVisual,
  notion: NotionAIVisual,
};

export default function ProjectDetailClient({
  project,
  next,
}: {
  project: Project;
  next: Project;
}) {
  const Visual = visualMap[project.visual];

  return (
    <>
      <SceneBackground accent1={project.accent} accent2={next.accent} />
      <main className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 pb-24">
        <div className="pt-10 pb-6">
          <Link
            href="/"
            className="mono text-xs text-[var(--text-faint)] hover:text-[var(--text)] transition-colors"
          >
            ← BACK
          </Link>
        </div>

        <p
          className="mono text-xs mb-4 tracking-[0.3em]"
          style={{ color: project.accent }}
        >
          // {project.visual.toUpperCase()}
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-900 mb-4 leading-tight">
          <GlitchText text={project.name} />
        </h1>
        <p className="text-lg text-[var(--text-dim)] mb-8">{project.tagline}</p>

        <div className="mb-10 rounded-lg overflow-hidden border" style={{ borderColor: `${project.accent}40` }}>
          <Visual />
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {project.tech.map((t) => (
            <span
              key={t}
              className="mono text-xs px-3 py-1.5 rounded-full border"
              style={{ borderColor: `${project.accent}55`, color: project.accent }}
            >
              {t}
            </span>
          ))}
        </div>

        <p className="text-base text-[var(--text-dim)] leading-relaxed mb-10">
          {project.longDescription}
        </p>

        <h2 className="font-display text-sm mb-4 uppercase tracking-[0.3em]" style={{ color: project.accent }}>
          // Highlights
        </h2>
        <ul className="space-y-3 mb-12">
          {project.bullets.map((b, i) => (
            <li key={i} className="text-sm text-[var(--text-dim)] leading-relaxed pl-5 relative">
              <span className="absolute left-0" style={{ color: project.accent }}>
                ▸
              </span>
              {b}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-4 mb-20">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-sm px-5 py-3 font-bold"
            style={{ background: project.accent, color: "#000" }}
          >
            VIEW SOURCE ON GITHUB →
          </a>
          <Link
            href="/"
            className="mono text-sm px-5 py-3 border"
            style={{ borderColor: `${project.accent}55`, color: project.accent }}
          >
            ALL PROJECTS
          </Link>
        </div>

        <div className="border-t border-[var(--border)] pt-8">
          <p className="mono text-xs text-[var(--text-faint)] mb-2">NEXT BUILD</p>
          <Link
            href={`/projects/${next.slug}`}
            className="font-display text-2xl font-700 hover:underline"
            style={{ color: next.accent }}
          >
            {next.name} →
          </Link>
        </div>
      </main>
    </>
  );
}
