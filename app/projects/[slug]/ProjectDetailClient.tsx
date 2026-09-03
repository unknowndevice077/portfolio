"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SceneBackground from "../../components/SceneBackground";
import N8nWorkflowDiagram from "../../components/N8nWorkflowDiagram";
import LanguageBar from "../../components/LanguageBar";
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
                return;
              }
              // Project links open in a new tab, so this page usually has no
              // in-tab history to go back to — the homepage tab is still
              // sitting right where the user left it. Close this tab to
              // return to it instead of loading a fresh homepage at the top.
              window.close();
              // window.close() is a no-op if this tab wasn't opened by
              // script (e.g. a bookmarked/direct link) — fall back to
              // navigating home in that case.
              setTimeout(() => router.push("/"), 100);
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

        {project.demoUrl ? (
          <div className="mb-10 rounded-2xl overflow-hidden glass p-1">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#0f0f16] border-b border-[#23232f] rounded-t-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <span className="mono text-[10px] ml-2 px-2 py-0.5 rounded bg-[#050507] truncate flex-1" style={{ color: project.accent }}>
                {project.demoUrl.replace("https://", "")}
              </span>
              <span
                className="mono text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0"
                style={{ background: project.accent, color: "#08090c" }}
              >
                LIVE DEMO
              </span>
            </div>
            <iframe
              src={project.demoUrl}
              loading="lazy"
              className="w-full h-[520px] sm:h-[680px] bg-white"
              title={`${project.name} live demo`}
            />
            <div className="px-4 py-3 bg-[#0f0f16] rounded-b-xl">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mono text-xs font-semibold"
                style={{ color: project.accent }}
              >
                Open in a new tab ↗
              </a>
            </div>
          </div>
        ) : (
          <div className="mb-10 rounded-2xl overflow-hidden glass p-1">
            {project.slug === "ecovision" ? <EcoVisionVisual animated /> : <Visual />}
          </div>
        )}

        {project.showN8nWorkflow && (
          <div className="mb-10">
            <p className="mono text-xs mb-3 uppercase tracking-[0.25em]" style={{ color: project.accent }}>
              Behind the scenes — the real workflow
            </p>
            <div className="rounded-2xl overflow-hidden glass p-1">
              <N8nWorkflowDiagram accent={project.accent} />
            </div>
            <p className="text-xs text-[var(--text-faint)] mt-3">
              This is the actual n8n graph powering the AI Dungeon Master: a webhook
              receives the player&apos;s message, a Code node builds the prompt, an HTTP
              Request node calls the model, another Code node parses and shapes the
              JSON response, and Respond to Webhook sends it back — live, running on
              a self-hosted n8n instance.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2.5 mb-6">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--glass-border)] text-[var(--text-dim)]"
            >
              {t}
            </span>
          ))}
        </div>

        {project.languages && (
          <div className="mb-12 max-w-md">
            <LanguageBar languages={project.languages} />
          </div>
        )}

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
