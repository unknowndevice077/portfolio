// Content for the About page and the home page summary.

export type Service = {
  title: string;
  description: string;
  proof: string;
  accent: string;
};

export const services: Service[] = [
  {
    title: "Applied AI & Computer Vision",
    description:
      "Real-time detection pipelines, video/image classification, and LLM-powered features — from model selection through to a system that runs in production, not just a notebook.",
    proof: "Proof: EcoVision's YOLO11 + X3D-XS detection pipeline, Bantay Baha's flood forecaster, Copy Cat Clash's Claude vision judge.",
    accent: "#8fd400",
  },
  {
    title: "Full-Stack Web & Mobile Apps",
    description:
      "End-to-end product builds — React/Next.js on the front, Spring Boot, FastAPI or Node underneath, shipped on web, mobile and desktop.",
    proof: "Proof: QueueUp (multi-tenant Spring Boot SaaS), three live multiplayer games, Studia (6-platform Flutter app).",
    accent: "#5eead4",
  },
  {
    title: "Desktop & Embedded Systems",
    description:
      "Cross-platform desktop apps (Electron, Tauri/Rust) and the hardware side when a project needs it — microcontrollers, sensors, and the firmware/backend link between them.",
    proof: "Proof: Bantay Baha's ESP32 flood sensor, the jaemboy ESP32 handheld, EcoVision's Electron app + ESP32 siren.",
    accent: "#a78bfa",
  },
  {
    title: "Workflow & AI Automation",
    description:
      "Turning a manual process into an automated one — n8n workflows, AI agents wired into real tools (Notion, Slack, etc.), prompt-engineered from a working sketch to something reliable.",
    proof: "Proof: LeadCatch's multi-tenant n8n text-back service, QuestScribe's n8n hackathon build, Notion AI Assistant for a client.",
    accent: "#fbbf24",
  },
];

export const skillGroups: [string, string[]][] = [
  ["Languages", ["TypeScript/JavaScript", "Python", "Java", "C/C++", "SQL"]],
  ["Frontend & mobile", ["React", "Next.js", "Tailwind CSS", "Three.js", "Electron", "Capacitor", "Flutter"]],
  ["Backend & data", ["Node.js/Express", "Spring Boot", "Django REST", "FastAPI", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Supabase"]],
  ["DevOps & testing", ["Docker", "GitHub Actions", "Playwright", "JUnit/Testcontainers", "pytest", "Sentry", "AWS S3", "Stripe"]],
  ["AI & automation", ["PyTorch", "YOLO", "OpenCV", "scikit-learn", "LLM APIs (Claude, Ollama)", "n8n"]],
  ["Embedded", ["ESP32", "FreeRTOS", "PlatformIO", "I2C", "sensors"]],
];

export type Competition = {
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

export type Role = { title: string; org: string; dates: string; description: string; accent: string };

export const experience: Role[] = [
  {
    title: "Full-Stack Development Intern (Remote)",
    org: "Nexvia Technologies · Hyderabad, India",
    dates: "Oct 2026 – Present",
    description: "Building two production-style SaaS apps: a multi-tenant project tracker (Django REST, React/TypeScript, PostgreSQL, Celery, Stripe) and a multi-vendor marketplace (Express, MongoDB, Elasticsearch, Redis, Stripe Connect), both with automated tests running in CI.",
    accent: "#38bdf8",
  },
  {
    title: "IT & Marketing Assistant (OJT)",
    org: "Carlosta Hotel",
    dates: "Jun 2021 – Jul 2021",
    description: "Maintained hotel IT systems and network devices; designed promotional materials for marketing campaigns.",
    accent: "#818cf8",
  },
];

export const competitions: Competition[] = [
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
