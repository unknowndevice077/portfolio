"use client";

import { useCallback, useEffect, useState } from "react";
import SceneBackground from "./components/SceneBackground";
import Reveal from "./components/Reveal";
import ProjectTile from "./components/ProjectSection";
import { projects } from "./data/projects";

const skillGroups: [string, string[]][] = [
  ["AI / Computer Vision", ["YOLOv8/v11", "X3D video classification", "PyTorch transfer learning", "prompt engineering", "Ollama & LLM APIs", "n8n automation"]],
  ["Languages", ["Python", "TypeScript/JavaScript", "C/C++", "Java", "C#", "Rust", "Dart"]],
  ["Web & Mobile", ["React", "Next.js", "React Native", "Flutter", "Tauri", "HTML/CSS"]],
  ["Backend & Data", ["FastAPI", "PostgreSQL", "SQLite", "Redis", "Firebase", "Supabase"]],
  ["Embedded & Hardware", ["ESP32", "PIC16F84A (Assembly)", "AutoCAD", "Fusion 360", "Tinkercad"]],
];

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="mono text-xs px-3 py-1.5 rounded-full border border-[var(--glass-border)] text-[var(--text-dim)]">
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
  // (see the onClick handoff in ProjectTile) — Next.js's own scroll
  // restoration doesn't reliably fire here, so we do it ourselves.
  useEffect(() => {
    const saved = sessionStorage.getItem("portfolio-scroll-y");
    if (saved) {
      sessionStorage.removeItem("portfolio-scroll-y");
      // Wait a frame so the page has laid out before jumping.
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
        <header className="pt-24 pb-20 sm:pt-36 sm:pb-28 min-h-[85vh] flex flex-col justify-center">
          <p className="mono text-sm text-[var(--accent)] mb-6 tracking-wide">
            Hi, I&apos;m
          </p>
          <h1 className="font-display text-7xl sm:text-9xl font-800 tracking-tight mb-8 leading-[0.95] text-gradient">
            Jae
          </h1>
          <p className="text-xl sm:text-2xl text-[var(--text-dim)] leading-relaxed max-w-2xl mb-10 font-body">
            Final-year Computer Engineering student specializing in applied AI
            and full-stack/embedded development. I ship production systems
            independently, end-to-end — including a real-time crime-detection
            platform live in production.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/unknowndevice077"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-6 py-3.5 rounded-full bg-[var(--text)] text-[#08090c] font-semibold hover:opacity-90 transition-opacity"
            >
              GitHub ↗
            </a>
            <a
              href="mailto:frjhay.delacruz@gmail.com"
              className="text-sm px-6 py-3.5 rounded-full glass font-semibold"
            >
              Get in touch
            </a>
          </div>
        </header>

        {/* Skills */}
        <Reveal>
          <section className="py-16 sm:py-20 border-t border-[var(--border)]">
            <h2 className="font-display text-sm text-[var(--text-faint)] mb-10 uppercase tracking-[0.25em]">
              Skills
            </h2>
            <div className="space-y-6">
              {skillGroups.map(([group, items]) => (
                <div key={group} className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6">
                  <span className="text-sm text-[var(--text-dim)] sm:w-48 shrink-0 font-medium">
                    {group}
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {items.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Projects — bento grid, full width, varied sizes */}
        <section className="py-16 sm:py-20 border-t border-[var(--border)]">
          <Reveal>
            <h2 className="font-display text-sm text-[var(--text-faint)] mb-10 uppercase tracking-[0.25em]">
              Featured builds
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProjectTile project={p} onActive={handleActive} large={i === 0} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-sm text-[var(--text-faint)] mt-8">
              Plus 12+ additional repos: EcoVision Smartpole, a line-following
              robot, LeadPilot (job-board matching), and embedded builds (fire
              alarms, toll gates, energy harvesting).
            </p>
          </Reveal>
        </section>

        {/* Experience */}
        <Reveal>
          <section className="py-16 sm:py-20 border-t border-[var(--border)]">
            <h2 className="font-display text-sm text-[var(--text-faint)] mb-10 uppercase tracking-[0.25em]">
              Experience
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-display font-700 text-lg">Freelance Video Editor</h3>
                  <span className="mono text-xs text-[var(--text-faint)]">2023</span>
                </div>
                <p className="text-sm text-[var(--text-dim)]">Remote</p>
                <p className="text-sm text-[var(--text-dim)] mt-3">
                  Edited gaming and tutorial content for YouTube channels, improving viewership and live-stream engagement.
                </p>
              </div>
              <div className="glass rounded-2xl p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-display font-700 text-lg">IT & Marketing Assistant</h3>
                  <span className="mono text-xs text-[var(--text-faint)]">2021</span>
                </div>
                <p className="text-sm text-[var(--text-dim)]">Carlosta Hotel (OJT)</p>
                <p className="text-sm text-[var(--text-dim)] mt-3">
                  Maintained hotel IT systems and network devices; designed promotional materials for marketing campaigns.
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Education & Competitions */}
        <Reveal>
          <section className="py-16 sm:py-20 border-t border-[var(--border)] grid sm:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-sm text-[var(--text-faint)] mb-6 uppercase tracking-[0.25em]">
                Education
              </h2>
              <h3 className="font-display font-700 text-xl">Western Leyte College</h3>
              <p className="text-sm text-[var(--text-dim)] mb-2">Ormoc City, Philippines</p>
              <p className="text-sm text-[var(--text-dim)]">B.S. Computer Engineering — In Progress</p>
              <p className="text-sm text-[var(--text-faint)] mt-3 leading-relaxed">
                Embedded Systems Design · Computer Vision & Object Detection · Robotics Kinematics ·
                Microprocessor Systems (PIC16F84A Assembly) · Cloud Frameworks & Database Management.
                Senior High (ICT), graduated with honors — Outstanding Awardee in Technical-Vocational Education.
              </p>
            </div>
            <div>
              <h2 className="font-display text-sm text-[var(--text-faint)] mb-6 uppercase tracking-[0.25em]">
                Competitions
              </h2>
              <div className="space-y-5">
                <div>
                  <h3 className="font-display font-700">CodeChum National Programming Challenge 2024</h3>
                  <p className="text-sm text-[var(--text-faint)] mt-1">
                    Certificate of Participation — trees, graphs, hash maps, DP, greedy.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-700">ISITE AI Hackathon 2026 — HexCorePH Labs</h3>
                  <p className="text-sm text-[var(--text-faint)] mt-1">
                    Built QuestScribe, an n8n-automated gamified learning platform with an AI chatbot tutor.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Footer */}
        <footer className="py-20 sm:py-28 border-t border-[var(--border)] flex flex-col items-start gap-5">
          <p className="font-display text-3xl sm:text-4xl font-800 text-gradient">
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
