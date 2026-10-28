"use client";

import { useEffect, useRef, useState } from "react";

// A tiny EcoVision-flavoured game: people wander a CCTV feed, a few are armed.
// Tag the armed ones before the clock runs out; tagging an innocent costs points.
type Person = { id: number; x: number; y: number; vx: number; vy: number; armed: boolean; tagged: boolean };

const ROUND_S = 30;
let nextId = 1;

function spawn(armed: boolean): Person {
  return {
    id: nextId++,
    x: 5 + Math.random() * 90,
    y: 10 + Math.random() * 80,
    vx: (Math.random() - 0.5) * 14,
    vy: (Math.random() - 0.5) * 10,
    armed,
    tagged: false,
  };
}

export default function SpotTheThreat({ onEnd }: { onEnd: (score: number) => void }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(ROUND_S);
  const [state, setState] = useState<"idle" | "playing" | "done">("idle");
  const [flash, setFlash] = useState<{ x: number; y: number; ok: boolean } | null>(null);
  const lastT = useRef(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    if (state === "done") onEnd(scoreRef.current);
  }, [state, onEnd]);

  const start = () => {
    setPeople([...Array.from({ length: 9 }, () => spawn(false)), spawn(true), spawn(true)]);
    setScore(0);
    setTime(ROUND_S);
    setState("playing");
  };

  useEffect(() => {
    if (state !== "playing") return;
    let raf = 0;
    lastT.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastT.current) / 1000;
      lastT.current = now;
      setPeople((ps) =>
        ps.map((p) => {
          let { x, y, vx, vy } = p;
          x += vx * dt;
          y += vy * dt;
          if (x < 3 || x > 97) vx = -vx;
          if (y < 8 || y > 92) vy = -vy;
          if (Math.random() < 0.01) vx = (Math.random() - 0.5) * 14; // random direction changes so it's not too easy
          return { ...p, x: Math.min(97, Math.max(3, x)), y: Math.min(92, Math.max(8, y)), vx, vy };
        })
      );
      setTime((t) => {
        const n = t - dt;
        if (n <= 0) setState("done");
        return Math.max(0, n);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  const tag = (p: Person) => {
    if (state !== "playing" || p.tagged) return;
    setFlash({ x: p.x, y: p.y, ok: p.armed });
    setTimeout(() => setFlash(null), 450);
    if (p.armed) {
      setScore((s) => s + 100);
      // swap the caught one for a new armed person somewhere else, plus one more bystander
      setPeople((ps) => [...ps.filter((q) => q.id !== p.id), spawn(true), spawn(false)]);
    } else {
      setScore((s) => s - 50);
      setPeople((ps) => ps.map((q) => (q.id === p.id ? { ...q, tagged: true } : q)));
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 mono text-sm text-[var(--text-dim)]">
        <span>score {score}</span>
        <span>time {Math.ceil(time)}s</span>
      </div>
      <div className="relative w-full max-w-[640px] aspect-video rounded-lg overflow-hidden border border-[var(--border)] bg-[#05080c] select-none">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(132,204,22,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(132,204,22,0.15) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-2 left-3 mono text-[10px] text-[#84cc16] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> CAM 2 · LIVE
        </div>
        {people.map((p) => (
          <button
            key={p.id}
            onClick={() => tag(p)}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-crosshair"
            style={{ left: p.x + "%", top: p.y + "%" }}
            aria-label={p.armed ? "armed person" : "person"}
          >
            <svg viewBox="0 0 26 34" className="w-6 h-9 sm:w-7 sm:h-10">
              <circle cx="10" cy="6" r="4.5" fill={p.tagged ? "#475569" : "#cbd5e1"} />
              <rect x="5" y="12" width="10" height="13" rx="3" fill={p.tagged ? "#334155" : "#94a3b8"} />
              <rect x="6" y="25" width="3" height="9" fill={p.tagged ? "#334155" : "#64748b"} />
              <rect x="11" y="25" width="3" height="9" fill={p.tagged ? "#334155" : "#64748b"} />
              {/* the giveaway: a small dark shape in one hand */}
              {p.armed && (
                <g fill="#0b0f16">
                  <rect x="14" y="16" width="10" height="3" rx="0.5" />
                  <rect x="15" y="18" width="2.5" height="4" />
                </g>
              )}
            </svg>
          </button>
        ))}
        {flash && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-16 border-2 pointer-events-none"
            style={{ left: flash.x + "%", top: flash.y + "%", borderColor: flash.ok ? "#ef4444" : "#64748b" }}
          >
            <span className="absolute -top-5 left-0 mono text-[10px] whitespace-nowrap" style={{ color: flash.ok ? "#ef4444" : "#94a3b8" }}>
              {flash.ok ? "ARMED +100" : "bystander -50"}
            </span>
          </div>
        )}
        {state !== "playing" && (
          <button onClick={start} className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 text-white cursor-pointer">
            <span className="font-display text-2xl">{state === "done" ? "Shift over · " + score + " pts" : "Spot the Threat"}</span>
            <span className="text-sm px-6 text-center">
              {state === "done" ? "Click to go again" : "You're the operator. Click people holding something. Don't tag bystanders."}
            </span>
          </button>
        )}
      </div>
      <p className="text-xs text-[var(--text-faint)] text-center max-w-md">
        EcoVision does this for real with YOLO11 pose tracking and a weapon detector, and still asks a human to confirm.
      </p>
    </div>
  );
}
