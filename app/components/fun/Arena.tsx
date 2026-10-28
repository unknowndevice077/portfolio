"use client";

import { useEffect, useRef, useState } from "react";
import { AnimSprite, HEROES, VILLAINS, type Fighter } from "./Fighters";

// A random hero and villain spawn at the bottom of the page and brawl.
// Click either one to make it attack. After a K.O. a new pair walks in.
type Side = "a" | "b";
type F = { x: number; hp: number; act: "in" | "idle" | "walk" | "attack" | "hit" | "down" | "held"; t: number; y: number };

const fresh = (): Record<Side, F> => ({ a: { x: -8, hp: 100, act: "in", t: 0, y: 0 }, b: { x: 108, hp: 100, act: "in", t: 0, y: 0 } });
const REACH = 8; // swords only reach when they're right next to each other

const GRABBED = ["Hey! Put me down!", "Unhand me!", "Whoa whoa whoa", "I'm in the middle of something!", "Not cool!", "Stop it!!"];
const DROPPED = ["That's it, you're next!", "Grr… you'll pay!", "Ow! Rude.", "Who did that?!", "Now I'm mad!"];
const rand = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

export default function Arena() {
  const [round, setRound] = useState(0);
  const [pair, setPair] = useState<[Fighter, Fighter]>([HEROES[0], VILLAINS[0]]);
  const [f, setF] = useState(fresh);
  const [pops, setPops] = useState<{ id: number; x: number; text: string }[]>([]);
  const [winner, setWinner] = useState<Side | null>(null);
  const [say, setSay] = useState<Partial<Record<Side, string>>>({});
  const rage = useRef<Record<Side, number>>({ a: 0, b: 0 });
  const talk = (side: Side, text: string, ms = 1800) => {
    setSay((s) => ({ ...s, [side]: text }));
    setTimeout(() => setSay((s) => (s[side] === text ? { ...s, [side]: undefined } : s)), ms);
  };
  const queued = useRef<Side | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ side: Side; sx: number; sy: number; moved: boolean } | null>(null);

  // random first matchup, picked after mount so server and client agree
  useEffect(() => {
    const t = setTimeout(() => setPair([pick(HEROES), pick(VILLAINS)]));
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setF((prev) => {
        const s = { a: { ...prev.a }, b: { ...prev.b } };
        for (const side of ["a", "b"] as Side[]) {
          const me = s[side];
          const foe = s[side === "a" ? "b" : "a"];
          const dir = side === "a" ? 1 : -1;
          if (me.act === "held") continue;
          if (me.y > 0) me.y = Math.max(0, me.y - 6);
          if (me.t > 0) me.t--;
          if (me.act === "in") {
            me.x += dir * 1.2;
            if ((side === "a" && me.x >= 20) || (side === "b" && me.x <= 80)) me.act = "idle";
            continue;
          }
          if (me.t === 0 && (me.act === "attack" || me.act === "hit")) me.act = "idle";
          if (me.act === "down" || foe.act === "down" || foe.act === "in") continue;

          const gap = Math.abs(s.b.x - s.a.x);
          if (rage.current[side] > 0) rage.current[side]--;
          const angry = rage.current[side] > 0;
          const wants = queued.current === side || angry || (me.act === "idle" && Math.random() < 0.014);
          if (wants && (me.act === "idle" || me.act === "walk")) {
            if (gap > REACH) me.act = "walk";
            else {
              if (queued.current === side) queued.current = null;
              me.act = "attack";
              me.t = 10;
              const dmg = 8 + Math.floor(Math.random() * 10);
              foe.hp = Math.max(0, foe.hp - dmg);
              foe.act = foe.hp === 0 ? "down" : "hit";
              foe.t = 6;
              foe.x += dir * 4;
              const at = foe.x;
              const text = foe.hp === 0 ? "K.O.!" : "-" + dmg;
              const ko = foe.hp === 0;
              const foeSide: Side = side === "a" ? "b" : "a";
              if (!ko && Math.random() < 0.3) setTimeout(() => talk(foeSide, rand(["Ouch!", "Hey!", "Cheap shot!", "Ow ow ow", "That stung!"]), 1100));
              if (ko) setTimeout(() => talk(foeSide, rand(["I'll be back…", "Ugh… not fair", "Next time…"]), 2600));
              setTimeout(() => {
                const pid = Date.now() + Math.random();
                setPops((p) => [...p.slice(-4), { id: pid, x: at, text }]);
                setTimeout(() => setPops((p) => p.filter((q) => q.id !== pid)), 900);
                if (ko) setWinner(side);
              });
            }
          }
          if (me.act === "walk") {
            me.x += dir * (angry ? 1.8 : 0.9);
            if (Math.abs(s.b.x - s.a.x) <= REACH) me.act = "idle";
          }
          if (me.act === "idle" && Math.random() < 0.004) me.x -= dir * 3; // back off now and then
          me.x = Math.max(6, Math.min(94, me.x));
        }
        return s;
      });
    }, 60);
    return () => clearInterval(id);
  }, []);

  // after a knockout a different pair spawns in
  useEffect(() => {
    if (!winner) return;
    const t = setTimeout(() => {
      setRound((r) => r + 1);
      setPair([pick(HEROES), pick(VILLAINS)]);
      setF(fresh());
      setWinner(null);
      queued.current = null;
    }, 3000);
    return () => clearTimeout(t);
  }, [winner]);

  const fighter = (side: Side) => {
    const me = f[side];
    const who = pair[side === "a" ? 0 : 1];
    const left = side === "a";
    return (
      <button
        key={side + round}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { side, sx: e.clientX, sy: e.clientY, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || d.side !== side || !box.current) return;
          if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 5) return;
          if (!d.moved) talk(side, rand(GRABBED), 60000);
          d.moved = true;
          const r = box.current.getBoundingClientRect();
          const x = Math.max(4, Math.min(96, ((e.clientX - r.left) / r.width) * 100));
          const y = Math.max(0, Math.min(110, r.bottom - 12 - e.clientY - 40));
          setF((s) => ({ ...s, [side]: { ...s[side], x, y, act: s[side].act === "down" ? "down" : "held" } }));
        }}
        onPointerUp={() => {
          const d = drag.current;
          drag.current = null;
          if (!d?.moved) {
            queued.current = side; // a plain click is an attack
            return;
          }
          setF((s) => ({ ...s, [side]: { ...s[side], act: s[side].act === "held" ? "idle" : s[side].act } }));
          rage.current[side] = 80; // about 5 seconds of fury
          talk(side, rand(DROPPED), 2200);
        }}
        className={"absolute -translate-x-1/2 touch-none " + (me.act === "held" ? "cursor-grabbing" : "cursor-grab")}
        style={{ left: me.x + "%", bottom: 12 + me.y }}
        aria-label={who.name + ", click to attack"}
      >
        {say[side] && (
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-elev)] border border-[var(--border)] text-[var(--text)] shadow-sm speech">
            {say[side]}
          </span>
        )}
        <p className="text-[10px] text-[var(--text-faint)] whitespace-nowrap mb-1">{who.name}</p>
        <div className="w-14 h-1.5 rounded-full bg-[var(--border)] mx-auto mb-1.5 overflow-hidden">
          <div className="h-full transition-all duration-300" style={{ width: me.hp + "%", background: me.hp > 40 ? "#4caf50" : "#e74c3c" }} />
        </div>
        {/* the outer span mirrors the villain so effects shoot toward the hero too */}
        <span className="block" style={{ transform: left ? undefined : "scaleX(-1)" }}>
          <span
            className={"relative block " + ""}
            style={{
              transform: me.act === "down" ? "rotate(-90deg) translate(-20px, 10px)" : me.act === "hit" ? "translateX(-4px)" : me.act === "held" ? "rotate(-8deg)" : undefined,
              
              transition: "transform 0.25s, filter 0.3s",
              filter: rage.current[side] > 0 ? "drop-shadow(0 0 6px #ff3b30) drop-shadow(0 0 2px #ff3b30)" : undefined,
            }}
          >
            {rage.current[side] > 0 && <span className="absolute -top-3 right-2 text-lg anger-pop" style={{ transform: left ? undefined : "scaleX(-1)" }}>💢</span>}
            <AnimSprite
              who={who}
              anim={me.act === "attack" ? "attack" : me.act === "hit" || me.act === "down" ? "hurt" : me.act === "walk" || me.act === "in" ? "run" : "idle"}
              loop={me.act !== "down" && me.act !== "attack"}
            />
          </span>
        </span>
      </button>
    );
  };

  return (
    <div ref={box} className="relative h-56 select-none overflow-hidden border-t border-[var(--border)]" aria-label="A hero and a villain fighting. Click one to attack.">
      <p className="absolute top-3 left-4 text-xs text-[var(--text-faint)]">
        {winner ? pair[winner === "a" ? 0 : 1].name + " wins! Next fight incoming…" : pair[0].name + " vs " + pair[1].name + " · click to attack, drag to move"}
      </p>
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-[var(--border)]" />
      {fighter("a")}
      {fighter("b")}
      {pops.map((p) => (
        <span key={p.id} className="absolute bottom-28 -translate-x-1/2 font-bold text-sm text-[#e74c3c] dmg-pop" style={{ left: p.x + "%" }}>
          {p.text}
        </span>
      ))}
    </div>
  );
}
