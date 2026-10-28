// Small helpers for the canvas games.
export function themeColors() {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string) => s.getPropertyValue(n).trim();
  return { accent: v("--accent"), accentRgb: v("--accent-rgb"), bg: v("--bg-elev"), text: v("--text"), dim: v("--text-dim"), faint: v("--text-faint"), border: v("--border") };
}

// Fixed 60Hz steps so the games run the same speed on a 144Hz monitor.
export function startLoop(step: () => void, draw: () => void) {
  let raf = 0;
  let last = performance.now();
  let acc = 0;
  const tick = (t: number) => {
    acc += Math.min(100, t - last);
    last = t;
    while (acc >= 1000 / 60) {
      step();
      acc -= 1000 / 60;
    }
    draw();
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export function canvasPoint(c: HTMLCanvasElement, clientX: number, clientY: number) {
  const r = c.getBoundingClientRect();
  return { x: ((clientX - r.left) * c.width) / r.width, y: ((clientY - r.top) * c.height) / r.height };
}
