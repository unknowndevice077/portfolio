"use client";

import MedNotesVisual from "../../components/MedNotesVisual";
import Link from "next/link";
import LanguageBar from "../../components/LanguageBar";
import N8nWorkflowDiagram from "../../components/N8nWorkflowDiagram";
import { AurumVisual, ClashGamesVisual, EcoVisionVisual, NotionAIVisual, QuestScribeVisual, StudiaVisual } from "../../components/ProjectVisual";
import { BantayBahaVisual, JaemboyVisual, LeadCatchVisual, QueueUpVisual } from "../../components/ProjectVisualExtra";
import SiteShell from "../../components/SiteShell";
import type { Project } from "../../data/projects";

const visualMap = {
  ecovision: () => <EcoVisionVisual animated />,
  studia: StudiaVisual,
  questscribe: QuestScribeVisual,
  aurum: AurumVisual,
  notion: NotionAIVisual,
  clash: ClashGamesVisual,
  queueup: QueueUpVisual,
  bantay: BantayBahaVisual,
  jaemboy: JaemboyVisual,
  leadcatch: LeadCatchVisual,
  mednotes: MedNotesVisual,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="label mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ project }: { project: Project }) {
  const url = project.demoUrl!;
  const s = project.demoScale;
  return (
    <figure>
      <div className="relative w-full h-[480px] sm:h-[600px] overflow-hidden rounded-md border border-[var(--border)] bg-white" style={{ overscrollBehavior: "contain" }}>
        <iframe
          src={url}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          className="absolute top-0 left-0 border-0"
          style={s ? { width: `${100 / s}%`, height: `${100 / s}%`, transform: `scale(${s})`, transformOrigin: "0 0" } : { width: "100%", height: "100%" }}
          title={`${project.name} live demo`}
        />
      </div>
      <figcaption className="text-sm text-[var(--text-faint)] mt-2">
        Live demo, running for real.{" "}
        <a href={url} target="_blank" rel="noopener noreferrer" className="link">
          Open it full size ↗
        </a>
      </figcaption>
    </figure>
  );
}

export default function ProjectDetailClient({ project, next }: { project: Project; next: Project }) {
  const Visual = project.visual ? visualMap[project.visual] : null;

  return (
    <SiteShell>
      <Link href="/" className="text-sm text-[var(--text-faint)] hover:text-[var(--text)]">
        ← All work
      </Link>

      <h1 className="font-display text-[38px] sm:text-[48px] leading-[1.05] mt-6">{project.name}</h1>
      <p className="text-[18px] text-[var(--text-dim)] leading-relaxed mt-3 max-w-[60ch]">{project.tagline}</p>

      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-[15px]">
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="link">
            Live demo ↗
          </a>
        )}
        {project.siteUrl && (
          <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className="link">
            Live site ↗
          </a>
        )}
        {project.href && (
          <a href={project.href} target="_blank" rel="noopener noreferrer" className="link">
            Source on GitHub ↗
          </a>
        )}
        {project.playLinks?.map((p) => (
          <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="link">
            Play {p.name} ↗
          </a>
        ))}
      </div>

      <dl className="grid sm:grid-cols-[120px_1fr] gap-x-6 gap-y-3 mt-10 pt-6 border-t border-[var(--border)] text-[15px]">
        <dt className="text-[var(--text-faint)]">Result</dt>
        <dd>{project.highlight}</dd>
        <dt className="text-[var(--text-faint)]">Built with</dt>
        <dd className="text-[var(--text-dim)]">{project.tech.join(", ")}</dd>
        {project.languages && (
          <>
            <dt className="text-[var(--text-faint)]">Languages</dt>
            <dd className="max-w-md">
              <LanguageBar languages={project.languages} />
            </dd>
          </>
        )}
      </dl>

      {(project.demoUrl || Visual) && (
        <div className="mt-12">
          {project.demoUrl ? (
            <Demo project={project} />
          ) : (
            Visual && (
              <div className="rounded-md overflow-hidden border border-[var(--border)]">
                <Visual />
              </div>
            )
          )}
        </div>
      )}

      <Section title="Overview">
        <p className="text-[17px] leading-[1.75] text-[var(--text-dim)] max-w-[65ch]">{project.longDescription}</p>
      </Section>

      <Section title="What it does">
        <ul className="space-y-3 max-w-[65ch]">
          {project.bullets.map((b, i) => (
            <li key={i} className="text-[16px] leading-relaxed text-[var(--text-dim)] pl-5 relative">
              <span className="absolute left-0 text-[var(--text-faint)]">–</span>
              {b}
            </li>
          ))}
        </ul>
      </Section>

      {project.showN8nWorkflow && (
        <Section title="The real workflow">
          <div className="rounded-md overflow-hidden border border-[var(--border)]">
            <N8nWorkflowDiagram accent={project.accent} />
          </div>
          <p className="text-sm text-[var(--text-faint)] mt-3 max-w-[65ch]">
            The actual n8n graph behind the AI Dungeon Master: a webhook takes the player&apos;s message, a Code node builds the prompt, an HTTP node calls the model, and the shaped JSON goes back to the game.
          </p>
        </Section>
      )}

      {project.caseStudy && (
        <Section title="How it went">
          <div className="space-y-8 max-w-[65ch]">
            {project.caseStudy.map((c, i) => (
              <div key={i}>
                <h3 className="font-display text-[22px] mb-2">{c.heading}</h3>
                <p className="text-[16px] leading-[1.75] text-[var(--text-dim)]">{c.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Link href={"/projects/" + next.slug} className="group block mt-20 pt-8 border-t border-[var(--border)]">
        <span className="label">Next</span>
        <span className="block font-display text-[30px] mt-2 group-hover:underline underline-offset-[6px] decoration-1">{next.name} →</span>
      </Link>
    </SiteShell>
  );
}
