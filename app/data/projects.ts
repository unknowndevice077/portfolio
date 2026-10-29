export type Project = {
  slug: string;
  name: string;
  tagline: string;
  tech: string[];
  bullets: string[];
  href?: string; // source repo; omitted when the code is not public
  flagship?: boolean;
  accent: string;
  accentRgb: string; // "r, g, b" for use in rgba()
  visual?: "ecovision" | "studia" | "questscribe" | "aurum" | "notion" | "clash" | "queueup" | "bantay" | "jaemboy" | "leadcatch" | "mednotes";
  longDescription: string;
  siteUrl?: string; // live site that can't be framed, so it's only linked
  demoUrl?: string; // live, embeddable deployment - shown as a real iframe instead of the static mockup
  demoScale?: number; // renders the iframe at 1/scale size then CSS-scales it down, so a demo that reads too zoomed-in shows more of its layout in the same box
  showN8nWorkflow?: boolean; // renders the real n8n node graph powering this project
  languages?: { name: string; percent: number; color: string }[]; // real GitHub language breakdown, by bytes
  caseStudy?: { heading: string; body: string }[]; // deeper technical write-up, rendered on the project detail page
  // When one entry covers several separately-deployed live apps (a
  // shared-stack trilogy of games, say) — rendered as "Play X" links on
  // both the card and the detail page, instead of forcing near-identical
  // full project entries for each one.
  playLinks?: { name: string; url: string }[];
  categories: Category[];
  highlight: string; // one headline result, shown on the grid card
};

export type Category = "AI & Vision" | "Full-Stack" | "Embedded & IoT" | "Automation";
export const CATEGORIES: Category[] = ["AI & Vision", "Full-Stack", "Embedded & IoT", "Automation"];

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
  Java: "#b07219",
  Shell: "#89e051",
  Other: "#6b7280",
};

export const projects: Project[] = [
  {
    slug: "ecovision",
    categories: ["AI & Vision", "Full-Stack", "Embedded & IoT"],
    highlight: "88% of fights caught at 2.0 false alarms/hr on unseen cameras",
    name: "EcoVision Security Sentinel",
    tagline: "Real-time AI crime detection for barangay CCTV — measured on cameras it never trained on, now in field testing",
    tech: ["YOLO11", "X3D-XS", "PyTorch", "FastAPI", "Next.js", "Electron", "ESP32"],
    bullets: [
      "Detects violence, weapons, vandalism and robbery on a live camera feed: YOLO11-pose tracks every person, X3D-XS video classifiers score short clips, and confirmation rules decide what reaches a human reviewer.",
      "Violence: a two-model ensemble with person-crop confirmation catches 88.0% of 200 held-out fights at 2.0 false alarms per hour on four real cameras it never trained on (93.1% accuracy on 1,310 held-out clips).",
      "Weapons: fine-tuning on 7,500 synthetic street-camera frames (real gun and knife cut-outs pasted at real people's wrists) cut false weapons on street footage about 8× and lifted recall on street-size guns from 14% to 39%.",
      "Full incident system around it: FastAPI backend, Next.js dashboard with live WebSocket alerts, Electron installer, barangay/PNP role-based access with an audit log, Telegram/SMS responder alerts, auto-drafted police reports and an ESP32 siren.",
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
      "A real-time crime-detection platform engineered for a solar-powered smart streetlight pole — YOLO models handle per-frame person, weapon, and pose detection while an X3D-XS video classifier judges violence over a temporal window, the same two-architecture split used in modern video-anomaly research: cheap 2D convolutions for spatial work that has to run every frame, expensive 3D convolutions only where the temporal reasoning an action actually requires them. Four earlier retrains of the violence classifier had plateaued around 70% held-out accuracy with no identified cause. A systematic diagnostic pass — measure, don't assume — found and fixed five distinct defects, including a hidden double-softmax bug that put a hard mathematical floor under the training loss, and pushed honest, never-seen-in-training test accuracy to 95.0%. Rather than stop at a clean benchmark number, the corrected model was then validated against real, continuously-running Philippine street CCTV footage, which surfaced what no benchmark clip could: a false-positive problem invisible in curated data. That finding drove the next round of work: a two-model ensemble, person-crop confirmation and measurement on held-out real cameras, which brought violence detection to 88% of fights caught at about two false alarms per hour. Weapon, vandalism and robbery detectors now run alongside it, each measured the same way. Around the detection core sits a full incident-management system: a FastAPI backend (SQLite or PostgreSQL), a Next.js review dashboard, an Electron desktop app for on-site operators, multi-tenant role-based access split between barangay and PNP-station hierarchies, and an ESP32-triggered physical siren with live telemetry (battery, solar voltage) for confirmed alerts. The system is in field testing on real footage; physical installation on a barangay streetlight pole is the next step, not yet complete.",
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
        heading: "The next problem it found",
        body: "Fine-tuning on real CCTV footage (CCTV-Fights, plus self-captured Philippine street footage) closed part of that gap: the fine-tuned weights in scene mode measured 0.00 false alarms/hour on 5 of 6 real validation clips at night, at 92.5% recall — now deployed. But extending validation to an axis that had been held constant by accident, not design, overturned part of that result: all six clips were night footage, and the same configuration produces up to 75.20 false alarms/hour in daytime capture. A parallel audit of the train/test split then found 270 of 280 source videos had segments leaking across both sides — fixed with a group-aware split, which produced the most honest number this project has: 91.9% accuracy overall, but 67.0% accuracy and a 44.3% false-positive rate on the one real-CCTV-only source, with the aggregate carried by benchmark data. That's the actual state of the work — not a finished product, a rigorously measured one, with its remaining weak point identified instead of hidden. Closing that gap is the current focus, ahead of physical pole installation.",
      },
      {
        heading: "Where it stands now",
        body: "The sections above are how the project got here. The current measured state, from the repo's detection performance report: violence detection is a two-model X3D-XS ensemble whose whole-frame score is confirmed against crops around the people the pose model found, so a busy street with no struggle can't raise an alarm on its own. It catches 88.0% of 200 held-out fights (from 200 different source videos, spliced into continuous street footage) at 2.0 false alarms per hour on four held-out real cameras, and scores 93.1% accuracy, 92.8% recall and 93.4% precision on 1,310 held-out test clips. The weapon detector catches 89.6% of large guns but only 39.4% of street-size guns, so small, distant weapons remain the hard case. Vandalism (87.1% of 31 acts at 1.0 false alarm/hour) and robbery (39.8% of test clips at 0.5/hour) are labelled experimental in the app.",
      },
    ],
  },
  {
    slug: "bantay-baha",
    categories: ["Embedded & IoT", "AI & Vision", "Full-Stack"],
    highlight: "Median 18-minute flood warning, 48% better than baseline",
    name: "Bantay Baha",
    tagline: "IoT flood early-warning system for a creekside barangay, with a live 3D simulator",
    tech: ["ESP32", "Ultrasonic sensor", "TypeScript", "Three.js", "scikit-learn"],
    bullets: [
      "A solar-powered ESP32 smart pole with a waterproof ultrasonic sensor measures the creek, about ₱2,000–8,000 per node in parts, and drives multilingual advisories, sirens and evacuation.",
      "Gradient-boosted forecaster trained on 900 synthetic storms, split by storm: 48% lower error than a no-change baseline at +30 min, with a median 18-minute warning before the creek reaches WARNING.",
      "A camera reading the painted staff gauge acts as a second sensor, so frozen, erratic or drifting readings raise a SENSOR FAULT instead of a silent wrong number.",
      "Three pages: a free-camera 3D simulator, a first-person story game as the barangay captain, and the operations dashboard a barangay would actually use.",
    ],
    href: "https://github.com/unknowndevice077/bantay-baha",
    demoUrl: "https://embeddedbantaybaha.vercel.app",
    languages: [
      { name: "TypeScript", percent: 82, color: LANGUAGE_COLORS.TypeScript },
      { name: "CSS", percent: 8, color: LANGUAGE_COLORS.CSS },
      { name: "HTML", percent: 5, color: LANGUAGE_COLORS.HTML },
      { name: "Python", percent: 4, color: LANGUAGE_COLORS.Python },
      { name: "Other", percent: 1, color: LANGUAGE_COLORS.Other },
    ],
    accent: "#38bdf8",
    accentRgb: "56, 189, 248",
    visual: "bantay",
    longDescription:
      "Bantay Baha (\"flood watch\") is a flood early-warning system for a Philippine barangay beside a creek. A solar-powered smart pole carries an ESP32 and a waterproof ultrasonic sensor that measures the distance down to the water, with temperature correction so a hot afternoon doesn't read as a few centimetres of flood. That reading drives everything a barangay needs during a storm: NORMAL / ADVISORY / WARNING / EVACUATE levels, advisories in four languages, sirens and an evacuation flow. Because real flood data for one small creek doesn't exist, the forecaster is trained on 900 synthetic storms run through the simulator's own catchment model, split by storm rather than by minute so the test set is genuinely unseen. It predicts the level 30 and 60 minutes ahead and turns that into \"WARNING in ~25 min\" on the HUD and dashboard. The whole system is demonstrated in a live 3D barangay built with Three.js: a simulator, a story game and a real operations dashboard.",
    caseStudy: [
      {
        heading: "Honest forecasting",
        body: "On 180 held-out storms the exported gradient-boosted model has a mean error of 20.2 cm at +30 minutes and 30.1 cm at +60 minutes, against 38.6 and 52.4 cm for a naive \"no change\" forecast. For storms that actually reached WARNING (280 cm), the median lead time was 18 minutes. It isn't perfect: in 24 of 71 storms that never reached WARNING, the forecast predicted it at some point, a 34% false-alarm rate. The model doesn't know future rainfall, and that is where most of the remaining error comes from.",
      },
      {
        heading: "When the sensor lies",
        body: "A single ultrasonic sensor can freeze, glitch or drift, and a warning system that trusts it blindly fails silently. A camera reads the painted staff gauge as a second sensor. Frozen, erratic or drifting readings raise a SENSOR FAULT, and when the two disagree the system settles toward the higher, safer reading. A built-in \"simulate sensor failure\" control lets you trigger each failure mode and watch it get caught.",
      },
    ],
  },
  {
    slug: "mednotes",
    categories: ["Full-Stack"],
    highlight: "Live website + Android app · 11 releases",
    name: "MedNotes E-Library",
    tagline: "A paid e-library for medical study files, on the web and Android",
    tech: ["React", "TypeScript", "Supabase", "PostgreSQL", "Edge Functions", "Capacitor", "GitHub Actions"],
    bullets: [
      "Buyers pay by GCash, Maya or bank transfer and upload proof; the publisher confirms, which issues a numbered receipt and unlocks the file.",
      "Each purchase works on 1 computer + 1 phone, enforced in Postgres with row-level security and device RPCs instead of trusting the app.",
      "Files never sit in public storage: an edge function streams them in encrypted chunks, with a visible watermark and a hidden per-buyer mark that traces a leaked copy back to the account.",
      "The Android APK is built and published by GitHub Actions on every tag; 11 releases so far, with unit, backend, end-to-end and click-everything UI tests.",
    ],
    href: "https://github.com/unknowndevice077/MedNotes-E-Library",
    siteUrl: "https://unknowndevice077.github.io/MedNotes-E-Library/",
    languages: [
      { name: "TypeScript", percent: 46, color: LANGUAGE_COLORS.TypeScript },
      { name: "JavaScript", percent: 18, color: LANGUAGE_COLORS.JavaScript },
      { name: "HTML", percent: 17, color: LANGUAGE_COLORS.HTML },
      { name: "PLpgSQL", percent: 10, color: "#336790" },
      { name: "CSS", percent: 9, color: LANGUAGE_COLORS.CSS },
    ],
    accent: "#3a6ea5",
    accentRgb: "58, 110, 165",
    visual: "mednotes",
    longDescription:
      "Built to the brief of a seller who sold medical notes, e-books, lectures and slides by hand over chat. The deal fell through on price, but the product is finished and live. MedNotes turns that kind of chat selling into a store: buyers preview a cover for free, pay through the local channels people actually use, and get the file on their devices once the publisher confirms the payment. The hard part is keeping paid files from spreading, so all of the rules live in the database and an edge function rather than in the client: device limits, receipt numbering, encrypted delivery, and tracing marks stamped into every page. The publisher gets an admin side with payment review, an audit log they can revert from, monthly stats, help tickets, and a site editor for wording and colors.",
  },
  {
    slug: "queueup",
    categories: ["Full-Stack"],
    highlight: "Double booking blocked in the database · ~100 backend tests",
    name: "QueueUp",
    tagline: "Multi-tenant booking and walk-in queue SaaS for Philippine small businesses",
    tech: ["Java 21", "Spring Boot 3.5", "React", "PostgreSQL", "PayMongo", "Docker"],
    bullets: [
      "Booking page customers use from their phones, a walk-in queue with live ticket numbers, and a full-screen \"Now Serving\" board for a TV, updated over WebSocket.",
      "Double booking is impossible even under concurrency: a PostgreSQL exclusion constraint enforces it in the database, not just in code.",
      "Shared-schema multi-tenancy with tests for every tenant-scoped endpoint, JWT access tokens with rotating refresh tokens and reuse detection, and signed, idempotent PayMongo webhooks for GCash/Maya deposits.",
      "About 100 backend tests (unit and Testcontainers against real PostgreSQL) behind a CI coverage gate.",
    ],
    href: "https://github.com/unknowndevice077/queueup",
    languages: [
      { name: "Java", percent: 54, color: LANGUAGE_COLORS.Java },
      { name: "TypeScript", percent: 43, color: LANGUAGE_COLORS.TypeScript },
      { name: "Other", percent: 3, color: LANGUAGE_COLORS.Other },
    ],
    accent: "#60a5fa",
    accentRgb: "96, 165, 250",
    visual: "queueup",
    longDescription:
      "Clinics, barbershops, salons and repair shops in the Philippines still run on Facebook messages, paper logbooks and a crowded pila at the door. QueueUp gives each business a mobile booking page, a walk-in queue with live ticket numbers and a \"Now Serving\" TV board, optional GCash/Maya/card deposits through PayMongo to cut no-shows, automatic confirmation and reminder emails, and a dashboard with today's bookings, revenue, no-show rate and busiest hours. One deployment serves many businesses, each isolated from the others. It's built to show production-grade backend engineering: a slot engine that handles lunch breaks, buffers, blackouts, lead time and DST; database-enforced double-booking prevention; tested tenant isolation; refresh-token rotation with theft detection; idempotent webhooks; RFC 7807 errors with trace ids; and rate-limited login.",
  },
  {
    slug: "jaemboy",
    categories: ["Embedded & IoT"],
    highlight: "6 games incl. a Doom-style raycaster on an ESP32",
    name: "jaemboy",
    tagline: "ESP32 handheld game console with a Doom-style raycaster, played from your phone",
    tech: ["ESP32", "C++", "FreeRTOS", "I2C", "WebSockets", "PlatformIO"],
    bullets: [
      "Two-screen handheld: an ESP32, a TCA9548A I2C multiplexer driving two SH1106 OLEDs (one for the game list and HUD, one for the game), powered by a 2S LiPo.",
      "Six games: a Doom-style raycaster, a platformer, falling blocks, breakout, Flap and Snake.",
      "The ESP32 runs its own Wi-Fi access point and serves a controller page, so any phone becomes a multitouch WebSocket gamepad with a draggable, resizable layout.",
      "The game loop runs on one FreeRTOS core and Wi-Fi on the other, with a custom per-page I2C flush and latched input so short taps are never lost between frames.",
    ],
    href: "https://github.com/unknowndevice077/jaemboy",
    languages: [
      { name: "C++", percent: 78, color: LANGUAGE_COLORS["C++"] },
      { name: "HTML", percent: 11, color: LANGUAGE_COLORS.HTML },
      { name: "C", percent: 10, color: LANGUAGE_COLORS.C },
      { name: "Other", percent: 1, color: LANGUAGE_COLORS.Other },
    ],
    accent: "#e879f9",
    accentRgb: "232, 121, 249",
    visual: "jaemboy",
    longDescription:
      "A handheld game console built from an ESP32 devkit, two 128x64 OLED screens and a battery. Both screens sit at the same I2C address, so a TCA9548A multiplexer puts them on separate buses: the first shows the game list and then a HUD (health, ammo, score, level, FPS), the second runs the game. There are no physical buttons. The ESP32 hosts its own Wi-Fi network and serves a controller page gzipped into flash at build time; join it from a phone and the page becomes a multitouch gamepad over WebSockets, with a D-pad, A/B, Start/Select and swipe-to-turn in Doom. The firmware splits work across the ESP32's two cores: the game loop owns the I2C bus on one core while Wi-Fi and the async web server run on the other. A custom flush writes one I2C transaction per display page and only re-selects the multiplexer channel when it changes, and button presses are latched between frames so quick taps aren't dropped.",
  },
  {
    slug: "leadcatch",
    categories: ["Automation"],
    highlight: "One multi-tenant n8n workflow serves every client",
    name: "LeadCatch",
    tagline: "Missed-call text-back automation service for local businesses, built in n8n",
    tech: ["n8n", "Webhooks", "Google Sheets API", "Gmail API", "Telegram", "Twilio"],
    bullets: [
      "When a call to a client's business goes unanswered, LeadCatch texts the caller back within seconds, before they call the next company.",
      "One multi-tenant workflow serves every client: it identifies the business from the number called, so adding a client is a data change, not a new workflow.",
      "Safety checks before every send: STOP opt-outs are honored permanently and no caller is texted twice within 30 minutes. Every send is logged, failures included.",
      "Sales side, also in n8n: a Google Maps prospect finder that scans business websites for contact emails, and a workflow that drafts personalized outreach in Gmail for review.",
    ],
    accent: "#f97316",
    accentRgb: "249, 115, 22",
    visual: "leadcatch",
    longDescription:
      "LeadCatch is an automation service for small businesses that lose customers to missed calls. The client's line forwards unanswered calls to a LeadCatch number, so their own number never changes. One self-hosted n8n workflow handles every client: it works out which business was called, and on a client's first-ever call it creates their own Google Sheet, shares it with them view-only and remembers it. Before anything is sent it checks whether the caller has opted out and whether they were already texted in the last 30 minutes. Then it sends a short \"sorry we missed you\" message from the business, logs the call to a private master sheet and to the client's own sheet, and alerts the owner. The engine was verified end to end with a cold-start test (a new client with zero prior data). It currently sends through Telegram as a stand-in; Twilio, US carrier registration and online hosting are the remaining steps before a paying client can go live. The workflows are private, so there's no public repository.",
  },
  {
    slug: "clash-games",
    categories: ["Full-Stack", "AI & Vision"],
    highlight: "3 live multiplayer games with a Claude vision judge",
    name: "Clash Games",
    tagline: "Three real-time multiplayer party games, one shared engine",
    tech: ["TypeScript", "React", "Node.js", "Socket.IO", "Claude API"],
    bullets: [
      "Copy Cat Clash: teams recreate a reference photo on a shared canvas; an AI vision judge scores which team's drawing is closer, with an automatic local pixel-comparison judge as fallback.",
      "Puzzle Clash: both players solve the identical jigsaw at once — drag-to-place, live opponent progress, phone-and-desktop touch/mouse support.",
      "Bluff Sketch: 4–10 players draw the same secret word except one Faker with a similar-but-different word; server-authoritative roles, timers and scoring, reconnect-safe within 60s.",
      "All three: custom stroke engine (pointer pressure, quadratic smoothing), room codes with QR invites for same-Wi-Fi play, ranked queues with Elo, and Docker-deployed servers.",
    ],
    href: "https://github.com/unknowndevice077/copycatclash",
    // No demoUrl: all three set X-Frame-Options/frame-ancestors that block
    // being embedded on another origin, so an iframe here would just be
    // blocked by the browser. Real screenshots (ClashGamesVisual) plus
    // direct play links do the job an embed can't anyway.
    playLinks: [
      { name: "Copy Cat Clash", url: "https://copy-cat-clash.onrender.com" },
      { name: "Puzzle Clash", url: "https://puzzle-clash-fvov.onrender.com" },
      { name: "Bluff Sketch", url: "https://bluffsketch.onrender.com" },
    ],
    languages: [
      { name: "TypeScript", percent: 96, color: LANGUAGE_COLORS.TypeScript },
      { name: "Other", percent: 4, color: LANGUAGE_COLORS.Other },
    ],
    accent: "#ff5a1f",
    accentRgb: "255, 90, 31",
    visual: "clash",
    longDescription:
      "Three separate real-time multiplayer games, each shipped as its own live app, sharing one architecture: Express + Socket.IO server, server-authoritative game state (roles, timers, scoring never trusted to the client), a typed shared package for socket events between client and server, and Docker deployment. Copy Cat Clash is a team drawing duel judged by Claude's vision model (with a deterministic pixel-comparison fallback when no API key is configured, so the game degrades gracefully rather than breaking) across seven modes and a 263-photo curated, attributed image library. Puzzle Clash is a head-to-head jigsaw race with a from-scratch puzzle-piece generator and touch-and-mouse dragging tuned for both phones and desktop. Bluff Sketch is a social-deduction drawing party game with a custom canvas stroke engine (pointer pressure, per-player layers, quadratic smoothing) and 60-second reconnect grace so a dropped connection doesn't end the round. All three support private rooms with a shareable code and QR invite for same-Wi-Fi play alongside online matchmaking.",
    caseStudy: [
      {
        heading: "Why three games, one entry",
        body: "Each game is a complete, independently deployed product — not a shared codebase split into modes — but they're presented together here because that's the honest shape of the work: the same real-time architecture (Socket.IO, server-authoritative state, a typed shared-events package, Docker) built three times, each time solving a different synchronization problem. Copy Cat Clash's hard problem was scoring something subjective (a drawing) fairly and fast. Puzzle Clash's was keeping two players' identical piece-sets and progress bars in lockstep with low latency. Bluff Sketch's was a shared canvas with per-player strokes that has to survive someone's Wi-Fi dropping mid-round without ending the game.",
      },
      {
        heading: "The AI judge, honestly",
        body: "Copy Cat Clash's headline feature is a Claude vision judge that scores which team's drawing is closer to the reference photo. Running that on every round of every public match isn't free, so the deployed instance falls back to a deterministic pixel-comparison judge when no API key is configured, and rounds scored that way are labeled \"estimated\" in the UI rather than silently presented as AI-graded. Built to degrade honestly, not to fake a feature that isn't actually running.",
      },
    ],
  },
  {
    slug: "questscribe",
    categories: ["AI & Vision", "Automation", "Full-Stack"],
    highlight: "Built at the ISITE AI Hackathon 2026",
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
    slug: "notion-ai-assistant",
    categories: ["Automation", "AI & Vision"],
    highlight: "Built for a client, Windows + macOS",
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
  {
    slug: "studia",
    categories: ["Full-Stack", "AI & Vision"],
    highlight: "6 platforms from one Flutter codebase · defended thesis",
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
    slug: "aurum",
    categories: ["Full-Stack"],
    highlight: "Bot, simulator and backtester share one signal engine",
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
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
