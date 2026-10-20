"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { projects } from "../../data/projects";
import { ACCENTS, setTheme } from "../../lib/theme";

type Line = { kind: "in" | "out" | "err"; text: string };

const HELP = [
  "help              this list",
  "whoami            who built this",
  "ls                list projects",
  "open <project>    open a project page (tab completes)",
  "skills            what I work with",
  "theme dark|light  switch the whole site",
  "accent <color>    " + ACCENTS.map((a) => a.name.toLowerCase()).join(" | "),
  "play <game>       raycaster | snake | threat",
  "contact           how to reach me",
  "resume            view my resume",
  "clear             clear the screen",
];

export default function Terminal({ onPlay }: { onPlay: (game: string) => void }) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "fritz@portfolio — type 'help' to see what this can do" },
  ]);
  const [input, setInput] = useState("");
  const history = useRef<string[]>([]);
  const hIdx = useRef(-1);
  const bottom = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll inside the terminal only, not the whole page
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [lines]);

  const out = (...t: string[]) => t.map((text) => ({ kind: "out" as const, text }));

  const run = (raw: string) => {
    const cmd = raw.trim();
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(" ").toLowerCase();
    let res: Line[] = [];

    switch (name?.toLowerCase()) {
      case "":
        break;
      case "help":
        res = out(...HELP);
        break;
      case "whoami":
        res = out("Fritz Rjhay Dela Cruz — final-year Computer Engineering student, Full-Stack Intern at Nexvia.", "I build AI, IoT and full-stack systems end to end. Based in Leyte, Philippines (UTC+8).");
        break;
      case "ls":
      case "projects":
        res = out(...projects.map((p) => p.slug.padEnd(22) + p.highlight));
        break;
      case "open": {
        const p = projects.find((x) => x.slug === arg || x.name.toLowerCase() === arg) ?? projects.find((x) => x.slug.startsWith(arg) && arg);
        if (p) {
          res = out("opening " + p.name + " ...");
          setTimeout(() => router.push("/projects/" + p.slug), 350);
        } else res = [{ kind: "err", text: "no such project: " + (arg || "(nothing)") + " — try 'ls'" }];
        break;
      }
      case "skills":
        res = out("ai        YOLO11, X3D, PyTorch, scikit-learn, LLM APIs", "web       React, Next.js, TypeScript, Socket.IO, Three.js", "backend   Spring Boot, FastAPI, Node.js, PostgreSQL, Docker", "embedded  ESP32, FreeRTOS, I2C, C/C++", "automate  n8n, webhooks, Google & Telegram APIs");
        break;
      case "theme":
        if (arg === "dark" || arg === "light") {
          setTheme({ mode: arg });
          res = out("theme set to " + arg);
        } else res = [{ kind: "err", text: "usage: theme dark|light" }];
        break;
      case "accent": {
        const a = ACCENTS.find((x) => x.name.toLowerCase() === arg);
        if (a) {
          setTheme({ accent: a.hex });
          res = out("accent set to " + a.name.toLowerCase());
        } else res = [{ kind: "err", text: "usage: accent " + ACCENTS.map((x) => x.name.toLowerCase()).join("|") }];
        break;
      }
      case "play":
        if (["raycaster", "snake", "threat"].includes(arg)) {
          res = out("loading " + arg + " ...");
          setTimeout(() => onPlay(arg), 250);
        } else res = [{ kind: "err", text: "usage: play raycaster|snake|threat" }];
        break;
      case "contact":
        res = out("email     frjhay.delacruz@gmail.com", "github    github.com/unknowndevice077", "linkedin  linkedin.com/in/fritz-rjhay-dela-cruz-9b604737b");
        break;
      case "resume":
        res = out("opening resume ...");
        setTimeout(() => router.push("/resume"), 300);
        break;
      case "sudo":
        res = arg.startsWith("hire") ? out("permission granted ✓  →  frjhay.delacruz@gmail.com") : [{ kind: "err", text: "nice try" }];
        break;
      case "rm":
        res = [{ kind: "err", text: "let's not." }];
        break;
      case "clear":
        setLines([]);
        return;
      default:
        res = [{ kind: "err", text: "command not found: " + name + " — type 'help'" }];
    }
    setLines((l) => [...l, { kind: "in", text: cmd }, ...res]);
  };

  const complete = () => {
    const [name, ...rest] = input.split(" ");
    if (name === "open" && rest.length) {
      const m = projects.filter((p) => p.slug.startsWith(rest.join(" ").toLowerCase()));
      if (m.length === 1) setInput("open " + m[0].slug);
    } else if (rest.length === 0) {
      const cmds = ["help", "whoami", "ls", "open", "skills", "theme", "accent", "play", "contact", "resume", "clear"];
      const m = cmds.filter((c) => c.startsWith(name));
      if (m.length === 1) setInput(m[0] + " ");
    }
  };

  return (
    <div
      className="rounded-lg overflow-hidden border border-[#1b212c] bg-[#06090d] text-[#d4d8e0]"
      onClick={() => bottom.current?.querySelector("input")?.focus()}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-[#0d1117] border-b border-[#1b212c]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <span className="mono text-[11px] ml-2 text-[#6b7686]">fritz@portfolio: ~</span>
      </div>
      <div ref={box} className="mono text-[13px] leading-relaxed p-4 h-[360px] overflow-y-auto" style={{ fontVariantLigatures: "none" }}>
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap break-words" style={{ color: l.kind === "err" ? "#f87171" : l.kind === "in" ? "#e5e7eb" : "#9aa5b4" }}>
            {l.kind === "in" ? <><span style={{ color: "var(--accent)" }}>❯ </span>{l.text}</> : l.text}
          </div>
        ))}
        <div ref={bottom} className="flex items-center">
          <span style={{ color: "var(--accent)" }}>❯&nbsp;</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (input.trim()) history.current.unshift(input);
                hIdx.current = -1;
                run(input);
                setInput("");
              } else if (e.key === "Tab") {
                e.preventDefault();
                complete();
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                hIdx.current = Math.min(hIdx.current + 1, history.current.length - 1);
                if (history.current[hIdx.current]) setInput(history.current[hIdx.current]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                hIdx.current = Math.max(hIdx.current - 1, -1);
                setInput(hIdx.current < 0 ? "" : history.current[hIdx.current]);
              }
            }}
            className="flex-1 bg-transparent outline-none text-[#e5e7eb] caret-[var(--accent)]"
            aria-label="Terminal input"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 px-4 pb-4">
        {["help", "ls", "theme light", "accent pink", "play snake"].map((c) => (
          <button key={c} onClick={() => run(c)} className="mono text-[11px] px-2.5 py-1 rounded border border-[#1f2733] text-[#9aa5b4] hover:text-white hover:border-[#334155] cursor-pointer">
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
