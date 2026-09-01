"use client";

import SceneBackground from "./components/SceneBackground";
import GlitchText from "./components/GlitchText";
import TiltCard from "./components/TiltCard";
import Reveal from "./components/Reveal";
import {
  EcoVisionVisual,
  StudiaVisual,
  QuestScribeVisual,
  AurumVisual,
  NotionAIVisual,
} from "./components/ProjectVisual";

type Project = {
  name: string;
  tagline: string;
  tech: string[];
  bullets: string[];
  href: string;
  flagship?: boolean;
  accent: string;
  visual: React.ReactNode;
};

const projects: Project[] = [
  {
    name: "EcoVision Security Sentinel",
    tagline: "Real-time crime detection platform — live production deployment",
    tech: ["YOLOv11", "X3D-XS", "FastAPI", "PostgreSQL", "Next.js", "Electron", "ESP32"],
    bullets: [
      "Live pilot processing real CCTV feeds for weapon, violence, and multi-person activity detection with human-in-the-loop review.",
      "YOLOv11 weapon detector: 94.1% mAP@50, 90.3% recall on a merged 24K-image dataset. X3D-XS violence classifier: 83.6% validation accuracy.",
      "Full incident-management system: FastAPI/PostgreSQL backend, Next.js dashboard, Electron desktop app, role-based access per barangay, ESP32-triggered siren.",
    ],
    href: "https://github.com/unknowndevice077/ecovision-crime-detection-ai",
    flagship: true,
    accent: "#ff2fd6",
    visual: <EcoVisionVisual />,
  },
  {
    name: "Studia",
    tagline: "AI-powered student assistant — defended 3rd-year software thesis",
    tech: ["Flutter", "Firebase Auth/Firestore", "SQLite", "Firebase AI"],
    bullets: [
      "Cross-platform (Android, iOS, Web, Windows, macOS, Linux) app unifying class scheduling, course files, and productivity tools.",
      "AI chatbot and automatic quiz generation from uploaded course materials, including audio-transcription-to-quiz.",
      "Firebase Auth/Firestore sync with SQLite offline storage.",
    ],
    href: "https://github.com/unknowndevice077/Studia",
    accent: "#00fff2",
    visual: <StudiaVisual />,
  },
  {
    name: "QuestScribe (isite)",
    tagline: "n8n-automated gamified learning platform — ISITE AI Hackathon 2026",
    tech: ["Next.js", "n8n", "AI SDK", "TypeScript"],
    bullets: [
      "Built for the ISITE AI Hackathon (HexCorePH Labs), automation brief, learning track.",
      "An AI Dungeon Master turns study concepts into quest narratives — n8n-orchestrated chatbot tutor that evaluates answers and generates world content live.",
      "Next.js front end bridged to n8n workflows for narrative, evaluation, and world-generation logic.",
    ],
    href: "https://github.com/unknowndevice077/isite",
    accent: "#f2ff00",
    visual: <QuestScribeVisual />,
  },
  {
    name: "Aurum",
    tagline: "XAU/USD automated trading simulator",
    tech: ["Next.js", "TypeScript", "Upstash Redis"],
    bullets: [
      "Three trading modes — persistent server-side bot, browser simulator, historical backtester — one shared signal engine.",
      "EMA/RSI/MACD/Bollinger Band signals with Kelly-criterion position sizing.",
      "Backtest engine reconstructs true equity curves for drawdown analysis on real historical gold price data.",
    ],
    href: "https://github.com/unknowndevice077/aurum-xauusd-auto-trader",
    accent: "#00ffa2",
    visual: <AurumVisual />,
  },
  {
    name: "Notion AI Assistant",
    tagline: "AI workflow tool built for a client",
    tech: ["Rust", "Tauri 2", "SQLite", "Ollama"],
    bullets: [
      "One prompt becomes organized pages and tasks directly in Notion — no manual setup.",
      "Sole developer of the full stack: OS-keyring credential storage, local Ollama or external API, no cloud dependency required.",
      "Cross-platform (Windows + macOS) builds via automated CI/CD.",
    ],
    href: "https://github.com/unknowndevice077/notion-ai-assistant",
    accent: "#a855f7",
    visual: <NotionAIVisual />,
  },
];

const skillGroups: [string, string[]][] = [
  ["AI / Computer Vision", ["YOLOv8/v11", "X3D video classification", "PyTorch transfer learning", "prompt engineering", "Ollama & LLM APIs", "n8n automation"]],
  ["Languages", ["Python", "TypeScript/JavaScript", "C/C++", "Java", "C#", "Rust", "Dart"]],
  ["Web & Mobile", ["React", "Next.js", "React Native", "Flutter", "Tauri", "HTML/CSS"]],
  ["Backend & Data", ["FastAPI", "PostgreSQL", "SQLite", "Redis", "Firebase", "Supabase"]],
  ["Embedded & Hardware", ["ESP32", "PIC16F84A (Assembly)", "AutoCAD", "Fusion 360", "Tinkercad"]],
];

function Tag({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <span
      className="mono text-[11px] px-2 py-1 rounded-full border"
      style={{
        borderColor: accent ? `${accent}55` : "#23232f",
        color: accent || "#9494a8",
      }}
    >
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <>
      <SceneBackground />
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

        {/* Projects */}
        <section className="py-16 border-t border-[var(--border)]">
          <Reveal>
            <h2 className="font-display text-sm neon-text-cyan mb-10 uppercase tracking-[0.3em]">
              // Featured Builds
            </h2>
          </Reveal>
          <div className="space-y-16">
            {projects.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <TiltCard>
                  <article
                    className="grid sm:grid-cols-2 gap-6 rounded-xl border p-5 sm:p-6 bg-[var(--bg-elev)]/70 backdrop-blur-sm transition-all"
                    style={{ borderColor: `${p.accent}30` }}
                  >
                    <div className="order-2 sm:order-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-display text-lg font-700">{p.name}</h3>
                        {p.flagship && (
                          <span
                            className="mono text-[10px] px-2 py-0.5 rounded-full font-bold pulse-glow"
                            style={{ background: p.accent, color: "#000" }}
                          >
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-dim)] mb-4">{p.tagline}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.tech.map((t) => (
                          <Tag key={t} accent={p.accent}>{t}</Tag>
                        ))}
                      </div>
                      <ul className="space-y-2 mb-4">
                        {p.bullets.map((b, bi) => (
                          <li
                            key={bi}
                            className="text-sm text-[var(--text-dim)] leading-relaxed pl-4 relative"
                          >
                            <span
                              className="absolute left-0"
                              style={{ color: p.accent }}
                            >
                              ▸
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono text-xs font-bold hover:underline"
                        style={{ color: p.accent }}
                      >
                        VIEW_SOURCE →
                      </a>
                    </div>
                    <div className="order-1 sm:order-2 flex items-center">
                      {p.visual}
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mono text-xs text-[var(--text-faint)] mt-10">
              // 12+ additional repos: EcoVision Smartpole, line-following robot,
              LeadPilot (job-board matching), embedded builds (fire alarms, toll
              gates, energy harvesting).
            </p>
          </Reveal>
        </section>

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
