"use client";

import { useEffect, useRef, useState } from "react";
import { startLoop, themeColors } from "./canvas";
import Overlay from "./Overlay";

const W = 480;
const H = 360;
const X = 110;
const SIZE = 22;
const GAP = 112;
const PIPE_W = 52;
const SPEED = 2.6;

type Pipe = { x: number; gap: number; passed: boolean };

function fresh() {
  return { y: H / 2, vy: 0, pipes: [] as Pipe[], t: 0, score: 0, done: false };
}

export default function Flappy({ onEnd }: { onEnd: (score: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const g = useRef(fresh());
  const [phase, setPhase] = useState<"ready" | "play" | "over">("ready");
  const [score, setScore] = useState(0);

  const flap = () => {
    if (!g.current.done) g.current.vy = -6;
  };

  useEffect(() => {
    if (phase !== "play") return;
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let col = themeColors();
    let frame = 0;

    const step = () => {
      const s = g.current;
      if (s.done) return;
      s.t++;
      s.vy = Math.min(9, s.vy + 0.36);
      s.y += s.vy;
      if (s.t % 92 === 1) s.pipes.push({ x: W, gap: 70 + Math.random() * (H - 140 - GAP), passed: false });
      for (const p of s.pipes) {
        p.x -= SPEED + Math.min(1.5, s.score * 0.04);
        if (!p.passed && p.x + PIPE_W < X) {
          p.passed = true;
          s.score++;
          setScore(s.score);
        }
      }
      s.pipes = s.pipes.filter((p) => p.x > -PIPE_W);

      const hitPipe = s.pipes.some(
        (p) => X + SIZE / 2 > p.x && X - SIZE / 2 < p.x + PIPE_W && (s.y - SIZE / 2 < p.gap || s.y + SIZE / 2 > p.gap + GAP)
      );
      if (hitPipe || s.y > H - SIZE / 2 || s.y < SIZE / 2) {
        s.done = true;
        onEnd(s.score);
        setPhase("over");
      }
    };

    const draw = () => {
      if (++frame % 30 === 0) col = themeColors();
      const s = g.current;
      ctx.fillStyle = col.bg;
      ctx.fillRect(0, 0, W, H);

      // faint circuit-board grid scrolling behind
      ctx.strokeStyle = col.border;
      ctx.lineWidth = 1;
      const off = (s.t * SPEED) % 40;
      for (let x = -off; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }

      for (const p of s.pipes) {
        ctx.fillStyle = `rgba(${col.accentRgb}, 0.35)`;
        ctx.fillRect(p.x, 0, PIPE_W, p.gap);
        ctx.fillRect(p.x, p.gap + GAP, PIPE_W, H - p.gap - GAP);
        ctx.fillStyle = col.accent;
        ctx.fillRect(p.x - 3, p.gap - 10, PIPE_W + 6, 10);
        ctx.fillRect(p.x - 3, p.gap + GAP, PIPE_W + 6, 10);
      }

      // the "chip": body + pins, tilted with velocity
      ctx.save();
      ctx.translate(X, s.y);
      ctx.rotate(Math.max(-0.5, Math.min(0.8, s.vy * 0.07)));
      ctx.fillStyle = col.dim;
      for (let i = -1; i <= 1; i++) {
        ctx.fillRect(-SIZE / 2 - 4, i * 6 - 1, 4, 2);
        ctx.fillRect(SIZE / 2, i * 6 - 1, 4, 2);
      }
      ctx.fillStyle = col.text;
      ctx.fillRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE);
      ctx.fillStyle = col.accent;
      ctx.beginPath();
      ctx.arc(-SIZE / 4, -SIZE / 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = col.text;
      ctx.font = "bold 28px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(String(s.score), W / 2, 44);
    };

    const key = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        e.preventDefault();
        flap();
      }
    };
    c.addEventListener("keydown", key);
    c.focus();
    const stop = startLoop(step, draw);
    return () => {
      stop();
      c.removeEventListener("keydown", key);
    };
  }, [phase, onEnd]);

  const start = () => {
    g.current = fresh();
    g.current.vy = -6;
    setScore(0);
    setPhase("play");
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="mono text-sm text-[var(--text-dim)]">pipes {score}</div>
      <div className="relative w-full max-w-[560px]">
        <canvas
          ref={ref}
          width={W}
          height={H}
          tabIndex={0}
          onPointerDown={flap}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] outline-none focus:border-[var(--accent)] touch-none"
          aria-label="Flappy Chip game"
        />
        {phase !== "play" && (
          <Overlay title={phase === "over" ? "Crashed · " + score + " pipes" : "Flappy Chip"} sub={phase === "over" ? "Click to fly again" : "Click to start · then click / space to flap"} onClick={start} />
        )}
      </div>
    </div>
  );
}
