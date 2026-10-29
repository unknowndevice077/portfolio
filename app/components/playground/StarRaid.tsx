"use client";

import { useEffect, useRef, useState } from "react";
import { canvasPoint, startLoop, themeColors } from "./canvas";

// Vertical space shooter. The ship follows the mouse/finger and fires on its own;
// enemies come in waves that weave, dive and shoot back.
const W = 300;
const H = 820;
let ink = { text: "#17161a", faint: "#8f8b83", accent: "#2f54d8" }; // refreshed from the theme while drawing

type Enemy = { x: number; y: number; vx: number; vy: number; hp: number; kind: 0 | 1 | 2; t: number; cd: number };
type Shot = { x: number; y: number; vy: number; vx: number; foe: boolean };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; c: string };

const STARS = Array.from({ length: 90 }, (_, i) => ({ x: (i * 97) % W, y: (i * 53) % H, s: 0.4 + ((i * 7) % 10) / 6 }));
const ENEMY_COLORS = ["#ff5d73", "#ffb547", "#b48cff"];

function fresh() {
  return { x: W / 2, y: H - 60, tx: W / 2, ty: H - 60, enemies: [] as Enemy[], shots: [] as Shot[], sparks: [] as Spark[], t: 0, score: 0, lives: 3, wave: 0, inv: 0, done: false, gun: 0 };
}

export default function StarRaid({ onEnd, fill = false, autoplay = false }: { onEnd: (score: number) => void; fill?: boolean; autoplay?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const g = useRef(fresh());
  const [phase, setPhase] = useState<"ready" | "play" | "over">(autoplay ? "play" : "ready");
  // with autoplay a bot flies until the mouse shows up over the game
  const [pilot, setPilot] = useState<"bot" | "you">(autoplay ? "bot" : "you");
  const pilotRef = useRef(pilot);
  pilotRef.current = pilot;
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hud, setHud] = useState({ score: 0, lives: 3, wave: 1 });

  // idle starfield behind the start screen
  useEffect(() => {
    if (phase === "play") return;
    const ctx = ref.current!.getContext("2d")!;
    let t = 0;
    return startLoop(
      () => t++,
      () => drawSky(ctx, t)
    );
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;
    const ctx = ref.current!.getContext("2d")!;
    const boom = (x: number, y: number, c: string, n = 14) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 1 + Math.random() * 3;
        g.current.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 30 + Math.random() * 20, c });
      }
    };
    const spawnWave = () => {
      const s = g.current;
      s.wave++;
      const n = 5 + s.wave * 2;
      for (let i = 0; i < n; i++) {
        const kind = (i % 3) as 0 | 1 | 2;
        s.enemies.push({ x: 30 + ((i * 47) % (W - 60)), y: -30 - Math.floor(i / 5) * 40, vx: 0, vy: 0.6 + s.wave * 0.08, hp: kind === 2 ? 3 : 1, kind, t: i * 20, cd: 60 + Math.random() * 120 });
      }
      setHud((h) => ({ ...h, wave: s.wave }));
    };
    spawnWave();

    const step = () => {
      const s = g.current;
      if (s.done) return;
      s.t++;
      if (pilotRef.current === "bot") steer(s);
      s.x += (s.tx - s.x) * 0.25;
      s.y += (s.ty - s.y) * 0.25;
      if (s.inv > 0) s.inv--;

      // auto-fire, a spread shot after wave 3
      if (++s.gun >= 9) {
        s.gun = 0;
        s.shots.push({ x: s.x, y: s.y - 14, vy: -8, vx: 0, foe: false });
        if (s.wave >= 3) {
          s.shots.push({ x: s.x - 6, y: s.y - 10, vy: -7.5, vx: -1.2, foe: false });
          s.shots.push({ x: s.x + 6, y: s.y - 10, vy: -7.5, vx: 1.2, foe: false });
        }
      }

      for (const e of s.enemies) {
        e.t++;
        e.y += e.vy;
        e.x += e.kind === 1 ? Math.sin(e.t / 18) * 2.2 : e.kind === 2 ? Math.sin(e.t / 40) * 0.8 : 0;
        if (e.kind === 0 && e.y > 120 && e.vx === 0) e.vx = (s.x - e.x) / 60; // divers aim at you once they're in
        e.x += e.vx;
        if (e.y > 0 && --e.cd <= 0) {
          e.cd = 90 + Math.random() * 120;
          const a = Math.atan2(s.y - e.y, s.x - e.x);
          s.shots.push({ x: e.x, y: e.y + 8, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3, foe: true });
        }
      }

      for (const sh of s.shots) {
        sh.x += sh.vx;
        sh.y += sh.vy;
      }

      // bullets vs enemies
      for (const sh of s.shots) {
        if (sh.foe) continue;
        for (const e of s.enemies) {
          if (e.hp > 0 && Math.abs(sh.x - e.x) < 13 && Math.abs(sh.y - e.y) < 12) {
            e.hp--;
            sh.y = -999;
            if (e.hp <= 0) {
              s.score += e.kind === 2 ? 50 : 20;
              boom(e.x, e.y, ENEMY_COLORS[e.kind]);
            } else boom(sh.x, sh.y, ink.faint, 4);
            break;
          }
        }
      }

      // you vs enemy bullets and bodies
      const hitMe =
        s.inv === 0 &&
        (s.shots.some((sh) => sh.foe && Math.abs(sh.x - s.x) < 9 && Math.abs(sh.y - s.y) < 11) ||
          s.enemies.some((e) => e.hp > 0 && Math.abs(e.x - s.x) < 18 && Math.abs(e.y - s.y) < 16));
      if (hitMe) {
        s.lives--;
        s.inv = 90;
        boom(s.x, s.y, ink.accent, 26);
        s.shots = s.shots.filter((sh) => !sh.foe);
        if (s.lives <= 0) {
          if (pilotRef.current === "bot") {
            // the bot just respawns, no game over screen
            Object.assign(s, { lives: 3, score: 0, inv: 120 });
          } else {
            s.done = true;
            onEnd(s.score);
            setPhase("over");
            if (autoplay) {
              // give it back to the bot after a moment
              setTimeout(() => {
                g.current = fresh();
                setHud({ score: 0, lives: 3, wave: 1 });
                setPilot("bot");
                setPhase("play");
              }, 2500);
            }
          }
        }
      }

      s.enemies = s.enemies.filter((e) => e.hp > 0 && e.y < H + 40);
      s.shots = s.shots.filter((sh) => sh.y > -20 && sh.y < H + 20 && sh.x > -20 && sh.x < W + 20);
      for (const p of s.sparks) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life--;
      }
      s.sparks = s.sparks.filter((p) => p.life > 0);
      if (!s.enemies.length) spawnWave();
      if (s.t % 6 === 0) setHud({ score: s.score, lives: s.lives, wave: s.wave });
    };

    const draw = () => {
      const s = g.current;
      drawSky(ctx, s.t);
      for (const e of s.enemies) drawEnemy(ctx, e);
      for (const sh of s.shots) {
        ctx.fillStyle = sh.foe ? "#ff5d73" : ink.accent;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        if (sh.foe) {
          ctx.beginPath();
          ctx.arc(sh.x, sh.y, 3, 0, Math.PI * 2);
          ctx.fill();
        } else ctx.fillRect(sh.x - 1.5, sh.y - 6, 3, 10);
      }
      ctx.shadowBlur = 0;
      for (const p of s.sparks) {
        ctx.globalAlpha = Math.min(1, p.life / 30);
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, 2.5, 2.5);
      }
      ctx.globalAlpha = 1;
      if (s.inv % 10 < 6) drawShip(ctx, s.x, s.y, s.t);
    };

    return startLoop(step, draw);
  }, [phase, onEnd]);

  const aim = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (autoplay && pilotRef.current === "bot" && phase === "play") {
      // you take over: fresh lives and score so the run is yours
      Object.assign(g.current, { lives: 3, score: 0, inv: 60 });
      setPilot("you");
    }
    if (autoplay) {
      if (idle.current) clearTimeout(idle.current);
      idle.current = setTimeout(() => {
        if (pilotRef.current === "you" && !g.current.done) setPilot("bot");
      }, 4000);
    }
    const pt = canvasPoint(e.currentTarget, e.clientX, e.clientY);
    g.current.tx = Math.max(14, Math.min(W - 14, pt.x));
    g.current.ty = Math.max(H * 0.45, Math.min(H - 20, pt.y - (e.pointerType === "touch" ? 50 : 0))); // keep the ship above your thumb
  };

  return (
    <div className={"flex flex-col items-center gap-2 w-full " + (fill ? "h-full" : "")}>
      <div className="flex gap-4 mono text-xs text-[var(--text-dim)]">
        <span>score {hud.score}</span>
        <span>wave {hud.wave}</span>
        <span>{"▲".repeat(Math.max(0, hud.lives))}</span>
      </div>
      <div className={fill ? "relative" : "relative w-full max-w-[300px]"}>
        <canvas ref={ref} width={W} height={H} onPointerMove={aim} onPointerDown={aim} className={(fill ? "h-[calc(100vh-48px)] w-auto" : "w-full h-auto max-h-[80vh]") + " touch-none cursor-crosshair"} aria-label="Star Raid, a space shooter" />
        {autoplay && phase === "play" && (
          <p className="absolute bottom-2 left-0 right-0 text-center text-[11px] text-[var(--text-faint)] pointer-events-none">
            {pilot === "bot" ? "autopilot · move your mouse here to take over" : "you're flying"}
          </p>
        )}
        {phase !== "play" && (
          <button
            onClick={() => {
              g.current = fresh();
              setHud({ score: 0, lives: 3, wave: 1 });
              setPilot("you");
              setPhase("play");
            }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 cursor-pointer text-[var(--text)]"
          >
            <svg viewBox="-14 -16 28 36" className="w-10 h-12 mb-2 animate-bounce" aria-hidden>
              <path d="M0 -14 L12 10 L0 5 L-12 10 Z" fill="currentColor" />
              <path d="M-4 10 L0 18 L4 10 Z" fill="#ffb547" />
            </svg>
            <span className="font-display text-2xl">{phase === "over" ? "Ship down · " + hud.score : "Star Raid"}</span>
            <span className="text-sm text-[var(--text-dim)]">{phase === "over" ? "Click to fly again" : "Click to launch · move to steer"}</span>
          </button>
        )}
      </div>
    </div>
  );
}

function drawSky(ctx: CanvasRenderingContext2D, t: number) {
  // transparent: the page shows through, only the stars are drawn
  if (t % 30 === 0) {
    const c = themeColors();
    ink = { text: c.text, faint: c.faint, accent: c.accent };
  }
  ctx.clearRect(0, 0, W, H);
  for (const st of STARS) {
    const y = (st.y + t * st.s) % H;
    ctx.globalAlpha = 0.25 + st.s * 0.3;
    ctx.fillStyle = ink.faint;
    ctx.fillRect(st.x, y, st.s > 1.2 ? 2 : 1, st.s > 1.2 ? 2 : 1);
  }
  ctx.globalAlpha = 1;
}

function drawShip(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  // engine flame
  ctx.fillStyle = t % 6 < 3 ? "#ffb547" : "#ff7a3d";
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 10);
  ctx.lineTo(x, y + 18 + (t % 4));
  ctx.lineTo(x + 4, y + 10);
  ctx.fill();
  ctx.fillStyle = ink.text;
  ctx.beginPath();
  ctx.moveTo(x, y - 14);
  ctx.lineTo(x + 12, y + 10);
  ctx.lineTo(x, y + 5);
  ctx.lineTo(x - 12, y + 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = ink.accent;
  ctx.fillRect(x - 2, y - 5, 4, 6);
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy) {
  ctx.fillStyle = ENEMY_COLORS[e.kind];
  if (e.kind === 2) {
    // heavy: a chunky saucer
    ctx.beginPath();
    ctx.ellipse(e.x, e.y, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ink.text;
    ctx.fillRect(e.x - 3, e.y - 9, 6, 5);
  } else {
    ctx.beginPath();
    ctx.moveTo(e.x, e.y + 10);
    ctx.lineTo(e.x + 11, e.y - 7);
    ctx.lineTo(e.x + 4, e.y - 3);
    ctx.lineTo(e.x, e.y - 9);
    ctx.lineTo(e.x - 4, e.y - 3);
    ctx.lineTo(e.x - 11, e.y - 7);
    ctx.closePath();
    ctx.fill();
  }
}

// Autopilot: hang under the nearest enemy, but slide away from anything coming at the ship.
function steer(s: ReturnType<typeof fresh>) {
  const target = s.enemies.filter((e) => e.y > 0).sort((a, b) => Math.abs(a.x - s.x) - Math.abs(b.x - s.x))[0];
  let x = target ? target.x : W / 2 + Math.sin(s.t / 60) * 80;
  let push = 0;
  for (const sh of s.shots) {
    if (!sh.foe) continue;
    const dy = s.y - sh.y;
    if (dy > -10 && dy < 140 && Math.abs(sh.x - s.x) < 30) push += sh.x < s.x ? 1 : -1;
  }
  for (const e of s.enemies) if (e.y > s.y - 120 && Math.abs(e.x - s.x) < 34) push += e.x < s.x ? 1.5 : -1.5;
  if (push) x = s.x + Math.sign(push) * 60;
  s.tx = Math.max(16, Math.min(W - 16, x));
  s.ty = H - 70;
}
