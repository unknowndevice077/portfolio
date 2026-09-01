"use client";

import { useCallback, useEffect, useState } from "react";
import SceneBackground from "./components/SceneBackground";
import Reveal from "./components/Reveal";
import ProjectBlock from "./components/ProjectBlock";
import { techIcons } from "./components/TechIcon";
import { projects } from "./data/projects";

const skillGroups: [string, string[]][] = [
  ["AI / Computer Vision", ["YOLOv8/v11", "X3D video classification", "PyTorch transfer learning", "prompt engineering", "Ollama & LLM APIs", "n8n automation"]],
  ["Languages", ["Python", "TypeScript/JavaScript", "C/C++", "Java", "C#", "Rust", "Dart"]],
  ["Web & Mobile", ["React", "Next.js", "React Native", "Flutter", "Tauri", "HTML/CSS"]],
  ["Backend & Data", ["FastAPI", "PostgreSQL", "SQLite", "Redis", "Firebase", "Supabase"]],
  ["Embedded & Hardware", ["ESP32", "PIC16F84A (Assembly)", "AutoCAD", "Fusion 360", "Tinkercad"]],
];

const competitions = [
  {
    title: "ISITE AI Hackathon 2026",
    org: "HexCorePH Labs",
    result: "Built QuestScribe",
    description:
      "An n8n-automated gamified learning platform with an AI chatbot tutor, built under the hackathon's automation brief across business, learning, and security tracks — chose the learning track.",
    accent: "#6ee7d8",
  },
  {
    title: "CodeChum National Programming Challenge 2024",
    org: "National competition",
    result: "Certificate of Participation",
    description:
      "Competed nationally in algorithmic problem-solving — trees, graphs, hash maps, dynamic programming, greedy algorithms.",
    accent: "#818cf8",
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
  const [accent1, setAccent1] = useState("#6ee7d8");
  const [accent2, setAccent2] = useState("#818cf8");

  const handleActive = useCallback((accent: string) => {
    setAccent1(accent);
    setAccent2((prev) => (prev === accent ? "#818cf8" : prev));
  }, []);

  // Restore scroll position after coming back from a project detail page
  // (see the onClick handoff in ProjectBlock) — Next.js's own scroll
  // restoration doesn't reliably fire here, so we do it ourselves.
  useEffect(() => {
    const saved = sessionStorage.getItem("portfolio-scroll-y");
    if (saved) {
      sessionStorage.removeItem("portfolio-scroll-y");
      requestAnimationFrame(() => {
        window.scrollTo(0, Number(saved));
      });
    }
  }, []);

  return (
    <>
      <SceneBackground accent1={accent1} accent2={accent2} />
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Hero */}
        <header className="snap-section pt-20 pb-16 sm:pt-28 sm:pb-20 min-h-screen flex flex-col justify-center">
          <p className="mono text-sm text-[var(--accent)] mb-5 tracking-wide">
            Hi, I&apos;m
          </p>
          <h1 className="font-display text-5xl sm:text-7xl font-800 tracking-tight mb-6 leading-[0.95] text-gradient">
            Jae
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-dim)] leading-relaxed max-w-xl mb-8 font-body">
            Final-year Computer Engineering student specializing in applied AI
            and full-stack/embedded development. I ship production systems
            independently, end-to-end — including a real-time crime-detection
            platform live in production.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/unknowndevice077"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-5 py-3 rounded-full bg-[var(--text)] text-[#08090c] font-semibold hover:opacity-90 transition-opacity"
            >
              GitHub ↗
            </a>
            <a
              href="mailto:frjhay.delacruz@gmail.com"
              className="text-sm px-5 py-3 rounded-full glass font-semibold"
            >
              Get in touch
            </a>
          </div>
        </header>

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
              Plus 12+ additional repos: EcoVision Smartpole, a line-following
              robot, LeadPilot (job-board matching), and embedded builds (fire
              alarms, toll gates, energy harvesting).
            </p>
          </Reveal>
        </div>

        {/* Competitions — the highlight section */}
        <Reveal>
          <section className="snap-section min-h-screen flex flex-col justify-center py-12 sm:py-16 border-t border-[var(--border)]">
            <h2 className="font-display text-sm text-[var(--text-faint)] mb-10 uppercase tracking-[0.25em]">
              Competitions
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {competitions.map((c) => (
                <div
                  key={c.title}
                  className="glass rounded-2xl p-6 sm:p-8 relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: c.accent }}
                  />
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
              ))}
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
          </div>
        </footer>
      </main>
    </>
  );
}
