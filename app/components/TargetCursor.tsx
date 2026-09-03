"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Replaces the pointer with a targeting reticle — the same visual language
 * as EcoVision's own detection boxes. Locks onto anything interactive
 * (links, buttons, [data-cursor] elements) the way the real system locks
 * onto a detected person or weapon. Desktop, fine-pointer only; never
 * mounts its effects on touch devices, and never intercepts clicks.
 */
export default function TargetCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("target-cursor-active");

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let renderedX = x;
    let renderedY = y;

    const apply = () => {
      // Light easing so the ring trails the dot ever so slightly — reads as
      // a system "tracking" the pointer rather than glued to it.
      renderedX += (x - renderedX) * 0.35;
      renderedY += (y - renderedY) * 0.35;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${renderedX}px, ${renderedY}px, 0) translate(-50%, -50%)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${renderedX + 22}px, ${renderedY - 10}px, 0)`;
      }
      raf = requestAnimationFrame(apply);
    };
    raf = requestAnimationFrame(apply);

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      setVisible(true);
      const target = e.target as Element | null;
      setLocked(!!target?.closest('a, button, [role="button"], [data-cursor-target]'));
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("target-cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[999]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s ease" }}
    >
      {/* center dot — tracks the raw cursor position 1:1 */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full"
        style={{
          width: locked ? 4 : 3,
          height: locked ? 4 : 3,
          background: "var(--accent)",
          transition: "width 0.15s ease, height 0.15s ease",
        }}
      />
      {/* scope reticle — circle + four tick marks, the exact motif EcoVision's
          own mockup uses for its target lock. Eases toward the pointer,
          tightens + colors on lock. */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0"
        style={{
          width: locked ? 34 : 24,
          height: locked ? 34 : 24,
          transition: "width 0.18s cubic-bezier(.2,.8,.2,1), height 0.18s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <svg viewBox="-17 -17 34 34" width="100%" height="100%" style={{ overflow: "visible" }}>
          <circle
            r={locked ? 13 : 10}
            fill="none"
            stroke={locked ? "var(--accent)" : "rgba(255,255,255,0.55)"}
            strokeWidth="1.3"
            style={{ transition: "r 0.18s cubic-bezier(.2,.8,.2,1), stroke 0.15s ease" }}
          />
          {[0, 90, 180, 270].map((deg) => (
            <line
              key={deg}
              x1={0}
              y1={locked ? -17 : -15}
              x2={0}
              y2={locked ? -10 : -9}
              stroke={locked ? "var(--accent)" : "rgba(255,255,255,0.55)"}
              strokeWidth="1.3"
              transform={`rotate(${deg})`}
              style={{ transition: "y1 0.18s ease, y2 0.18s ease, stroke 0.15s ease" }}
            />
          ))}
        </svg>
      </div>
      {/* small mono label, only while locked on — echoes the demo's own detection HUD copy */}
      <div
        ref={labelRef}
        className="fixed top-0 left-0 mono text-[9px] tracking-[0.15em] whitespace-nowrap"
        style={{
          color: "var(--accent)",
          opacity: locked ? 0.9 : 0,
          transition: "opacity 0.15s ease",
        }}
      >
        TARGET
      </div>
    </div>
  );
}
