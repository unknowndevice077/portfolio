"use client";

import { useEffect, useRef, useState } from "react";

// Same idea as the jaemboy firmware: DDA raycasting on a grid map, one wall slice per column.
const MAP = [
  "1111111111111111",
  "1000000000100001",
  "1011110110101101",
  "1010000100000101",
  "1010110101110101",
  "1000100001000001",
  "1110101111011101",
  "1000100000010001",
  "1011111011010111",
  "1000001010000001",
  "1011101010111101",
  "100010000000E001",
  "1111111111111111",
];
const W = 320;
const H = 200;
const FOV = Math.PI / 3;

function cell(x: number, y: number) {
  const row = MAP[Math.floor(y)];
  return row ? row[Math.floor(x)] ?? "1" : "1";
}

function accentRGB(): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb");
  const p = v.split(",").map((n) => parseInt(n, 10));
  return p.length === 3 && p.every((n) => !isNaN(n)) ? (p as [number, number, number]) : [56, 189, 248];
}

export default function Raycaster() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef(new Set<string>());
  const [won, setWon] = useState(false);
  const [focused, setFocused] = useState(false);
  const player = useRef({ x: 1.5, y: 1.5, a: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = player.current;
      const k = keys.current;
      const turn = (k.has("ArrowLeft") || k.has("a") ? -1 : 0) + (k.has("ArrowRight") || k.has("d") ? 1 : 0);
      const walk = (k.has("ArrowUp") || k.has("w") ? 1 : 0) + (k.has("ArrowDown") || k.has("s") ? -1 : 0);
      p.a += turn * 2.4 * dt;
      const nx = p.x + Math.cos(p.a) * walk * 2.6 * dt;
      const ny = p.y + Math.sin(p.a) * walk * 2.6 * dt;
      // slide along walls instead of stopping dead; R keeps you from pressing your face into one
      const R = 0.22;
      const ox = Math.sign(nx - p.x) * R;
      const oy = Math.sign(ny - p.y) * R;
      if (cell(nx + ox, p.y) !== "1") p.x = nx;
      if (cell(p.x, ny + oy) !== "1") p.y = ny;
      if (cell(p.x, p.y) === "E") setWon(true);

      const [r, g, b] = accentRGB();
      const sky = ctx.createLinearGradient(0, 0, 0, H / 2);
      sky.addColorStop(0, "#151b26");
      sky.addColorStop(1, "#06080c");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H / 2);
      const floor = ctx.createLinearGradient(0, H / 2, 0, H);
      floor.addColorStop(0, "#06080c");
      floor.addColorStop(1, "#1d2533");
      ctx.fillStyle = floor;
      ctx.fillRect(0, H / 2, W, H / 2);

      for (let col = 0; col < W; col++) {
        const ray = p.a - FOV / 2 + (col / W) * FOV;
        const dx = Math.cos(ray);
        const dy = Math.sin(ray);
        let mx = Math.floor(p.x);
        let my = Math.floor(p.y);
        const ddx = Math.abs(1 / dx);
        const ddy = Math.abs(1 / dy);
        const sx = dx < 0 ? -1 : 1;
        const sy = dy < 0 ? -1 : 1;
        let sdx = (dx < 0 ? p.x - mx : mx + 1 - p.x) * ddx;
        let sdy = (dy < 0 ? p.y - my : my + 1 - p.y) * ddy;
        let side = 0;
        let hit = "0";
        for (let i = 0; i < 64 && hit === "0"; i++) {
          if (sdx < sdy) {
            sdx += ddx;
            mx += sx;
            side = 0;
          } else {
            sdy += ddy;
            my += sy;
            side = 1;
          }
          hit = cell(mx, my);
        }
        const dist = (side === 0 ? sdx - ddx : sdy - ddy) * Math.cos(ray - p.a); // fish-eye fix
        const h = Math.min(H, H / Math.max(dist, 0.0001));
        // where along the tile face the ray landed, so tile edges can be drawn darker (reads as blocks, not a flat wash)
        const hitAt = side === 0 ? p.y + (sdx - ddx) * dy : p.x + (sdy - ddy) * dx;
        const frac = hitAt - Math.floor(hitAt);
        const edge = frac < 0.04 || frac > 0.96 ? 0.55 : 1;
        const shade = Math.max(0.12, 1 - dist / 7) * (side ? 0.62 : 1) * edge;
        ctx.fillStyle = hit === "E" ? "rgb(" + Math.round(255 * shade) + "," + Math.round(215 * shade) + ",60)" : "rgb(" + Math.round(r * shade) + "," + Math.round(g * shade) + "," + Math.round(b * shade) + ")";
        ctx.fillRect(col, (H - h) / 2, 1, h);
      }

      // minimap
      const s = 4;
      ctx.globalAlpha = 0.85;
      MAP.forEach((row, y) =>
        [...row].forEach((c, x) => {
          ctx.fillStyle = c === "1" ? "#2a3343" : c === "E" ? "#ffd73c" : "#0b0f16";
          ctx.fillRect(6 + x * s, 6 + y * s, s, s);
        })
      );
      ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      ctx.fillRect(6 + p.x * s - 1.5, 6 + p.y * s - 1.5, 3, 3);
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const press = (key: string, down: boolean) => {
    if (down) keys.current.add(key);
    else keys.current.delete(key);
  };

  const reset = () => {
    player.current = { x: 1.5, y: 1.5, a: 0 };
    setWon(false);
    canvasRef.current?.focus();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full max-w-[640px]">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          tabIndex={0}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            keys.current.clear();
          }}
          onKeyDown={(e) => {
            const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(k)) {
              e.preventDefault(); // keep arrow keys from scrolling the page
              keys.current.add(k);
            }
          }}
          onKeyUp={(e) => keys.current.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key)}
          className="w-full aspect-[8/5] rounded-lg border border-[var(--border)] outline-none focus:border-[var(--accent)]"
          style={{ imageRendering: "pixelated" }}
          aria-label="Raycaster maze game. Click, then use arrow keys or WASD."
        />
        {!focused && !won && (
          <button
            onClick={() => canvasRef.current?.focus()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg text-white text-sm font-semibold cursor-pointer"
          >
            Click to play · arrows / WASD · find the gold wall
          </button>
        )}
        {won && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 rounded-lg text-white">
            <p className="font-display text-2xl font-800">You escaped!</p>
            <button onClick={reset} className="text-sm px-4 py-2 rounded-md font-semibold text-[#071019] cursor-pointer" style={{ background: "var(--accent)" }}>
              Play again
            </button>
          </div>
        )}
      </div>
      {/* touch controls for phones */}
      <div className="flex gap-2 sm:hidden select-none">
        {[
          ["◀", "ArrowLeft"],
          ["▲", "ArrowUp"],
          ["▼", "ArrowDown"],
          ["▶", "ArrowRight"],
        ].map(([label, key]) => (
          <button
            key={key}
            onPointerDown={() => press(key, true)}
            onPointerUp={() => press(key, false)}
            onPointerLeave={() => press(key, false)}
            className="w-14 h-12 rounded-md glass text-lg touch-none"
            aria-label={key}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
