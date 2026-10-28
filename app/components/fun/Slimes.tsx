"use client";

import { useState } from "react";
import Sprite, { SLIME } from "./Sprite";

const COLORS = [
  ["#7cc576", "#4f9a49"],
  ["#6aa9e9", "#3f7cc0"],
  ["#e98fb0", "#c0607f"],
];

// three slimes that idle-hop on their own and jump high when clicked
export default function Slimes() {
  const [boost, setBoost] = useState<number[]>([0, 0, 0]);

  return (
    <div className="flex items-end gap-3 h-14" aria-label="Slimes, click one">
      {COLORS.map(([a, b], i) => (
        <button
          key={i}
          onClick={() => setBoost((s) => s.map((v, k) => (k === i ? v + 1 : v)))}
          className="cursor-pointer"
          aria-label="Make the slime jump"
        >
          <span key={boost[i]} className={boost[i] ? "block slime-big" : "block slime-hop"} style={{ animationDelay: boost[i] ? "0s" : i * 0.35 + "s" }}>
            <Sprite art={SLIME(a, b)} size={3} />
          </span>
        </button>
      ))}
    </div>
  );
}
