"use client";

import { useRef, useState } from "react";
import Overlay from "./Overlay";

type Dir = "left" | "right" | "up" | "down";
const KEYS: Record<string, Dir> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", a: "left", d: "right", w: "up", s: "down" };

// the 4 index lines for a move, each ordered in the direction tiles slide toward
function lines(dir: Dir) {
  const out: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const row = [0, 1, 2, 3].map((j) => (dir === "left" || dir === "right" ? i * 4 + j : j * 4 + i));
    out.push(dir === "right" || dir === "down" ? row.reverse() : row);
  }
  return out;
}

function move(grid: number[], dir: Dir) {
  const next = [...grid];
  let gained = 0;
  for (const line of lines(dir)) {
    const vals = line.map((i) => grid[i]).filter(Boolean);
    const merged: number[] = [];
    for (let k = 0; k < vals.length; k++) {
      if (vals[k] === vals[k + 1]) {
        merged.push(vals[k] * 2);
        gained += vals[k] * 2;
        k++;
      } else merged.push(vals[k]);
    }
    line.forEach((idx, k) => (next[idx] = merged[k] ?? 0));
  }
  return { grid: next, gained, moved: next.some((v, i) => v !== grid[i]) };
}

function addTile(grid: number[]) {
  const empty = grid.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
  if (!empty.length) return { grid, at: -1 };
  const at = empty[Math.floor(Math.random() * empty.length)];
  const g = [...grid];
  g[at] = Math.random() < 0.9 ? 2 : 4;
  return { grid: g, at };
}

const stuck = (grid: number[]) => (["left", "right", "up", "down"] as Dir[]).every((d) => !move(grid, d).moved);

export default function Game2048({ onEnd }: { onEnd: (score: number) => void }) {
  const [grid, setGrid] = useState<number[]>(Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [fresh, setFresh] = useState(-1);
  const [phase, setPhase] = useState<"ready" | "play" | "over">("ready");
  const touch = useRef<{ x: number; y: number } | null>(null);
  const board = useRef<HTMLDivElement>(null);

  const start = () => {
    const a = addTile(Array(16).fill(0));
    const b = addTile(a.grid);
    setGrid(b.grid);
    setFresh(b.at);
    setScore(0);
    setPhase("play");
    board.current?.focus();
  };

  const go = (dir: Dir) => {
    if (phase !== "play") return;
    const m = move(grid, dir);
    if (!m.moved) return;
    const t = addTile(m.grid);
    const s = score + m.gained;
    setGrid(t.grid);
    setFresh(t.at);
    setScore(s);
    if (stuck(t.grid)) {
      setPhase("over");
      onEnd(s);
    }
  };

  const top = Math.max(...grid);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex gap-6 mono text-sm text-[var(--text-dim)]">
        <span>score {score}</span>
        <span>tile {top || "-"}</span>
        {phase === "play" && score > 0 && (
          <button onClick={() => (setPhase("over"), onEnd(score))} className="underline cursor-pointer">
            end run
          </button>
        )}
      </div>
      <div
        ref={board}
        tabIndex={0}
        onKeyDown={(e) => {
          const d = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
          if (d) {
            e.preventDefault();
            go(d);
          }
        }}
        onPointerDown={(e) => (touch.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => {
          if (!touch.current) return;
          const dx = e.clientX - touch.current.x;
          const dy = e.clientY - touch.current.y;
          touch.current = null;
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
          go(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
        }}
        className="relative grid grid-cols-4 gap-2 p-2 w-full max-w-[360px] aspect-square rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] outline-none focus:border-[var(--accent)] touch-none select-none"
        aria-label="2048 board. Use arrow keys, WASD or swipe."
      >
        {grid.map((v, i) => {
          const lvl = v ? Math.log2(v) : 0;
          return (
            <div
              key={i + "-" + (i === fresh ? "n" + score : "")}
              className={"rounded-md flex items-center justify-center font-semibold " + (i === fresh ? "tile-pop" : "")}
              style={{
                background: v ? `rgba(var(--accent-rgb), ${Math.min(1, 0.12 + lvl * 0.08)})` : "var(--glass)",
                color: lvl >= 7 ? "#071019" : "var(--text)",
                fontSize: v >= 1024 ? "1.1rem" : v >= 128 ? "1.4rem" : "1.7rem",
              }}
            >
              {v || ""}
            </div>
          );
        })}
        {phase !== "play" && (
          <Overlay title={phase === "over" ? "No moves · " + score : "2048"} sub={phase === "over" ? "Click to play again" : "Click to start · arrows / WASD / swipe"} onClick={start} />
        )}
      </div>
    </div>
  );
}
