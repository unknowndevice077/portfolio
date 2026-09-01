"use client";

import { useCallback, useRef, useState } from "react";
import SceneBackground from "./components/SceneBackground";
import GlitchText from "./components/GlitchText";
import Reveal from "./components/Reveal";
import ProjectSection from "./components/ProjectSection";
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
    <span className="mono text-[11px] px-2 py-1 rounded-full border border-[#23232f] text-[var(--text-dim)]">
      {children}
    </span>
  );
}

export default function Home() {
  const [accent1, setAccent1] = useState("#00fff2");
  const nextAccentIndexRef = useRef(0);
  const [accent2, setAccent2] = useState("#ff2fd6");

  const handleActive = useCallback((accent: string) => {
    setAccent1(accent);
    // pick a complementary second color from the palette for variety
    const palette = ["#ff2fd6", "#00fff2", "#f2ff00", "#00ffa2", "#a855f7"];
    const idx = nextAccentIndexRef.current % palette.length;
    nextAccentIndexRef.current += 1;
    setAccent2(palette[idx]);
  }, []);

  return (
    <>
      <SceneBackground accent1={accent1} accent2={accent2} />
      <main className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8">
        {/* Hero */}
        <header className="pt-28 pb-24 sm:pt-40 sm:pb-32 min-h-[90vh] flex flex-col justify-center">
          <p className="mono text-sm neon-text-cyan mb-4 flicker">
            &gt; SYSTEM_ONLINE // IDENTITY_LOADED
          </p>
          <h1 className="font-display text-6xl sm:text-8xl font-900 tracking-tight mb-6 leading-none">
            <GlitchText text="JAE" />
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-dim)] leading-relaxed max-w-xl mb-8 font-display font-500">
            Final-year Computer Engineering student specializing in{" "}
            <span className="neon-text-cyan">applied AI</span> and{" "}
            <span className="neon-text-pink">full-stack/embedded</span> development.
            Ships production systems independently, end-to-end — including a
            real-time crime-detection platform live in production.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/unknowndevice077"
              target="_blank"
              rel="noopener noreferrer"
              className="mono text-sm px-5 py-3 bg-[var(--cyan)] text-black font-bold hover:shadow-[0_0_25px_rgba(0,255,242,0.6)] transition-shadow"
            >
              github.com/unknowndevice077
            </a>
            <a
              href="mailto:frjhay.delacruz@gmail.com"
              className="mono text-sm px-5 py-3 neon-border hover:shadow-[0_0_25px_rgba(0,255,242,0.25)]"
            >
              CONTACT_ME
            </a>
          </div>
          <p className="mono text-[11px] text-[var(--text-faint)] mt-10 animate-pulse">
            ↓ scroll — background reacts to what you're viewing
          </p>
        </header>

        {/* Skills */}
        <Reveal>
          <section className="py-16 border-t border-[var(--border)]">
            <h2 className="font-display text-sm neon-text-pink mb-8 uppercase tracking-[0.3em]">
              // Skills
            </h2>
            <div className="space-y-5">
              {skillGroups.map(([group, items]) => (
                <div key={group} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                  <span className="mono text-xs text-[var(--text-faint)] sm:w-44 shrink-0">
                    {group}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Projects — full immersive sections, background reacts as each scrolls into view */}
        <div>
          <Reveal>
            <h2 className="font-display text-sm neon-text-cyan pt-16 uppercase tracking-[0.3em]">
              // Featured Builds
            </h2>
          </Reveal>
          {projects.map((p, i) => (
            <ProjectSection key={p.slug} project={p} index={i} onActive={handleActive} />
          ))}
        </div>

        {/* Experience */}
        <Reveal>
          <section className="py-16 border-t border-[var(--border)]">
            <h2 className="font-display text-sm neon-text-pink mb-8 uppercase tracking-[0.3em]">
              // Experience
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display font-600">Freelance Video Editor — Remote</h3>
                  <span className="mono text-xs text-[var(--text-faint)]">Apr 2023 – Nov 2023</span>
                </div>
                <p className="text-sm text-[var(--text-dim)] mt-1">
                  Edited gaming and tutorial content for YouTube channels, improving viewership and live-stream engagement.
                </p>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display font-600">IT & Marketing Assistant (OJT) — Carlosta Hotel</h3>
                  <span className="mono text-xs text-[var(--text-faint)]">Jun 2021 – Jul 2021</span>
                </div>
                <p className="text-sm text-[var(--text-dim)] mt-1">
                  Maintained hotel IT systems and network devices; designed promotional materials for marketing campaigns.
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Education & Competitions */}
        <Reveal>
          <section className="py-16 border-t border-[var(--border)] grid sm:grid-cols-2 gap-10">
            <div>
              <h2 className="font-display text-sm neon-text-cyan mb-6 uppercase tracking-[0.3em]">
                // Education
              </h2>
              <h3 className="font-display font-600">Western Leyte College</h3>
              <p className="text-sm text-[var(--text-dim)] mb-2">Ormoc City, Philippines</p>
              <p className="text-sm text-[var(--text-dim)]">B.S. Computer Engineering — In Progress</p>
              <p className="mono text-xs text-[var(--text-faint)] mt-3 leading-relaxed">
                Embedded Systems Design · Computer Vision & Object Detection · Robotics Kinematics ·
                Microprocessor Systems (PIC16F84A Assembly) · Cloud Frameworks & Database Management.
                Senior High (ICT), graduated with honors — Outstanding Awardee in Technical-Vocational Education.
              </p>
            </div>
            <div>
              <h2 className="font-display text-sm neon-text-cyan mb-6 uppercase tracking-[0.3em]">
                // Competitions
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-sm font-600">CodeChum National Programming Challenge 2024</h3>
                  <p className="mono text-xs text-[var(--text-faint)] mt-1">
                    Certificate of Participation — trees, graphs, hash maps, DP, greedy.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-sm font-600">ISITE AI Hackathon 2026 — HexCorePH Labs</h3>
                  <p className="mono text-xs text-[var(--text-faint)] mt-1">
                    Built QuestScribe, an n8n-automated gamified learning platform with an AI chatbot tutor.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Footer */}
        <footer className="py-20 border-t border-[var(--border)] flex flex-col items-start gap-4">
          <p className="font-display text-2xl neon-text-pink">
            LET&apos;S BUILD SOMETHING.
          </p>
          <p className="text-sm text-[var(--text-dim)]">
            Open to remote full-time or contract work.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:frjhay.delacruz@gmail.com"
              className="mono text-sm neon-text-cyan hover:underline"
            >
              frjhay.delacruz@gmail.com
            </a>
            <span className="text-[var(--text-faint)]">·</span>
            <a
              href="https://github.com/unknowndevice077"
              target="_blank"
              rel="noopener noreferrer"
              className="mono text-sm neon-text-cyan hover:underline"
            >
              github.com/unknowndevice077
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
