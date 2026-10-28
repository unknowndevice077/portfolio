"use client";

import { useEffect, useState } from "react";
import Overlay from "./Overlay";

const N = 9;
const MINES = 10;
type Cell = { mine: boolean; open: boolean; flag: boolean; n: number };

const blank = (): Cell[] => Array.from({ length: N * N }, () => ({ mine: false, open: false, flag: false, n: 0 }));
const around = (i: number) => {
  const x = i % N;
  const y = Math.floor(i / N);
  const out: number[] = [];
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if ((dx || dy) && nx >= 0 && ny >= 0 && nx < N && ny < N) out.push(ny * N + nx);
    }
  return out;
};

// mines go in after the first click, never on or next to it
function plant(cells: Cell[], first: number) {
  const safe = new Set([first, ...around(first)]);
  let left = MINES;
  while (left) {
    const i = Math.floor(Math.random() * N * N);
    if (safe.has(i) || cells[i].mine) continue;
    cells[i].mine = true;
    left--;
  }
  cells.forEach((c, i) => (c.n = around(i).filter((j) => cells[j].mine).length));
}

function flood(cells: Cell[], i: number) {
  const stack = [i];
  while (stack.length) {
    const k = stack.pop()!;
    const c = cells[k];
    if (c.open || c.flag) continue;
    c.open = true;
    if (c.n === 0 && !c.mine) stack.push(...around(k));
  }
}

const NUM_COLORS = ["", "#38bdf8", "#22c55e", "#f43f5e", "#a78bfa", "#f59e0b", "#14b8a6", "#e879f9", "#94a3b8"];

export default function Minesweeper({ onEnd }: { onEnd: (score: number) => void }) {
  const [cells, setCells] = useState<Cell[]>(blank);
  const [phase, setPhase] = useState<"ready" | "play" | "won" | "lost">("ready");
  const [started, setStarted] = useState(false);
  const [secs, setSecs] = useState(0);
  const [flagMode, setFlagMode] = useState(false);

  useEffect(() => {
    if (phase !== "play" || !started) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase, started]);

  const start = () => {
    setCells(blank());
    setStarted(false);
    setSecs(0);
    setPhase("play");
  };

  const open = (i: number) => {
    if (phase !== "play") return;
    const next = cells.map((c) => ({ ...c }));
    if (!started) {
      plant(next, i);
      setStarted(true);
    }
    const c = next[i];
    if (c.flag) return;
    if (c.mine) {
      next.forEach((x) => x.mine && (x.open = true));
      setCells(next);
      setPhase("lost");
      return;
    }
    // clicking an open number with all its flags placed opens the rest (chording)
    if (c.open && c.n) {
      const ns = around(i);
      if (ns.filter((j) => next[j].flag).length !== c.n) return;
      for (const j of ns) {
        if (next[j].flag || next[j].open) continue;
        if (next[j].mine) {
          next.forEach((x) => x.mine && (x.open = true));
          setCells(next);
          setPhase("lost");
          return;
        }
        flood(next, j);
      }
    } else flood(next, i);
    setCells(next);
    if (next.filter((x) => x.open).length === N * N - MINES) {
      setPhase("won");
      onEnd(Math.max(1, secs));
    }
  };

  const flag = (i: number) => {
    if (phase !== "play" || cells[i].open) return;
    setCells(cells.map((c, k) => (k === i ? { ...c, flag: !c.flag } : c)));
  };

  const flags = cells.filter((c) => c.flag).length;

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex gap-6 items-center mono text-sm text-[var(--text-dim)]">
        <span>💣 {MINES - flags}</span>
        <span>⏱ {secs}s</span>
        <button
          onClick={() => setFlagMode(!flagMode)}
          className={"px-2.5 py-1 rounded-md border cursor-pointer " + (flagMode ? "border-[var(--accent)] text-[var(--text)]" : "border-[var(--glass-border)]")}
        >
          🚩 flag mode {flagMode ? "on" : "off"}
        </button>
      </div>
      <div
        className="relative grid gap-1 p-2 w-full max-w-[360px] aspect-square rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] select-none"
        style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}
      >
        {cells.map((c, i) => (
          <button
            key={i}
            onClick={() => (flagMode ? flag(i) : open(i))}
            onContextMenu={(e) => {
              e.preventDefault();
              flag(i);
            }}
            className="rounded-[4px] flex items-center justify-center text-sm font-bold cursor-pointer"
            style={{
              background: c.open ? (c.mine ? "#f43f5e" : "var(--glass)") : "rgba(var(--accent-rgb), 0.28)",
              color: NUM_COLORS[c.n],
            }}
            aria-label={c.open ? (c.mine ? "mine" : String(c.n || "empty")) : c.flag ? "flagged" : "hidden"}
          >
            {c.open ? (c.mine ? "💣" : c.n || "") : c.flag ? "🚩" : ""}
          </button>
        ))}
        {phase !== "play" && (
          <Overlay
            title={phase === "won" ? "Cleared in " + secs + "s" : phase === "lost" ? "Boom 💥" : "Minesweeper"}
            sub={phase === "ready" ? "Click to start · first click is always safe" : "Click to play again"}
            onClick={start}
          />
        )}
      </div>
    </div>
  );
}
