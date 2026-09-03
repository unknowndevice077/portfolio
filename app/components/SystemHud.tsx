"use client";

import { useEffect, useState } from "react";

function formatTime(d: Date) {
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
}

/**
 * A small corner readout — the site's own "system status" line, in the
 * same voice as the detection HUDs in the project demos. Live local time
 * (Leyte, PH) doubles as quiet proof the page is actually alive, not a
 * screenshot; the status line does double duty as the hire-me signal.
 */
export default function SystemHud() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatTime(new Date()));
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null; // avoid an SSR/CSR mismatch on the first tick

  return (
    <div
      aria-hidden="true"
      className="hidden sm:flex fixed bottom-5 right-5 z-40 items-center gap-2.5 pointer-events-none select-none"
    >
      <div className="glass rounded-full pl-3 pr-4 py-2 flex items-center gap-2.5 mono text-[10px] tracking-[0.1em] text-[var(--text-faint)]">
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ background: "var(--accent)", animation: "hud-pulse 2s ease-in-out infinite" }}
          />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "var(--accent)" }} />
        </span>
        <span style={{ color: "var(--accent)" }}>AVAILABLE</span>
        <span className="opacity-30">·</span>
        <span>PH {time}</span>
      </div>
    </div>
  );
}
