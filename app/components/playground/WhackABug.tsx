"use client";

import { useEffect, useRef, useState } from "react";
import Overlay from "./Overlay";

const ROUND = 30;
type Hole = { kind: "bug" | "feature"; until: number } | null;

export default function WhackABug({ onEnd }: { onEnd: (score: number) => void }) {
  const [holes, setHoles] = useState<Hole[]>(Array(9).fill(null));
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(ROUND);
  const [phase, setPhase] = useState<"ready" | "play" | "over">("ready");
  const [hit, setHit] = useState<{ i: number; ok: boolean } | null>(null);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (phase !== "play") return;
    const t0 = Date.now();
    let nextSpawn = 0;
    const id = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - t0) / 1000;
      setLeft(Math.max(0, Math.ceil(ROUND - elapsed)));
      if (elapsed >= ROUND) {
        setPhase("over");
        setHoles(Array(9).fill(null));
        onEnd(scoreRef.current);
        return;
      }
      setHoles((hs) => {
        const next = hs.map((h) => (h && h.until < now ? null : h));
        // spawns get faster and bugs stay up for less time as the round goes on
        if (now >= nextSpawn) {
          const free = next.map((h, i) => (h ? -1 : i)).filter((i) => i >= 0);
          if (free.length) {
            const i = free[Math.floor(Math.random() * free.length)];
            next[i] = { kind: Math.random() < 0.18 ? "feature" : "bug", until: now + 1100 - elapsed * 18 };
          }
          nextSpawn = now + 650 - elapsed * 12;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(id);
  }, [phase, onEnd]);

  const start = () => {
    scoreRef.current = 0;
    setScore(0);
    setLeft(ROUND);
    setHoles(Array(9).fill(null));
    setPhase("play");
  };

  const whack = (i: number) => {
    const h = holes[i];
    if (phase !== "play" || !h) return;
    scoreRef.current = Math.max(0, scoreRef.current + (h.kind === "bug" ? 1 : -3));
    setScore(scoreRef.current);
    setHit({ i, ok: h.kind === "bug" });
    setHoles((hs) => hs.map((x, k) => (k === i ? null : x)));
    setTimeout(() => setHit(null), 250);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex gap-6 mono text-sm text-[var(--text-dim)]">
        <span>squashed {score}</span>
        <span>⏱ {left}s</span>
      </div>
      <div className="relative grid grid-cols-3 gap-3 p-3 w-full max-w-[min(640px,calc(100vh_-_420px))] aspect-square rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] select-none">
        {holes.map((h, i) => (
          <button
            key={i}
            onPointerDown={() => whack(i)}
            className="relative rounded-full flex items-center justify-center text-4xl cursor-pointer overflow-hidden"
            style={{
              background: hit?.i === i ? (hit.ok ? "rgba(34,197,94,0.3)" : "rgba(244,63,94,0.35)") : "var(--glass)",
              border: "1px solid var(--glass-border)",
            }}
            aria-label={h ? h.kind : "empty hole"}
          >
            <span className="transition-transform duration-150" style={{ transform: h ? "translateY(0) scale(1)" : "translateY(60%) scale(0.4)", opacity: h ? 1 : 0 }}>
              {h?.kind === "feature" ? "✨" : "🐛"}
            </span>
            {hit?.i === i && <span className="absolute text-sm font-bold">{hit.ok ? "+1" : "-3"}</span>}
          </button>
        ))}
        {phase !== "play" && (
          <Overlay title={phase === "over" ? "Shift over · " + score + " bugs" : "Whack-a-Bug"} sub={phase === "over" ? "Click to play again" : "Click to start · 🐛 +1 · ✨ is a feature, -3"} onClick={start} />
        )}
      </div>
    </div>
  );
}
