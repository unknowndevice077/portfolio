"use client";

import { useEffect, useRef, useState } from "react";
import { canvasPoint, startLoop, themeColors } from "./canvas";
import Overlay from "./Overlay";

const W = 480;
const H = 360;
const COLS = 8;
const ROWS = 5;
const BW = W / COLS;
const BH = 18;
const TOP = 40;
const PW = 80;
const PY = H - 24;
const R = 6;

function fresh() {
  return { px: W / 2, bx: W / 2, by: PY - R, vx: 0, vy: 0, bricks: Array(COLS * ROWS).fill(true) as boolean[], lives: 3, score: 0, stuck: true, done: false };
}

export default function Breakout({ onEnd }: { onEnd: (score: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const g = useRef(fresh());
  const keys = useRef({ l: false, r: false });
  const [phase, setPhase] = useState<"ready" | "play" | "over" | "won">("ready");
  const [hud, setHud] = useState({ score: 0, lives: 3 });

  const launch = () => {
    const s = g.current;
    if (!s.stuck) return;
    s.stuck = false;
    s.vx = (Math.random() - 0.5) * 4;
    s.vy = -4.2;
  };

  useEffect(() => {
    if (phase !== "play") return;
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let col = themeColors();
    let frame = 0;

    const end = (won: boolean) => {
      const s = g.current;
      s.done = true;
      onEnd(s.score);
      setPhase(won ? "won" : "over");
    };

    const step = () => {
      const s = g.current;
      if (s.done) return;
      if (keys.current.l) s.px -= 7;
      if (keys.current.r) s.px += 7;
      s.px = Math.max(PW / 2, Math.min(W - PW / 2, s.px));
      if (s.stuck) {
        s.bx = s.px;
        s.by = PY - R;
        return;
      }
      s.bx += s.vx;
      s.by += s.vy;
      if (s.bx < R || s.bx > W - R) s.vx = -s.vx;
      if (s.by < R) s.vy = Math.abs(s.vy);
      s.bx = Math.max(R, Math.min(W - R, s.bx));

      // paddle: where it hits decides the bounce angle
      if (s.vy > 0 && s.by + R >= PY && s.by + R <= PY + 10 && Math.abs(s.bx - s.px) <= PW / 2 + R) {
        const speed = Math.hypot(s.vx, s.vy);
        const off = (s.bx - s.px) / (PW / 2);
        s.vx = off * speed * 0.8;
        s.vy = -Math.sqrt(Math.max(1, speed * speed - s.vx * s.vx));
      }

      const cx = Math.floor(s.bx / BW);
      const cy = Math.floor((s.by - TOP) / BH);
      if (cy >= 0 && cy < ROWS && s.bricks[cy * COLS + cx]) {
        s.bricks[cy * COLS + cx] = false;
        s.vy = -s.vy;
        s.vx *= 1.02;
        s.vy *= 1.02;
        s.score += (ROWS - cy) * 10;
        setHud({ score: s.score, lives: s.lives });
        if (s.bricks.every((b) => !b)) end(true);
      }

      if (s.by > H + R) {
        s.lives -= 1;
        setHud({ score: s.score, lives: s.lives });
        if (s.lives <= 0) end(false);
        else Object.assign(s, { stuck: true, vx: 0, vy: 0 });
      }
    };

    const draw = () => {
      if (++frame % 30 === 0) col = themeColors(); // pick up theme changes mid-game
      const s = g.current;
      ctx.fillStyle = col.bg;
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < s.bricks.length; i++) {
        if (!s.bricks[i]) continue;
        const r = Math.floor(i / COLS);
        ctx.fillStyle = `rgba(${col.accentRgb}, ${1 - r * 0.15})`;
        ctx.beginPath();
        ctx.roundRect((i % COLS) * BW + 3, TOP + r * BH + 3, BW - 6, BH - 6, 3);
        ctx.fill();
      }
      ctx.fillStyle = col.accent;
      ctx.beginPath();
      ctx.roundRect(s.px - PW / 2, PY, PW, 10, 5);
      ctx.fill();
      ctx.fillStyle = col.text;
      ctx.beginPath();
      ctx.arc(s.bx, s.by, R, 0, Math.PI * 2);
      ctx.fill();
      if (s.stuck) {
        ctx.fillStyle = col.dim;
        ctx.font = "14px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.fillText("click or space to launch", W / 2, H / 2 + 40);
      }
    };

    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.l = true;
      else if (e.key === "ArrowRight" || e.key === "d") keys.current.r = true;
      else if (e.key === " ") launch();
      else return;
      e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.l = false;
      if (e.key === "ArrowRight" || e.key === "d") keys.current.r = false;
    };
    c.addEventListener("keydown", down);
    c.addEventListener("keyup", up);
    c.focus();
    const stop = startLoop(step, draw);
    return () => {
      stop();
      c.removeEventListener("keydown", down);
      c.removeEventListener("keyup", up);
    };
  }, [phase, onEnd]);

  const start = () => {
    g.current = fresh();
    setHud({ score: 0, lives: 3 });
    setPhase("play");
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex gap-6 mono text-sm text-[var(--text-dim)]">
        <span>score {hud.score}</span>
        <span>lives {"●".repeat(Math.max(0, hud.lives))}</span>
      </div>
      <div className="relative w-full max-w-[min(900px,calc((100vh_-_420px)*4/3))]">
        <canvas
          ref={ref}
          width={W}
          height={H}
          tabIndex={0}
          onPointerMove={(e) => (g.current.px = canvasPoint(e.currentTarget, e.clientX, e.clientY).x)}
          onPointerDown={(e) => {
            g.current.px = canvasPoint(e.currentTarget, e.clientX, e.clientY).x;
            launch();
          }}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] outline-none focus:border-[var(--accent)] touch-none"
          aria-label="Breakout game"
        />
        {phase !== "play" && (
          <Overlay
            title={phase === "won" ? "Board cleared · " + hud.score : phase === "over" ? "Game over · " + hud.score : "Breakout"}
            sub={phase === "ready" ? "Click to start" : "Click to play again"}
            onClick={start}
          />
        )}
      </div>
    </div>
  );
}
