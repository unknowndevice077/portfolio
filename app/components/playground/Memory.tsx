"use client";

import { useRef, useState } from "react";
import Overlay from "./Overlay";

const STACK = [
  { name: "React", color: "#38bdf8" },
  { name: "Python", color: "#facc15" },
  { name: "ESP32", color: "#ef4444" },
  { name: "Docker", color: "#3b82f6" },
  { name: "Postgres", color: "#818cf8" },
  { name: "Java", color: "#f97316" },
  { name: "TypeScript", color: "#2563eb" },
  { name: "PyTorch", color: "#ee4c2c" },
];

type Card = { k: number; open: boolean; done: boolean };

function shuffled(): Card[] {
  const deck = [...STACK.keys(), ...STACK.keys()].map((k) => ({ k, open: false, done: false }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function Memory({ onEnd }: { onEnd: (score: number) => void }) {
  const [cards, setCards] = useState<Card[]>(() => [...STACK.keys(), ...STACK.keys()].map((k) => ({ k, open: false, done: false })));
  const [moves, setMoves] = useState(0);
  const [phase, setPhase] = useState<"ready" | "play" | "won">("ready");
  const busy = useRef(false);

  const start = () => {
    setCards(shuffled());
    setMoves(0);
    setPhase("play");
  };

  const flip = (i: number) => {
    if (busy.current || phase !== "play" || cards[i].open || cards[i].done) return;
    const next = cards.map((c, k) => (k === i ? { ...c, open: true } : c));
    const up = next.map((c, k) => (c.open && !c.done ? k : -1)).filter((k) => k >= 0);
    setCards(next);
    if (up.length < 2) return;

    const m = moves + 1;
    setMoves(m);
    const [a, b] = up;
    if (next[a].k === next[b].k) {
      const done = next.map((c, k) => (k === a || k === b ? { ...c, done: true } : c));
      setCards(done);
      if (done.every((c) => c.done)) {
        setPhase("won");
        onEnd(m);
      }
      return;
    }
    busy.current = true;
    setTimeout(() => {
      setCards((cs) => cs.map((c, k) => (k === a || k === b ? { ...c, open: false } : c)));
      busy.current = false;
    }, 700);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="mono text-sm text-[var(--text-dim)]">moves {moves}</div>
      <div className="relative grid grid-cols-4 gap-2 p-2 w-full max-w-[380px] aspect-square rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] select-none">
        {cards.map((c, i) => {
          const s = STACK[c.k];
          const shown = c.open || c.done;
          return (
            <button
              key={i}
              onClick={() => flip(i)}
              className="rounded-md flex items-center justify-center text-[11px] sm:text-sm font-bold cursor-pointer transition-all duration-200"
              style={{
                background: shown ? s.color + (c.done ? "33" : "22") : "rgba(var(--accent-rgb), 0.25)",
                border: "1px solid " + (shown ? s.color : "transparent"),
                color: shown ? s.color : "transparent",
                transform: shown ? "rotateY(0)" : "rotateY(180deg)",
                opacity: c.done ? 0.6 : 1,
              }}
              aria-label={shown ? s.name : "hidden card"}
            >
              {shown ? s.name : "?"}
            </button>
          );
        })}
        {phase !== "play" && (
          <Overlay title={phase === "won" ? "Matched in " + moves + " moves" : "Stack Match"} sub={phase === "won" ? "Click to play again" : "Click to start"} onClick={start} />
        )}
      </div>
    </div>
  );
}
