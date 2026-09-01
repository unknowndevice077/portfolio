"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SceneBackground from "../../components/SceneBackground";
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
  const router = useRouter();

  return (
    <>
      <SceneBackground accent1={project.accent} accent2={next.accent} />
      <main className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 pb-24">
        <div className="pt-10 pb-8">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            className="text-sm text-[var(--text-faint)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            ← Back
          </button>
        </div>

        <p
          className="mono text-xs mb-5 uppercase tracking-[0.25em]"
          style={{ color: project.accent }}
        >
          {project.visual}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-800 mb-5 leading-[1.05]">
          {project.name}
        </h1>
        <p className="text-lg text-[var(--text-dim)] mb-10 max-w-2xl">{project.tagline}</p>

        <div className="mb-10 rounded-2xl overflow-hidden glass p-1">
          <Visual />
        </div>

        <div className="flex flex-wrap gap-2.5 mb-12">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--glass-border)] text-[var(--text-dim)]"
            >
              {t}
            </span>
          ))}
        </div>

        <p className="text-lg text-[var(--text-dim)] leading-relaxed mb-14 max-w-3xl">
          {project.longDescription}
        </p>

        <h2 className="font-display text-sm text-[var(--text-faint)] mb-6 uppercase tracking-[0.25em]">
          Highlights
        </h2>
        <ul className="space-y-4 mb-16 max-w-3xl">
          {project.bullets.map((b, i) => (
            <li key={i} className="text-base text-[var(--text-dim)] leading-relaxed pl-6 relative">
              <span className="absolute left-0" style={{ color: project.accent }}>
                →
              </span>
              {b}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-4 mb-24">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-6 py-3.5 rounded-full font-semibold"
            style={{ background: project.accent, color: "#08090c" }}
          >
            View source on GitHub ↗
          </a>
          <Link href="/" className="text-sm px-6 py-3.5 rounded-full glass font-semibold">
            All projects
          </Link>
        </div>

        <div className="border-t border-[var(--border)] pt-10">
          <p className="text-xs text-[var(--text-faint)] mb-3 uppercase tracking-[0.25em]">Next build</p>
          <Link
            href={`/projects/${next.slug}`}
            className="font-display text-3xl sm:text-4xl font-800 hover:opacity-80 transition-opacity"
            style={{ color: next.accent }}
          >
            {next.name} →
          </Link>
        </div>
      </main>
    </>
  );
}
