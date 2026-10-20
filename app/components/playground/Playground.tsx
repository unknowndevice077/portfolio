"use client";

import { useState } from "react";
import CodeShowcase from "../CodeShowcase";
import { ACCENTS, setTheme, useTheme } from "../../lib/theme";
import Raycaster from "./Raycaster";
import Snake from "./Snake";
import SpotTheThreat from "./SpotTheThreat";
import Terminal from "./Terminal";
import UILab from "./UILab";

const TABS = ["Games", "Themes", "UI Lab", "Terminal", "Real code"] as const;
type Tab = (typeof TABS)[number];
const GAMES = [
  { id: "raycaster", name: "Raycaster", blurb: "A tiny Doom-style maze, the same technique my ESP32 handheld runs." },
  { id: "snake", name: "Snake", blurb: "Classic, with buffered turns so quick taps never get eaten." },
  { id: "threat", name: "Spot the Threat", blurb: "Be the CCTV operator: tag the armed people, spare the bystanders." },
];

function Themes() {
  const { mode, accent } = useTheme();
  const [on, setOn] = useState(true);
  const [vol, setVol] = useState(64);
  const bars = [38, 62, 45, 80, 56, 92, 70];
  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-6">
      <div className="glass rounded-lg p-6 space-y-6">
        <div>
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)] mb-3">Mode</p>
          <div className="grid grid-cols-2 gap-2">
            {(["dark", "light"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setTheme({ mode: m })}
                className={"rounded-md py-2.5 text-sm font-semibold border capitalize cursor-pointer " + (mode === m ? "border-[var(--accent)] text-[var(--text)]" : "border-[var(--glass-border)] text-[var(--text-dim)]")}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)] mb-3">Accent</p>
          <div className="flex flex-wrap gap-2.5">
            {ACCENTS.map((a) => (
              <button
                key={a.hex}
                onClick={() => setTheme({ accent: a.hex })}
                aria-label={a.name}
                title={a.name}
                className="w-9 h-9 rounded-full cursor-pointer transition-transform hover:scale-110"
                style={{ background: a.hex, outline: accent === a.hex ? "2px solid var(--text)" : "none", outlineOffset: 3 }}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-[var(--text-faint)] leading-relaxed">
          This restyles the whole site, not just this box, and it&apos;s remembered next visit. It&apos;s all CSS variables, applied before first paint so there&apos;s no flash.
        </p>
      </div>

      {/* sample UI that reacts to the theme */}
      <div className="glass rounded-lg p-6 grid sm:grid-cols-2 gap-5">
        <div className="space-y-4">
          <p className="font-display font-800 text-lg">Weekly bookings</p>
          <div className="flex items-end gap-2 h-32">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm transition-all duration-500" style={{ height: h + "%", background: i === 5 ? "var(--accent)" : "rgba(var(--accent-rgb), 0.3)" }} />
            ))}
          </div>
          <div className="flex justify-between mono text-[10px] text-[var(--text-faint)]">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs text-[var(--text-dim)]">Email</span>
            <input defaultValue="hire@company.com" className="mt-1 w-full rounded-md bg-transparent border border-[var(--glass-border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]" />
          </label>
          <div className="flex items-center justify-between">
            <span className="text-sm">Notifications</span>
            <button onClick={() => setOn(!on)} aria-pressed={on} aria-label="Toggle notifications" className="w-11 h-6 rounded-full relative transition-colors cursor-pointer" style={{ background: on ? "var(--accent)" : "var(--glass-border)" }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: on ? 22 : 2 }} />
            </button>
          </div>
          <label className="block">
            <span className="text-xs text-[var(--text-dim)]">Volume {vol}%</span>
            <input type="range" value={vol} onChange={(e) => setVol(+e.target.value)} className="w-full mt-1" style={{ accentColor: "var(--accent)" }} />
          </label>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-md text-sm font-semibold text-[#071019]" style={{ background: "var(--accent)" }}>Primary</button>
            <button className="px-4 py-2 rounded-md text-sm font-semibold glass">Secondary</button>
            <span className="self-center mono text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>NEW</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Playground() {
  const [tab, setTab] = useState<Tab>("Games");
  const [game, setGame] = useState("raycaster");
  const g = GAMES.find((x) => x.id === game)!;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={"text-sm px-4 py-2 rounded-md font-semibold cursor-pointer transition-colors " + (tab === t ? "text-[#071019]" : "glass text-[var(--text-dim)]")}
            style={tab === t ? { background: "var(--accent)" } : undefined}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Games" && (
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {GAMES.map((x) => (
              <button
                key={x.id}
                onClick={() => setGame(x.id)}
                className={"text-sm px-3.5 py-1.5 rounded-full border cursor-pointer " + (x.id === game ? "border-[var(--accent)] text-[var(--text)]" : "border-[var(--glass-border)] text-[var(--text-dim)]")}
              >
                {x.name}
              </button>
            ))}
          </div>
          <p className="text-sm text-[var(--text-dim)] mb-5">{g.blurb}</p>
          {/* key forces a fresh game when you switch */}
          <div key={game}>
            {game === "raycaster" && <Raycaster />}
            {game === "snake" && <Snake />}
            {game === "threat" && <SpotTheThreat />}
          </div>
        </div>
      )}
      {tab === "Themes" && <Themes />}
      {tab === "UI Lab" && <UILab />}
      {tab === "Terminal" && (
        <Terminal
          onPlay={(id) => {
            setGame(id);
            setTab("Games");
          }}
        />
      )}
      {tab === "Real code" && <CodeShowcase />}
    </div>
  );
}
