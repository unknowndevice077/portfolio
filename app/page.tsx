"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import SceneBackground from "./components/SceneBackground";
import Reveal from "./components/Reveal";
import ProjectBlock from "./components/ProjectBlock";
import { techIcons } from "./components/TechIcon";
import { projects } from "./data/projects";

type Service = {
  title: string;
  description: string;
  proof: string;
  accent: string;
};

const services: Service[] = [
  {
    title: "Applied AI & Computer Vision",
    description:
      "Real-time detection pipelines, video/image classification, and LLM-powered features — from model selection through to a system that runs in production, not just a notebook.",
    proof: "Proof: EcoVision's YOLOv11 + X3D-XS detection pipeline, QuestScribe's AI Dungeon Master.",
    accent: "#8fd400",
  },
  {
    title: "Full-Stack Web & Mobile Apps",
    description:
      "End-to-end product builds — Next.js/React on the front, FastAPI/Postgres or Firebase underneath, shipped to real users on web, iOS, Android, and desktop.",
    proof: "Proof: Studia (6-platform Flutter app), Aurum's live trading dashboard.",
    accent: "#5eead4",
  },
  {
    title: "Desktop & Embedded Systems",
    description:
      "Cross-platform desktop apps (Electron, Tauri/Rust) and the hardware side when a project needs it — microcontrollers, sensors, and the firmware/backend link between them.",
    proof: "Proof: EcoVision's Electron dashboard + ESP32-triggered siren, Notion AI Assistant's Rust/Tauri desktop shell.",
    accent: "#a78bfa",
  },
  {
    title: "Workflow & AI Automation",
    description:
      "Turning a manual process into an automated one — n8n workflows, AI agents wired into real tools (Notion, Slack, etc.), prompt-engineered from a working sketch to something reliable.",
    proof: "Proof: QuestScribe's n8n-orchestrated hackathon build, Notion AI Assistant's client-built workflow tool.",
    accent: "#fbbf24",
  },
];

const skillGroups: [string, string[]][] = [
  ["AI / Computer Vision", ["YOLOv8/v11", "X3D video classification", "PyTorch transfer learning", "Ollama & LLM APIs", "N8n automation"]],
  ["Languages", ["Python", "TypeScript/JavaScript", "C/C++", "Java", "C#", "Rust", "Dart"]],
  ["Web & Mobile", ["React", "Next.js", "React Native", "Flutter", "Tauri", "HTML/CSS"]],
  ["Backend & Data", ["FastAPI", "PostgreSQL", "SQLite", "Redis", "Firebase", "Supabase"]],
  ["Embedded & Hardware", ["Arduino Uno","ESP32", "PIC16F84A (Assembly)", "AutoCAD", "Fusion 360", "Tinkercad"]],
];

type Competition = {
  title: string;
  org: string;
  result: string;
  description: string;
  accent: string;
  certificateUrl: string;
  certificateDims: { width: number; height: number }; // intrinsic size, for the thumbnail crop
  // Where the thumbnail links to. Internal path (e.g. the project this
  // competition produced) shows that project's own story instead of just
  // the bare certificate; omit to open the certificate image itself.
  storyHref?: string;
};

const competitions: Competition[] = [
  {
    title: "ISITE AI Hackathon 2026",
    org: "HexCorePH Labs",
    result: "Built QuestScribe",
    description:
      "An n8n-automated gamified learning platform with an AI chatbot tutor, built under the hackathon's automation brief across business, learning, and security tracks — chose the learning track.",
    accent: "#6ee7d8",
    certificateUrl: "/certificates/isite-ai-hackathon-2026.jpg",
    certificateDims: { width: 2000, height: 1545 },
    storyHref: "/projects/questscribe",
  },
  {
    title: "CodeChum National Programming Challenge 2024",
    org: "National competition",
    result: "Certificate of Participation",
    description:
      "Competed nationally in algorithmic problem-solving — trees, graphs, hash maps, dynamic programming, greedy algorithms.",
    accent: "#818cf8",
    certificateUrl: "/certificates/codechum-national-programming-challenge-2024.jpg",
    certificateDims: { width: 2060, height: 1592 },
  },
];

function Tag({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <span className="flex items-center gap-2 text-sm px-3.5 py-2 rounded-full border border-[var(--glass-border)] text-[var(--text-dim)] hover:border-[var(--glass-border-hover)] transition-colors">
      {Icon && <Icon className="w-4 h-4 text-[var(--text)]" />}
      {children}
    </span>
  );
}

export default function Home() {
  // Both track the same active project's accent now — SceneBackground still
  // takes two colors for its two shape groups, but they used to be a fixed
  // teal/indigo pair, so two of its five wireframe shapes stayed indigo no
  // matter which project was actually in view. One accent per project reads
  // as intentional; a project's own color plus a leftover indigo doesn't.
  const [accent1, setAccent1] = useState("#ff5a1f");
  const [accent2, setAccent2] = useState("#ff5a1f");

  const handleActive = useCallback((accent: string) => {
    setAccent1(accent);
    setAccent2(accent);
  }, []);

  return (
    <>
      <SceneBackground accent1={accent1} accent2={accent2} />
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Hero — a spec sheet, not a greeting. No "Hi, I'm", no gradient
            name, no circular avatar-in-a-blurred-ring — that combination is
            the most recognizable AI-generated-portfolio opener there is. */}
        <header className="snap-section pt-24 pb-16 sm:pt-32 sm:pb-20 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-start w-full">
            <div>
              <div className="flex items-center gap-3 mb-7 mono text-xs tracking-[0.2em] text-[var(--text-faint)] uppercase">
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                Computer Engineering · Leyte, Philippines
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 tracking-tight mb-2 leading-[0.95]">
                Fritz Rjhay Dela Cruz
              </h1>
              <p className="font-display text-base sm:text-lg text-[var(--accent)] tracking-tight mb-7">
                Applied AI &amp; Full-Stack Engineer
              </p>
              <p className="text-lg text-[var(--text-dim)] leading-relaxed max-w-xl mb-9 font-body">
                I design and ship production systems independently, end-to-end —
                from model to deployment. Real-time detection pipelines, trading
                automation, multiplayer game infrastructure, and the full-stack
                and embedded work underneath all of it.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href="/resume/Fritz_Dela_Cruz_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-5 py-2.5 rounded-md font-semibold text-[#140f0a]"
                  style={{ background: "var(--accent)" }}
                >
                  Resume ↓
                </a>
                <a
                  href="https://github.com/unknowndevice077"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-5 py-2.5 rounded-md glass font-semibold"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/fritz-rjhay-dela-cruz-9b604737b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-5 py-2.5 rounded-md glass font-semibold"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="mailto:frjhay.delacruz@gmail.com"
                  className="text-sm px-5 py-2.5 rounded-md glass font-semibold"
                >
                  Get in touch
                </a>
                <a
                  href="https://www.facebook.com/rjhay.l.delacruz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-5 py-2.5 rounded-md glass font-semibold"
                  >
                    Facebook ↗
                </a>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end order-first lg:order-last">
              <div className="target-frame relative w-36 h-36 sm:w-48 sm:h-48 rounded-lg overflow-hidden glass shrink-0">
                <Image
                  src="/images/avatar-placeholder.jpg"
                  alt="Fritz Rjhay Dela Cruz"
                  fill
                  sizes="(min-width: 640px) 12rem, 9rem"
                  className="object-cover grayscale-[35%] contrast-[1.05]"
                  priority
                />
              </div>
            </div>
          </div>
        </header>

        {/* Services — for anyone here to hire/contract, not just recruiters */}
        <Reveal>
          <section className="snap-section min-h-screen flex flex-col justify-center py-12 sm:py-16 border-t border-[var(--border)]">
            <h2 className="font-display text-sm text-[var(--text-faint)] mb-3 uppercase tracking-[0.25em]">
              Work with me
            </h2>
            <p className="text-lg text-[var(--text-dim)] mb-10 max-w-2xl">
              Available for freelance and contract work. Here&apos;s what I build —
              each backed by something already shipped, not a claim on a page.
            </p>
            <div className="grid sm:grid-cols-2 gap-5 mb-10">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="glass rounded-lg p-6 relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: s.accent }}
                  />
                  <h3 className="font-display text-lg font-700 mb-2.5">{s.title}</h3>
                  <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-3">
                    {s.description}
                  </p>
                  <p className="text-xs text-[var(--text-faint)] leading-relaxed">
                    {s.proof}
                  </p>
                </div>
              ))}
            </div>
            <a
              href="mailto:frjhay.delacruz@gmail.com?subject=Project inquiry"
              className="text-sm px-5 py-3 rounded-md font-semibold self-start"
              style={{ background: "var(--accent)", color: "#140f0a" }}
            >
              Have a project in mind? Let&apos;s talk →
            </a>
          </section>
        </Reveal>

        {/* Skills */}
        <Reveal>
          <section className="snap-section min-h-screen flex flex-col justify-center py-12 sm:py-16 border-t border-[var(--border)]">
            <h2 className="font-display text-sm text-[var(--text-faint)] mb-10 uppercase tracking-[0.25em]">
              Skills
            </h2>
            <div className="space-y-7">
              {skillGroups.map(([group, items]) => (
                <div key={group} className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6">
                  <span className="text-sm text-[var(--text-dim)] sm:w-48 shrink-0 font-medium">
                    {group}
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {items.map((item) => (
                      <Tag key={item} icon={techIcons[item]}>{item}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Projects — one full block per project, introduced one at a time as you scroll */}
        <div>
          <Reveal>
            <h2 className="font-display text-sm text-[var(--text-faint)] pt-16 pb-8 uppercase tracking-[0.25em]">
              Featured builds
            </h2>
          </Reveal>
          {projects.map((p, i) => (
            <ProjectBlock key={p.slug} project={p} index={i} total={projects.length} onActive={handleActive} />
          ))}
          <Reveal>
            <p className="text-sm text-[var(--text-faint)] py-8">
              Plus 12+ additional repos: EcoVision Smartpole, a wall-climbing
              robot, VA Hub (client/invoicing workspace for virtual assistants),
              LeadPilot (job-board matching), a motorshop inventory system, and
              embedded builds (fire alarms, toll gates, energy harvesting).
            </p>
          </Reveal>
        </div>

        {/* Competitions — the highlight section */}
        <Reveal>
          <section className="snap-section min-h-screen flex flex-col justify-center py-12 sm:py-16 border-t border-[var(--border)]">
            <h2 className="font-display text-sm text-[var(--text-faint)] mb-10 uppercase tracking-[0.25em]">
              Competitions
            </h2>
            <div className="space-y-10">
              {competitions.map((c) => {
                const thumb = (
                  <div className="relative w-28 h-20 sm:w-36 sm:h-24 shrink-0 rounded-lg overflow-hidden border border-[#241f16] bg-[#100e0a] group-hover/cert:border-[var(--glass-border-hover)] transition-colors">
                    <Image
                      src={c.certificateUrl}
                      alt={`${c.title} certificate`}
                      width={c.certificateDims.width}
                      height={c.certificateDims.height}
                      sizes="150px"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/cert:bg-black/60 transition-colors flex items-center justify-center">
                      <span className="mono text-[9px] sm:text-[10px] text-white text-center px-2 opacity-0 group-hover/cert:opacity-100 transition-opacity leading-tight">
                        {c.storyHref ? "See the story →" : "View certificate ↗"}
                      </span>
                    </div>
                  </div>
                );
                return (
                  <div
                    key={c.title}
                    className="glass rounded-lg p-6 sm:p-8 relative overflow-hidden"
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px]"
                      style={{ background: c.accent }}
                    />
                    <div className="flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        <p
                          className="mono text-xs uppercase tracking-[0.2em] mb-4"
                          style={{ color: c.accent }}
                        >
                          {c.result}
                        </p>
                        <h3 className="font-display text-xl sm:text-2xl font-800 mb-2 leading-tight">
                          {c.title}
                        </h3>
                        <p className="text-sm text-[var(--text-faint)] mb-5">{c.org}</p>
                        <p className="text-base text-[var(--text-dim)] leading-relaxed">
                          {c.description}
                        </p>
                      </div>
                      {c.storyHref ? (
                        <Link href={c.storyHref} className="group/cert shrink-0">
                          {thumb}
                        </Link>
                      ) : (
                        <a
                          href={c.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/cert shrink-0"
                        >
                          {thumb}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </Reveal>

        {/* Footer */}
        <footer className="snap-section min-h-screen flex flex-col justify-center border-t border-[var(--border)] items-start gap-5">
          <p className="font-display text-2xl sm:text-3xl font-800 text-gradient">
            Let&apos;s build something.
          </p>
          <p className="text-[var(--text-dim)]">
            Open to remote full-time or contract work.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <a href="mailto:frjhay.delacruz@gmail.com" className="text-[var(--accent)] hover:underline">
              frjhay.delacruz@gmail.com
            </a>
            <span className="text-[var(--text-faint)]">·</span>
            <a
              href="https://github.com/unknowndevice077"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              github.com/unknowndevice077
            </a>
            <span className="text-[var(--text-faint)]">·</span>
            <a
              href="https://www.linkedin.com/in/fritz-rjhay-dela-cruz-9b604737b/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              LinkedIn
            </a>
            <span className="text-[var(--text-faint)]">·</span>
            <a
              href="/resume/Fritz_Dela_Cruz_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              Resume ↓
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
