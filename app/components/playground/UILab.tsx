"use client";

import { useState } from "react";

// One booking widget, six visual languages. Same state and behaviour underneath, only the styling changes.
const SLOTS = ["9:00", "9:30", "10:00", "10:30", "11:00", "1:30"];
const TAKEN = new Set(["9:30", "11:00"]);

type Props = { slot: string | null; setSlot: (s: string) => void; booked: boolean; book: () => void };

function Glass({ slot, setSlot, booked, book }: Props) {
  return (
    <div className="rounded-2xl p-6 w-full max-w-sm text-white border border-white/20 shadow-2xl" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))", backdropFilter: "blur(14px)" }}>
      <p className="text-xs uppercase tracking-widest opacity-70">Sanare Dental</p>
      <h4 className="text-xl font-semibold mb-4">Book a cleaning</h4>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {SLOTS.map((s) => (
          <button key={s} disabled={TAKEN.has(s)} onClick={() => setSlot(s)} className={"rounded-lg py-2 text-sm border transition " + (slot === s ? "bg-white text-slate-900 border-white" : "border-white/25 hover:bg-white/10") + (TAKEN.has(s) ? " opacity-30 line-through" : "")}>
            {s}
          </button>
        ))}
      </div>
      <button onClick={book} disabled={!slot} className="w-full rounded-lg py-2.5 font-semibold bg-white/90 text-slate-900 disabled:opacity-40">
        {booked ? "Booked ✓" : "Confirm"}
      </button>
    </div>
  );
}

function Brutalist({ slot, setSlot, booked, book }: Props) {
  return (
    <div className="w-full max-w-sm bg-[#fffb00] text-black p-5 border-[3px] border-black" style={{ boxShadow: "8px 8px 0 #000", fontFamily: "Arial Black, Arial, sans-serif" }}>
      <h4 className="text-2xl uppercase leading-none mb-1">BOOK NOW.</h4>
      <p className="text-xs uppercase mb-4">Sanare Dental / Cleaning / ₱800</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {SLOTS.map((s) => (
          <button key={s} disabled={TAKEN.has(s)} onClick={() => setSlot(s)} className={"border-[3px] border-black py-2 text-sm " + (slot === s ? "bg-black text-[#fffb00]" : "bg-white") + (TAKEN.has(s) ? " opacity-30" : "")}>
            {s}
          </button>
        ))}
      </div>
      <button onClick={book} disabled={!slot} className="w-full border-[3px] border-black bg-[#ff3d00] text-white py-2.5 text-lg uppercase disabled:opacity-50" style={{ boxShadow: "4px 4px 0 #000" }}>
        {booked ? "DONE!" : "CONFIRM →"}
      </button>
    </div>
  );
}

function Neumorphic({ slot, setSlot, booked, book }: Props) {
  const out = "6px 6px 12px #b8bec7, -6px -6px 12px #ffffff";
  const inn = "inset 4px 4px 8px #b8bec7, inset -4px -4px 8px #ffffff";
  return (
    <div className="w-full max-w-sm rounded-3xl p-6 bg-[#e3e8ef] text-slate-600" style={{ boxShadow: out }}>
      <h4 className="text-lg font-semibold text-slate-700 mb-1">Book a cleaning</h4>
      <p className="text-xs mb-5">Sanare Dental · 30 min</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {SLOTS.map((s) => (
          <button key={s} disabled={TAKEN.has(s)} onClick={() => setSlot(s)} className={"rounded-xl py-2 text-sm bg-[#e3e8ef] " + (TAKEN.has(s) ? "opacity-40" : "")} style={{ boxShadow: slot === s ? inn : out, color: slot === s ? "#2563eb" : undefined }}>
            {s}
          </button>
        ))}
      </div>
      <button onClick={book} disabled={!slot} className="w-full rounded-xl py-3 font-semibold bg-[#e3e8ef] text-blue-600 disabled:opacity-50" style={{ boxShadow: booked ? inn : out }}>
        {booked ? "Booked" : "Confirm"}
      </button>
    </div>
  );
}

function Terminal({ slot, setSlot, booked, book }: Props) {
  return (
    <div className="w-full max-w-sm rounded-md bg-black text-[#33ff66] p-4 font-mono text-sm border border-[#1f3d25]">
      <p className="opacity-70">$ queueup book --clinic sanare-dental</p>
      <p className="mb-3">? pick a slot:</p>
      <div className="mb-3">
        {SLOTS.map((s) => (
          <button key={s} disabled={TAKEN.has(s)} onClick={() => setSlot(s)} className={"block text-left w-full " + (TAKEN.has(s) ? "opacity-30" : "hover:bg-[#0f2a15]")}>
            {slot === s ? "❯ " : "  "}
            {s} {TAKEN.has(s) ? "(taken)" : ""}
          </button>
        ))}
      </div>
      <button onClick={book} disabled={!slot} className="disabled:opacity-40 hover:underline">
        {booked ? "✔ booking confirmed: " + slot : "[ enter ] confirm"}
      </button>
    </div>
  );
}

function Retro({ slot, setSlot, booked, book }: Props) {
  return (
    <div className="w-full max-w-sm bg-[#2b1b54] text-[#fef3c7] p-5 border-4 border-[#fef3c7]" style={{ fontFamily: "'Courier New', monospace", imageRendering: "pixelated", boxShadow: "0 0 0 4px #2b1b54, 0 0 0 8px #f472b6" }}>
      <h4 className="text-lg mb-1 tracking-wider">★ BOOKING QUEST ★</h4>
      <p className="text-xs mb-4 text-[#f472b6]">LVL 1 · CLEANING · +800 GOLD</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {SLOTS.map((s) => (
          <button key={s} disabled={TAKEN.has(s)} onClick={() => setSlot(s)} className={"py-2 text-sm border-2 " + (slot === s ? "bg-[#f472b6] text-[#2b1b54] border-[#fef3c7]" : "border-[#f472b6]") + (TAKEN.has(s) ? " opacity-30" : "")}>
            {s}
          </button>
        ))}
      </div>
      <button onClick={book} disabled={!slot} className="w-full py-2 bg-[#facc15] text-[#2b1b54] border-2 border-[#fef3c7] disabled:opacity-40">
        {booked ? "QUEST COMPLETE!" : "▶ PRESS START"}
      </button>
    </div>
  );
}

function Material({ slot, setSlot, booked, book }: Props) {
  return (
    <div className="w-full max-w-sm rounded-[28px] bg-white text-[#1d1b20] p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15),0_8px_24px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#e8def8] flex items-center justify-center text-[#4f378b] font-semibold">SD</div>
        <div>
          <h4 className="font-medium">Sanare Dental</h4>
          <p className="text-xs text-[#49454f]">Cleaning · 30 min · ₱800</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {SLOTS.map((s) => (
          <button key={s} disabled={TAKEN.has(s)} onClick={() => setSlot(s)} className={"rounded-lg px-3 py-1.5 text-sm border " + (slot === s ? "bg-[#e8def8] border-[#e8def8] text-[#1d192b]" : "border-[#79747e]") + (TAKEN.has(s) ? " opacity-35" : "")}>
            {slot === s ? "✓ " : ""}
            {s}
          </button>
        ))}
      </div>
      <button onClick={book} disabled={!slot} className="w-full rounded-full py-2.5 bg-[#6750a4] text-white font-medium disabled:bg-[#1d1b20]/10 disabled:text-[#1d1b20]/40">
        {booked ? "Booked" : "Confirm booking"}
      </button>
    </div>
  );
}

const STYLES = [
  { name: "Glass", C: Glass, bg: "linear-gradient(135deg,#4f46e5,#db2777)" },
  { name: "Brutalist", C: Brutalist, bg: "#f5f5f0" },
  { name: "Neumorphic", C: Neumorphic, bg: "#e3e8ef" },
  { name: "Terminal", C: Terminal, bg: "#0a0a0a" },
  { name: "Retro 8-bit", C: Retro, bg: "#120b26" },
  { name: "Material 3", C: Material, bg: "#f3edf7" },
];

export default function UILab() {
  const [i, setI] = useState(0);
  const [slot, setSlotRaw] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const { C, bg } = STYLES[i];
  const setSlot = (s: string) => {
    setSlotRaw(s);
    setBooked(false);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {STYLES.map((s, si) => (
          <button
            key={s.name}
            onClick={() => setI(si)}
            className={"text-sm px-3.5 py-1.5 rounded-full border cursor-pointer " + (si === i ? "border-[var(--accent)] text-[var(--text)]" : "border-[var(--glass-border)] text-[var(--text-dim)]")}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="rounded-lg min-h-[380px] flex items-center justify-center p-6 sm:p-10 transition-[background] duration-500" style={{ background: bg }}>
        <C slot={slot} setSlot={setSlot} booked={booked} book={() => slot && setBooked(true)} />
      </div>
      <p className="text-xs text-[var(--text-faint)] mt-3">
        Pick a time and book it, then switch styles: your selection carries over because it&apos;s one component with six skins.
      </p>
    </div>
  );
}
