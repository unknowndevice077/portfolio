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
  demoScale?: number; // renders the iframe at 1/scale size then CSS-scales it down, so a demo that reads too zoomed-in shows more of its layout in the same box
  showN8nWorkflow?: boolean; // renders the real n8n node graph powering this project
  languages?: { name: string; percent: number; color: string }[]; // real GitHub language breakdown, by bytes
  caseStudy?: { heading: string; body: string }[]; // deeper technical write-up, rendered on the project detail page
};

// Standard GitHub linguist colors, for the language bar to look native.
export const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Dart: "#00B4AB",
  Rust: "#dea584",
  CSS: "#563d7c",
  HTML: "#e34c26",
  "C++": "#f34b7d",
  CMake: "#DA3434",
  Swift: "#F05138",
  C: "#555555",
  Kotlin: "#A97BFF",
  "Objective-C": "#438eff",
  Batchfile: "#C1F12E",
  PowerShell: "#012456",
  "Inno Setup": "#264b99",
  Shell: "#89e051",
  Other: "#6b7280",
};

export const projects: Project[] = [
  {
    slug: "ecovision",
    name: "EcoVision Security Sentinel",
    tagline: "Real-time crime detection platform — built for streetlight-pole deployment, validated on real CCTV footage",
    tech: ["YOLOv11", "X3D-XS", "FastAPI", "PostgreSQL", "Next.js", "Electron", "ESP32"],
    bullets: [
      "Full pipeline validated end-to-end against real captured CCTV footage and a live RTSP camera feed — not just benchmark clips — ahead of physical barangay/streetlight-pole installation.",
      "YOLOv11 weapon detector: 94.1% mAP@50, 90.3% recall on a merged 24K-image dataset.",
      "X3D-XS violence classifier: found and fixed a hidden double-softmax bug plus dataset leakage that had capped four prior retrains at ~70% held-out accuracy — corrected, honest test accuracy: 95.0%.",
      "Pushed testing past the clean benchmark: real, continuously-running street footage surfaced a 44.3% false-positive rate on that source that curated clips never exposed — now the active focus. Full incident-management system built around it regardless: FastAPI/PostgreSQL backend, Next.js dashboard, Electron app, multi-tenant barangay/PNP access, ESP32-triggered siren.",
    ],
    href: "https://github.com/unknowndevice077/ecovision-crime-detection-ai",
    languages: [
      { name: "Python", percent: 54, color: LANGUAGE_COLORS.Python },
      { name: "TypeScript", percent: 33, color: LANGUAGE_COLORS.TypeScript },
      { name: "JavaScript", percent: 5, color: LANGUAGE_COLORS.JavaScript },
      { name: "Other", percent: 8, color: LANGUAGE_COLORS.Other },
    ],
    flagship: true,
    accent: "#8fd400",
    accentRgb: "143, 212, 0",
    visual: "ecovision",
    longDescription:
      "A real-time crime-detection platform engineered for a solar-powered smart streetlight pole — YOLO models handle per-frame person, weapon, and pose detection while an X3D-XS video classifier judges violence over a temporal window, the same two-architecture split used in modern video-anomaly research: cheap 2D convolutions for spatial work that has to run every frame, expensive 3D convolutions only where the temporal reasoning an action actually requires them. Four earlier retrains of the violence classifier had plateaued around 70% held-out accuracy with no identified cause. A systematic diagnostic pass — measure, don't assume — found and fixed five distinct defects, including a hidden double-softmax bug that put a hard mathematical floor under the training loss, and pushed honest, never-seen-in-training test accuracy to 95.0%. Rather than stop at a clean benchmark number, the corrected model was then validated against real, continuously-running Philippine street CCTV footage, which surfaced what no benchmark clip could: a false-positive problem invisible in curated data. That finding — 91.9% accuracy overall but a 44.3% false-positive rate on the one real-CCTV-only source — is reported honestly rather than smoothed over, and is the current focus of the work. Around the detection core sits a full incident-management system: a FastAPI/PostgreSQL backend, a Next.js review dashboard, an Electron desktop app for on-site operators, multi-tenant role-based access split between barangay and PNP-station hierarchies, and an ESP32-triggered physical siren with live telemetry (battery, solar voltage) for confirmed alerts. The system is built and field-validated against real footage; physical installation on a barangay streetlight pole is the next step, not yet complete.",
    caseStudy: [
      {
        heading: "The plateau",
        body: "The violence classifier had been retrained four separate times — varying unfreeze depth, augmentation, class oversampling, input representation — without breaking a held-out accuracy plateau of roughly 70%. No prior retrain had identified why accuracy was capped, only that it was. The rule for this pass was measure, don't assume: diagnose the actual cause through systematic testing rather than more blind hyperparameter search.",
      },
      {
        heading: "Five defects, one root cause",
        body: "An audit turned up detection silently coupled to tracking (17.2% of held-out clips never reached the classifier at all, inflating apparent accuracy by giving away easy true negatives for free), and dataset leakage — 485 byte-identical duplicate files, 12.1% of the held-out set with a byte-for-byte twin in training, from a random-shuffle split. Both were fixed structurally: a whole-frame classification path removed the tracking gate, and a SHA-256 content-hash split now makes that class of leakage impossible to reintroduce by accident. The deepest defect was a double-softmax bug: the model's classification head already ends in Softmax, but both the training loss and the live inference code applied softmax again to an already-softmaxed value. That put a hard floor under the training loss — measured at exactly 0.3133 across 390 logged batches, never lower — which collapsed the loss's dynamic range and starved the model of gradient signal on its hardest examples. It's the strongest candidate for the true cause of four retrains plateauing in the same place.",
      },
      {
        heading: "95.0% — honestly earned",
        body: "With the leakage and double-softmax fixed, and re-evaluated on a three-way manifest split (train/val/test assigned by content hash, so validation and final reporting are never the same data), held-out test accuracy went from a 78.4% baseline to 95.0% (97.4% recall, 92.9% precision) — measured through the actual deployed inference path, not a clean offline loader, against a test split never read during training or checkpoint selection.",
      },
      {
        heading: "What the benchmark couldn't show",
        body: "A clean number from curated clips (RWF-2000, SCVD — balanced classes, median person height 37% of frame) doesn't prove a model works on the system's real deployment target: a wide, elevated streetlight camera where people are 6–12% of frame height and violence is rare, not 50% of all footage. Validating against that directly surfaced two problems no benchmark exposed. First, a scale blind spot — the model wasn't less confident on small, distant people, it was blind: 0 of 40 clips detected at ~9% person height that it scored a perfect 1.000 on at close range — fixed via tiled scene inference and scale-augmented retraining. Second, validating against real, continuously-running footage (not just clips) surfaced a false-alarm-rate problem — 4 to 14 alerts/hour — that neither fix addressed, traced to the model never having seen ordinary real street footage, only curated benchmark clips.",
      },
      {
        heading: "The honest current state",
        body: "Fine-tuning on real CCTV footage (CCTV-Fights, plus self-captured Philippine street footage) closed part of that gap: the fine-tuned weights in scene mode measured 0.00 false alarms/hour on 5 of 6 real validation clips at night, at 92.5% recall — now deployed. But extending validation to an axis that had been held constant by accident, not design, overturned part of that result: all six clips were night footage, and the same configuration produces up to 75.20 false alarms/hour in daytime capture. A parallel audit of the train/test split then found 270 of 280 source videos had segments leaking across both sides — fixed with a group-aware split, which produced the most honest number this project has: 91.9% accuracy overall, but 67.0% accuracy and a 44.3% false-positive rate on the one real-CCTV-only source, with the aggregate carried by benchmark data. That's the actual state of the work — not a finished product, a rigorously measured one, with its remaining weak point identified instead of hidden. Closing that gap is the current focus, ahead of physical pole installation.",
      },
    ],
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
    languages: [
      { name: "Dart", percent: 94, color: LANGUAGE_COLORS.Dart },
      { name: "Other", percent: 6, color: LANGUAGE_COLORS.Other },
    ],
    accent: "#5eead4",
    accentRgb: "94, 234, 212",
    visual: "studia",
    longDescription:
      "A cross-platform student productivity app — Android, iOS, Web, Windows, macOS, and Linux from one Flutter codebase — built to unify the scattered tools students actually use: class scheduling with real-time updates, per-class course-file management, a Pomodoro timer, and lecture audio recording. On top of that sits an AI layer: a chatbot for study support, automatic quiz generation from uploaded course materials, and audio-transcription-to-quiz so a recorded lecture becomes a study set without manual work. Firebase Auth and Firestore handle account sync across devices, backed by local SQLite storage so the app stays usable offline. Defended as a 3rd-year software engineering thesis.",
  },
  {
    slug: "questscribe",
    name: "QuestScribe (HexCorePH n8n Hackathon)",
    tagline: "Gamified learning platform, born as an n8n workflow — ISITE AI Hackathon 2026",
    tech: ["Next.js", "AI SDK", "Gemini", "TypeScript", "n8n"],
    bullets: [
      "Built for the ISITE AI Hackathon (HexCorePH Labs), automation brief, learning track.",
      "An AI Dungeon Master turns study concepts into quest narratives — an in-character tutor that evaluates answers and generates a whole quest world from source material.",
      "Prototyped as orchestrated n8n workflows for the hackathon (diagrammed below); re-architected onto Next.js API routes calling Gemini directly for a demo that's reliably live, not tied to a workflow host staying up.",
    ],
    href: "https://github.com/unknowndevice077/isite",
    demoUrl: "https://isite.vercel.app",
    demoScale: 0.8,
    languages: [
      { name: "TypeScript", percent: 90, color: LANGUAGE_COLORS.TypeScript },
      { name: "CSS", percent: 9, color: LANGUAGE_COLORS.CSS },
      { name: "Other", percent: 1, color: LANGUAGE_COLORS.Other },
    ],
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
    languages: [{ name: "TypeScript", percent: 100, color: LANGUAGE_COLORS.TypeScript }],
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
    languages: [
      { name: "Rust", percent: 61, color: LANGUAGE_COLORS.Rust },
      { name: "TypeScript", percent: 37, color: LANGUAGE_COLORS.TypeScript },
      { name: "Other", percent: 2, color: LANGUAGE_COLORS.Other },
    ],
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
