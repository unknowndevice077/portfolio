// Shared by the arcade UI and the /api/scores route, so no "use client" here.
export type GameInfo = {
  id: string;
  name: string;
  blurb: string;
  how: string;
  unit: string;
  lower?: boolean; // true when a smaller score wins (time, moves)
  max: number; // anything above this is rejected as cheating
};

export const GAMES: GameInfo[] = [
  { id: "breakout", name: "Breakout", blurb: "Smash every brick. The ball speeds up as you go.", how: "Mouse / touch or ← → · click or space to launch", unit: "pts", max: 2000 },
  { id: "flappy", name: "Flappy Chip", blurb: "Keep a tiny ESP32 airborne through the circuit board.", how: "Click, tap or space to flap", unit: "pipes", max: 999 },
  { id: "2048", name: "2048", blurb: "Slide and merge tiles. Reach 2048, then keep going.", how: "Arrow keys / WASD or swipe", unit: "pts", max: 500000 },
  { id: "snake", name: "Snake", blurb: "Classic, with buffered turns so quick taps never get eaten.", how: "Arrow keys / WASD or the pad", unit: "food", max: 397 },
  { id: "mines", name: "Minesweeper", blurb: "Clear the 9×9 field without hitting one of the 10 mines.", how: "Click to open · right-click or flag mode to flag", unit: "s", lower: true, max: 9999 },
  { id: "memory", name: "Stack Match", blurb: "Flip cards and pair up the tech I build with.", how: "Click two cards at a time", unit: "moves", lower: true, max: 999 },
  { id: "whack", name: "Whack-a-Bug", blurb: "Squash bugs for 30 seconds. Don't squash the features.", how: "Click or tap the bugs", unit: "bugs", max: 150 },
  { id: "threat", name: "Spot the Threat", blurb: "Be the CCTV operator: tag the armed people, spare the bystanders.", how: "Click the armed people", unit: "pts", max: 500 },
];

export const gameById = (id: string) => GAMES.find((g) => g.id === id);

export function cleanName(raw: unknown) {
  if (typeof raw !== "string") return "";
  return raw.replace(/[^\p{L}\p{N} _.-]/gu, "").trim().slice(0, 14);
}
