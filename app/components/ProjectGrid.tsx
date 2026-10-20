"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, projects, type Category, type Project } from "../data/projects";
import {
  EcoVisionVisual,
  StudiaVisual,
  QuestScribeVisual,
  AurumVisual,
  NotionAIVisual,
  ClashGamesVisual,
} from "./ProjectVisual";
import { QueueUpVisual, BantayBahaVisual, JaemboyVisual, LeadCatchVisual } from "./ProjectVisualExtra";

const visualMap = {
  ecovision: EcoVisionVisual,
  studia: StudiaVisual,
  questscribe: QuestScribeVisual,
  aurum: AurumVisual,
  notion: NotionAIVisual,
  clash: ClashGamesVisual,
  queueup: QueueUpVisual,
  bantay: BantayBahaVisual,
  jaemboy: JaemboyVisual,
  leadcatch: LeadCatchVisual,
};

function Card({ p }: { p: Project }) {
  const Visual = visualMap[p.visual];
  const live = p.demoUrl ?? p.playLinks?.[0]?.url;
  return (
    <article className="glass rounded-lg overflow-hidden flex flex-col group relative">
      <div className="absolute top-0 left-0 right-0 h-[3px] z-10" style={{ background: p.accent }} />
      <Link href={`/projects/${p.slug}`} className="block" aria-label={`${p.name} details`}>
        <div className="pointer-events-none">
          {p.slug === "ecovision" ? <EcoVisionVisual animated /> : <Visual />}
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <h3 className="font-display text-lg font-800 leading-tight">{p.name}</h3>
          {p.flagship && (
            <span
              className="mono text-[9px] px-1.5 py-0.5 rounded border font-bold tracking-wider"
              style={{ borderColor: p.accent, color: p.accent }}
            >
              FLAGSHIP
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--text-dim)] leading-snug mb-3 line-clamp-2">{p.tagline}</p>
        <p className="text-sm font-semibold mb-4 leading-snug" style={{ color: p.accent }}>
          {p.highlight}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {p.tech.slice(0, 5).map((t) => (
            <span key={t} className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--glass-border)] text-[var(--text-faint)]">
              {t}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-auto text-sm">
          <Link
            href={`/projects/${p.slug}`}
            className="px-3.5 py-1.5 rounded-md font-semibold"
            style={{ background: p.accent, color: "#071019" }}
          >
            Details
          </Link>
          {p.href && (
            <a href={p.href} target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-md glass font-semibold">
              Code ↗
            </a>
          )}
          {live && (
            <a href={live} target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-md glass font-semibold">
              Live ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectGrid() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter projects">
        {(["All", ...CATEGORIES] as const).map((c) => {
          const count = c === "All" ? projects.length : projects.filter((p) => p.categories.includes(c)).length;
          const on = filter === c;
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              aria-pressed={on}
              className={`text-sm px-4 py-2 rounded-full border transition-colors cursor-pointer ${
                on
                  ? "border-[var(--accent)] text-[var(--text)] bg-[rgba(var(--accent-rgb),0.1)]"
                  : "border-[var(--glass-border)] text-[var(--text-dim)] hover:border-[var(--glass-border-hover)]"
              }`}
            >
              {c} <span className="text-[var(--text-faint)] ml-1">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {shown.map((p) => (
          <Card key={p.slug} p={p} />
        ))}
      </div>
    </>
  );
}
