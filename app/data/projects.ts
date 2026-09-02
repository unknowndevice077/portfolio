export type Project = {
  slug: string;
  name: string;
  tagline: string;
  tech: string[];
  bullets: string[];
  href: string;
  flagship?: boolean;
  accent: string;
  accentRgb: string; // "r, g, b" for use in rgba()
  visual: "ecovision" | "studia" | "questscribe" | "aurum" | "notion";
  longDescription: string;
  demoUrl?: string; // live, embeddable deployment - shown as a real iframe instead of the static mockup
  showN8nWorkflow?: boolean; // renders the real n8n node graph powering this project
};

export const projects: Project[] = [
  {
    slug: "ecovision",
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
    accent: "#8fd400",
    accentRgb: "143, 212, 0",
    visual: "ecovision",
    longDescription:
      "A real-time crime-detection platform built and deployed as a live pilot for barangay-level security. It processes live CCTV feeds through a trained computer vision pipeline to flag weapons, violence, and unusual multi-person activity, routing every detection through a human-in-the-loop review step before any alert fires — because a false positive at 2am should never trigger a siren on its own. The YOLOv11 weapon detector was trained on a merged 24K-image dataset and tuned to 94.1% mAP@50 with 90.3% recall; the X3D-XS violence classifier was fine-tuned to 83.6% validation accuracy — both iterated against real footage, not just clean benchmark sets. Around the models sits a full incident-management system: a FastAPI/PostgreSQL backend, a Next.js review dashboard, an Electron desktop app for on-site operators, role-based access scoped per barangay, and an ESP32-triggered physical siren for confirmed alerts.",
  },
  {
    slug: "studia",
    name: "Studia",
    tagline: "AI-powered student assistant — defended 3rd-year software thesis",
    tech: ["Flutter", "Firebase Auth/Firestore", "SQLite", "Firebase AI"],
    bullets: [
      "Cross-platform (Android, iOS, Web, Windows, macOS, Linux) app unifying class scheduling, course files, and productivity tools.",
      "AI chatbot and automatic quiz generation from uploaded course materials, including audio-transcription-to-quiz.",
      "Firebase Auth/Firestore sync with SQLite offline storage.",
    ],
    href: "https://github.com/unknowndevice077/Studia",
    demoUrl: "https://studia-48762.web.app",
    accent: "#5eead4",
    accentRgb: "94, 234, 212",
    visual: "studia",
    longDescription:
      "A cross-platform student productivity app — Android, iOS, Web, Windows, macOS, and Linux from one Flutter codebase — built to unify the scattered tools students actually use: class scheduling with real-time updates, per-class course-file management, a Pomodoro timer, and lecture audio recording. On top of that sits an AI layer: a chatbot for study support, automatic quiz generation from uploaded course materials, and audio-transcription-to-quiz so a recorded lecture becomes a study set without manual work. Firebase Auth and Firestore handle account sync across devices, backed by local SQLite storage so the app stays usable offline. Defended as a 3rd-year software engineering thesis.",
  },
  {
    slug: "questscribe",
    name: "QuestScribe (isite)",
    tagline: "Gamified learning platform, born as an n8n workflow — ISITE AI Hackathon 2026",
    tech: ["Next.js", "AI SDK", "Gemini", "TypeScript", "n8n"],
    bullets: [
      "Built for the ISITE AI Hackathon (HexCorePH Labs), automation brief, learning track.",
      "An AI Dungeon Master turns study concepts into quest narratives — an in-character tutor that evaluates answers and generates a whole quest world from source material.",
      "Prototyped as orchestrated n8n workflows for the hackathon (diagrammed below); re-architected onto Next.js API routes calling Gemini directly for a demo that's reliably live, not tied to a workflow host staying up.",
    ],
    href: "https://github.com/unknowndevice077/isite",
    demoUrl: "https://isite.vercel.app",
    accent: "#fbbf24",
    accentRgb: "251, 191, 36",
    visual: "questscribe",
    showN8nWorkflow: true,
    longDescription:
      "Built in a hackathon sprint for the ISITE AI Hackathon (HexCorePH Labs) under the automation brief's learning track. QuestScribe turns study material into an interactive fantasy quest: an AI \"Dungeon Master\" narrates a story built around whatever concept you're learning, judges your answers in-character, and awards XP or HP penalties based on whether you actually understood the material. The hackathon build orchestrated that AI logic — narrative engine, answer evaluation, world generation — as n8n workflows behind the Next.js front end (see the workflow diagram below for that original architecture). For the live demo, the same three AI calls now run as direct Next.js API routes calling Gemini, so it stays reliably reachable without depending on a separately-hosted workflow instance.",
  },
  {
    slug: "aurum",
    name: "Aurum",
    tagline: "XAU/USD automated trading simulator",
    tech: ["Next.js", "TypeScript", "Upstash Redis"],
    bullets: [
      "Three trading modes — persistent server-side bot, browser simulator, historical backtester — one shared signal engine.",
      "EMA/RSI/MACD/Bollinger Band signals with Kelly-criterion position sizing.",
      "Backtest engine reconstructs true equity curves for drawdown analysis on real historical gold price data.",
    ],
    href: "https://github.com/unknowndevice077/aurum-xauusd-auto-trader",
    demoUrl: "https://aurum-app-ecru.vercel.app",
    accent: "#34d399",
    accentRgb: "52, 211, 153",
    visual: "aurum",
    longDescription:
      "An automated trading system for XAU/USD (gold), built around one shared signal engine driving three distinct modes: a persistent server-side bot that runs continuously, a browser-based simulator for manual experimentation, and a historical backtester — all producing directly comparable results since they share the same underlying logic. Signals combine EMA, RSI, MACD, and Bollinger Bands, sized using the Kelly criterion rather than fixed lot sizes. The backtest engine reconstructs true equity curves against real historical gold price data, making drawdown analysis meaningful instead of theoretical.",
  },
  {
    slug: "notion-ai-assistant",
    name: "Notion AI Assistant",
    tagline: "AI workflow tool built for a client",
    tech: ["Rust", "Tauri 2", "SQLite", "Ollama"],
    bullets: [
      "One prompt becomes organized pages and tasks directly in Notion — no manual setup.",
      "Sole developer of the full stack: OS-keyring credential storage, local Ollama or external API, no cloud dependency required.",
      "Cross-platform (Windows + macOS) builds via automated CI/CD.",
    ],
    href: "https://github.com/unknowndevice077/notion-ai-assistant",
    accent: "#a78bfa",
    accentRgb: "167, 139, 250",
    visual: "notion",
    longDescription:
      "A desktop AI workflow tool built for a client who wanted to organize their work through plain language alone. A single natural-language prompt gets turned into properly structured pages and tasks directly in the client's Notion workspace — no manual template setup, no clicking through menus. Built solo, full stack: a Rust/Tauri 2 desktop shell for a small, fast cross-platform binary, OS-keyring credential storage so API keys never touch disk in plaintext, and a choice between local Ollama or an external API so the client isn't locked into a cloud dependency. Windows and macOS builds ship via automated CI/CD.",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
