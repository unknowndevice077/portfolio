"use client";

import StarRaid from "./playground/StarRaid";
import { useBest } from "./playground/scores";

// The empty space on wide screens is just a game.
export default function RightRail() {
  const [, save] = useBest("starraid");
  return (
    <aside className="hidden min-[1360px]:flex justify-center sticky top-0 h-screen shrink-0 pt-3 pr-6 ml-auto" aria-label="Star Raid">
      <StarRaid onEnd={save} fill autoplay />
    </aside>
  );
}
