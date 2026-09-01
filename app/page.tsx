type Project = {
  name: string;
  tagline: string;
  tech: string[];
  bullets: string[];
  href: string;
  flagship?: boolean;
};

const projects: Project[] = [
  {
    name: "EcoVision Security Sentinel",
    tagline: "Real-time crime detection platform — live production deployment",
    tech: ["YOLOv11", "X3D-XS", "FastAPI", "PostgreSQL", "Next.js", "Electron", "ESP32"],
    bullets: [
      "Built and deployed as a live pilot, processing real CCTV feeds for weapon, violence, and multi-person activity detection with human-in-the-loop alert review.",
      "Trained a YOLOv11 weapon detector (94.1% mAP@50, 90.3% recall) on a merged 24K-image dataset, and fine-tuned an X3D-XS violence classifier to 83.6% validation accuracy — iterating until both held up on real footage, not just clean benchmarks.",
      "Built the whole incident-management system around it: FastAPI/PostgreSQL backend, Next.js dashboard, an Electron desktop app, role-based access per barangay, and an ESP32-triggered siren for real alerts.",
    ],
    href: "https://github.com/unknowndevice077/ecovision-crime-detection-ai",
    flagship: true,
  },
  {
    name: "Studia",
    tagline: "AI-powered student assistant — defended 3rd-year software thesis",
    tech: ["Flutter", "Firebase Auth/Firestore", "SQLite", "Firebase AI"],
    bullets: [
      "Cross-platform (Android, iOS, Web, Windows, macOS, Linux) app unifying class scheduling, course-file management, and productivity tools — Pomodoro timer, lecture recording.",
      "Shipped AI-powered study features: an AI chatbot and automatic quiz generation from uploaded course materials, including audio-transcription-to-quiz.",
      "Backed by Firebase Auth/Firestore sync with SQLite offline storage; defended as a 3rd-year software thesis.",
    ],
    href: "https://github.com/unknowndevice077/Studia",
  },
  {
    name: "QuestScribe (isite)",
    tagline: "n8n-automated gamified learning platform — ISITE AI Hackathon 2026",
    tech: ["Next.js", "n8n", "AI SDK", "TypeScript"],
    bullets: [
      "Built for the ISITE AI Hackathon (HexCorePH Labs), addressing the automation brief on the learning track.",
      "An AI \"Dungeon Master\" turns study concepts into interactive quest narratives — an n8n-orchestrated chatbot tutor that evaluates answers and generates world content in real time.",
      "Full Next.js front end with a dedicated API layer bridging to n8n workflows for the AI narrative, evaluation, and world-generation logic.",
    ],
    href: "https://github.com/unknowndevice077/isite",
  },
  {
    name: "Aurum",
    tagline: "XAU/USD automated trading simulator",
    tech: ["Next.js", "TypeScript", "Upstash Redis"],
    bullets: [
      "Three trading modes — a persistent server-side bot, a browser-based simulator, and a historical backtester — sharing one signal engine for directly comparable results.",
      "EMA/RSI/MACD/Bollinger Band signals with Kelly-criterion position sizing.",
      "Backtest engine reconstructs true equity curves for drawdown analysis against real historical gold price data.",
    ],
    href: "https://github.com/unknowndevice077/aurum-xauusd-auto-trader",
  },
  {
    name: "Notion AI Assistant",
    tagline: "AI workflow tool built for a client",
    tech: ["Rust", "Tauri 2", "SQLite", "Ollama"],
    bullets: [
      "Built for a client to organize their work through natural-language prompts alone — turns a single prompt into organized pages and tasks directly in Notion.",
      "Sole developer of the full stack: OS-keyring credential storage, local Ollama or external API support (no cloud dependency required).",
      "Cross-platform (Windows + macOS) builds shipped via automated CI/CD.",
    ],
    href: "https://github.com/unknowndevice077/notion-ai-assistant",
  },
];

const skillGroups: [string, string[]][] = [
  ["AI / Computer Vision", ["YOLOv8/v11", "X3D video classification", "PyTorch transfer learning", "prompt engineering", "Ollama & LLM APIs", "n8n automation"]],
  ["Languages", ["Python", "TypeScript/JavaScript", "C/C++", "Java", "C#", "Rust", "Dart"]],
  ["Web & Mobile", ["React", "Next.js", "React Native", "Flutter", "Tauri", "HTML/CSS"]],
  ["Backend & Data", ["FastAPI", "PostgreSQL", "SQLite", "Redis", "Firebase", "Supabase"]],
  ["Embedded & Hardware", ["ESP32", "PIC16F84A (Assembly)", "AutoCAD", "Fusion 360", "Tinkercad"]],
];

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="mono text-[11px] px-2 py-1 rounded-full border border-[var(--border)] text-[var(--text-dim)]">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 sm:px-8">
      {/* Hero */}
      <header className="pt-24 pb-16 sm:pt-32 sm:pb-20">
        <p className="mono text-sm text-[var(--accent)] mb-4">
          hello, I&apos;m
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
          Fritz Dela Cruz
        </h1>
        <p className="text-lg text-[var(--text-dim)] leading-relaxed max-w-xl mb-6">
          Final-year Computer Engineering student specializing in applied AI
          and full-stack/embedded development. I ship production systems
          independently end-to-end — including a real-time crime-detection
          platform live in production. Open to remote roles, full-time or
          contract, in applied AI, full-stack, or embedded engineering.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/unknowndevice077"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-sm px-4 py-2 rounded-lg bg-[var(--accent)] text-[#0a0a0c] font-medium hover:opacity-90 transition-opacity"
          >
            github.com/unknowndevice077
          </a>
          <a
            href="mailto:frjhay.delacruz@gmail.com"
            className="mono text-sm px-4 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--accent-dim)] transition-colors"
          >
            frjhay.delacruz@gmail.com
          </a>
        </div>
      </header>

      {/* Skills */}
      <section className="py-12 border-t border-[var(--border)]">
        <h2 className="mono text-sm text-[var(--text-faint)] mb-6 uppercase tracking-wider">
          Skills
        </h2>
        <div className="space-y-4">
          {skillGroups.map(([group, items]) => (
            <div key={group} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
              <span className="text-sm text-[var(--text-dim)] sm:w-40 shrink-0">
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

      {/* Projects */}
      <section className="py-12 border-t border-[var(--border)]">
        <h2 className="mono text-sm text-[var(--text-faint)] mb-8 uppercase tracking-wider">
          Featured Projects
        </h2>
        <div className="space-y-10">
          {projects.map((p) => (
            <article
              key={p.name}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 hover:border-[var(--accent-dim)] transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-1">
                <h3 className="text-lg font-medium">
                  {p.name}
                  {p.flagship && (
                    <span className="mono text-[10px] ml-2 px-2 py-0.5 rounded-full bg-[var(--accent)] text-[#0a0a0c] align-middle">
                      LIVE
                    </span>
                  )}
                </h3>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono text-xs text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors shrink-0"
                >
                  view →
                </a>
              </div>
              <p className="text-sm text-[var(--text-dim)] mb-4">{p.tagline}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {p.tech.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <ul className="space-y-2">
                {p.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="text-sm text-[var(--text-dim)] leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-[var(--text-faint)]"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="text-sm text-[var(--text-faint)] mt-6">
          Plus 12+ additional repos on GitHub — EcoVision Smartpole, a line-following robot,
          LeadPilot (job-board matching), and embedded builds (fire alarms, toll gates, energy harvesting).
        </p>
      </section>

      {/* Experience */}
      <section className="py-12 border-t border-[var(--border)]">
        <h2 className="mono text-sm text-[var(--text-faint)] mb-6 uppercase tracking-wider">
          Experience
        </h2>
        <div className="space-y-6">
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">Freelance Video Editor — Remote</h3>
              <span className="mono text-xs text-[var(--text-faint)]">Apr 2023 – Nov 2023</span>
            </div>
            <p className="text-sm text-[var(--text-dim)] mt-1">
              Edited gaming and tutorial content for YouTube channels, improving viewership and live-stream engagement.
            </p>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">IT & Marketing Assistant (OJT) — Carlosta Hotel</h3>
              <span className="mono text-xs text-[var(--text-faint)]">Jun 2021 – Jul 2021</span>
            </div>
            <p className="text-sm text-[var(--text-dim)] mt-1">
              Maintained hotel IT systems and network devices; designed promotional materials for marketing campaigns.
            </p>
          </div>
        </div>
      </section>

      {/* Education & Competitions */}
      <section className="py-12 border-t border-[var(--border)] grid sm:grid-cols-2 gap-10">
        <div>
          <h2 className="mono text-sm text-[var(--text-faint)] mb-6 uppercase tracking-wider">
            Education
          </h2>
          <h3 className="font-medium">Western Leyte College</h3>
          <p className="text-sm text-[var(--text-dim)] mb-2">Ormoc City, Philippines</p>
          <p className="text-sm text-[var(--text-dim)]">
            B.S. Computer Engineering — In Progress
          </p>
          <p className="text-xs text-[var(--text-faint)] mt-2 leading-relaxed">
            Embedded Systems Design · Computer Vision & Object Detection · Robotics Kinematics ·
            Microprocessor Systems (PIC16F84A Assembly) · Cloud Frameworks & Database Management.
            Senior High (ICT), graduated with honors — Outstanding Awardee in Technical-Vocational Education.
          </p>
        </div>
        <div>
          <h2 className="mono text-sm text-[var(--text-faint)] mb-6 uppercase tracking-wider">
            Competitions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm">CodeChum National Programming Challenge 2024</h3>
              <p className="text-xs text-[var(--text-faint)] mt-1">
                Certificate of Participation — algorithmic problem-solving (trees, graphs, hash maps, DP, greedy).
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm">ISITE AI Hackathon 2026 — HexCorePH Labs</h3>
              <p className="text-xs text-[var(--text-faint)] mt-1">
                Built QuestScribe, an n8n-automated gamified learning platform with an AI chatbot tutor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-[var(--border)] flex flex-col items-start gap-3">
        <p className="text-sm text-[var(--text-dim)]">
          Open to remote full-time or contract work — reach out anytime.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:frjhay.delacruz@gmail.com"
            className="mono text-sm text-[var(--accent)] hover:underline"
          >
            frjhay.delacruz@gmail.com
          </a>
          <span className="text-[var(--text-faint)]">·</span>
          <a
            href="https://github.com/unknowndevice077"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-sm text-[var(--accent)] hover:underline"
          >
            github.com/unknowndevice077
          </a>
        </div>
      </footer>
    </main>
  );
}
