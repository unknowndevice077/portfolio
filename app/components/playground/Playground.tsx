"use client";

import { useCallback, useState } from "react";
import { GAMES } from "../../lib/games";
import Breakout from "./Breakout";
import Flappy from "./Flappy";
import Game2048 from "./Game2048";
import Leaderboard from "./Leaderboard";
import Memory from "./Memory";
import Minesweeper from "./Minesweeper";
import Snake from "./Snake";
import SpotTheThreat from "./SpotTheThreat";
import WhackABug from "./WhackABug";
import { useBest } from "./scores";

type End = (score: number) => void;
const PLAY: Record<string, (p: { onEnd: End }) => React.ReactNode> = {
  breakout: Breakout,
  flappy: Flappy,
  "2048": Game2048,
  snake: Snake,
  mines: Minesweeper,
  memory: Memory,
  whack: WhackABug,
  threat: SpotTheThreat,
};

export default function Playground() {
  const [game, setGame] = useState("breakout");
  const [last, setLast] = useState(0);
  const g = GAMES.find((x) => x.id === game)!;
  const [, saveBest] = useBest(g.id, g.lower);
  const Game = PLAY[game];

  const onEnd = useCallback(
    (score: number) => {
      saveBest(score);
      setLast(score);
    },
    [saveBest]
  );

  return (
    <div>
      <div className="flex gap-x-5 gap-y-2 flex-wrap mb-8 text-[15px]" role="tablist" aria-label="Pick a game">
        {GAMES.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={x.id === game}
            onClick={() => {
              setGame(x.id);
              setLast(0);
            }}
            className={"cursor-pointer transition-colors " + (x.id === game ? "text-[var(--text)] underline underline-offset-[6px] decoration-2" : "text-[var(--text-faint)] hover:text-[var(--text)]")}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div className="grid xl:grid-cols-[1fr_250px] gap-10 items-start">
        <div>
          <p className="text-[var(--text-dim)]">{g.blurb}</p>
          <p className="text-sm text-[var(--text-faint)] mt-1 mb-6">{g.how}</p>
          {/* key forces a fresh game when you switch */}
          <div key={game}>
            <Game onEnd={onEnd} />
          </div>
        </div>
        <Leaderboard key={game} game={g} last={last} />
      </div>
    </div>
  );
}
