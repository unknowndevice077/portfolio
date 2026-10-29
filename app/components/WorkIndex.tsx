"use client";

import MedNotesVisual from "./MedNotesVisual";
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, projects, type Category } from "../data/projects";
import { AurumVisual, ClashGamesVisual, EcoVisionVisual, NotionAIVisual, QuestScribeVisual, StudiaVisual } from "./ProjectVisual";
import { BantayBahaVisual, JaemboyVisual, LeadCatchVisual, QueueUpVisual } from "./ProjectVisualExtra";

const THUMB = { ecovision: EcoVisionVisual, studia: StudiaVisual, questscribe: QuestScribeVisual, aurum: AurumVisual, notion: NotionAIVisual, clash: ClashGamesVisual, queueup: QueueUpVisual, bantay: BantayBahaVisual, jaemboy: JaemboyVisual, leadcatch: LeadCatchVisual, mednotes: MedNotesVisual };

// the full-size mockups, shrunk into a thumbnail
function Thumb({ visual, accent }: { visual?: keyof typeof THUMB; accent: string }) {
  const V = visual ? THUMB[visual] : null;
  return (
    <div className="relative w-[150px] sm:w-[200px] aspect-[16/10] rounded-md overflow-hidden border border-[var(--border)] shrink-0" style={{ background: accent + "22" }}>
      {V ? (
        <div className="absolute top-0 left-0 w-[640px] origin-top-left pointer-events-none" style={{ transform: "scale(var(--s))" }}>
          <V />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center font-display text-3xl" style={{ color: accent }}>
          Rx
        </div>
      )}
    </div>
  );
}

const ORDER = ["ecovision", "mednotes", "queueup", "bantay-baha", "jaemboy", "leadcatch", "clash-games", "notion-ai-assistant", "questscribe", "studia", "aurum"];
const list = ORDER.map((s) => projects.find((p) => p.slug === s)).filter((p) => p !== undefined);

export default function WorkIndex() {
  const [cat, setCat] = useState<Category | "All">("All");
  const shown = cat === "All" ? list : list.filter((p) => p.categories.includes(cat));

  return (
    <div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6 text-sm" role="tablist" aria-label="Filter projects">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={"cursor-pointer transition-colors " + (cat === c ? "text-[var(--text)] underline underline-offset-[6px] decoration-2" : "text-[var(--text-faint)] hover:text-[var(--text)]")}
          >
            {c}
          </button>
        ))}
      </div>

      <ol className="border-t border-[var(--border)]">
        {shown.map((p) => (
          <li key={p.slug} className="border-b border-[var(--border)]">
            <Link href={"/projects/" + p.slug} className="group grid grid-cols-[1fr_auto] items-center gap-x-6 [--s:0.234] sm:[--s:0.3125] py-5 sm:py-6 -mx-3 px-3 rounded-sm hover:bg-[var(--hover)] transition-colors">
              <div className="min-w-0">
                <p className="font-display text-[23px] sm:text-[26px] leading-tight">{p.name}</p>
                <p className="text-[15px] text-[var(--text-dim)] mt-1.5 leading-relaxed">{p.highlight}</p>
              </div>
              <div className="transition-transform duration-300 group-hover:-translate-y-0.5">
                <Thumb visual={p.visual} accent={p.accent} />
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
