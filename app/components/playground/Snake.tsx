"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const N = 20;
type P = { x: number; y: number };
const DIRS: Record<string, P> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

function randomFood(snake: P[]): P {
  for (;;) {
    const f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
    if (!snake.some((s) => s.x === f.x && s.y === f.y)) return f;
  }
}

export default function Snake() {
  const start = () => [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
  const [snake, setSnake] = useState<P[]>(start);
  const [food, setFood] = useState<P>({ x: 14, y: 10 });
  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);
  const [best, setBest] = useState(0);
  const dir = useRef<P>({ x: 1, y: 0 });
  const queued = useRef<P[]>([]); // buffer turns so two quick taps in one tick both count
  const boardRef = useRef<HTMLDivElement>(null);

  const score = snake.length - 3;

  const restart = useCallback(() => {
    const s = start();
    setSnake(s);
    setFood(randomFood(s));
    dir.current = { x: 1, y: 0 };
    queued.current = [];
    setDead(false);
    setRunning(true);
    boardRef.current?.focus();
  }, []);

  const turn = (d: P) => {
    const last = queued.current[queued.current.length - 1] ?? dir.current;
    if (last.x + d.x === 0 && last.y + d.y === 0) return; // no reversing into yourself
    if (queued.current.length < 3) queued.current.push(d);
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (queued.current.length) dir.current = queued.current.shift()!;
      setSnake((s) => {
        const head = { x: s[0].x + dir.current.x, y: s[0].y + dir.current.y };
        const hitWall = head.x < 0 || head.y < 0 || head.x >= N || head.y >= N;
        if (hitWall || s.some((p) => p.x === head.x && p.y === head.y)) {
          setRunning(false);
          setDead(true);
          setBest((b) => Math.max(b, s.length - 3));
          return s;
        }
        const ate = head.x === food.x && head.y === food.y;
        const next = [head, ...s];
        if (ate) setFood(randomFood(next));
        else next.pop();
        return next;
      });
    }, Math.max(70, 140 - score * 3));
    return () => clearInterval(id);
  }, [running, food, score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 mono text-sm text-[var(--text-dim)]">
        <span>score {score}</span>
        <span>best {Math.max(best, dead ? score : 0)}</span>
      </div>
      <div
        ref={boardRef}
        tabIndex={0}
        onKeyDown={(e) => {
          const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
          if (DIRS[k]) {
            e.preventDefault();
            if (!running && !dead) setRunning(true);
            turn(DIRS[k]);
          }
        }}
        className="relative grid w-full max-w-[360px] aspect-square rounded-lg border border-[var(--border)] outline-none focus:border-[var(--accent)] bg-[var(--bg-elev)]"
        style={{ gridTemplateColumns: "repeat(" + N + ", 1fr)" }}
        aria-label="Snake game. Use arrow keys or WASD."
      >
        {Array.from({ length: N * N }, (_, i) => {
          const x = i % N;
          const y = Math.floor(i / N);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isBody = !isHead && snake.some((p) => p.x === x && p.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={i}
              className="m-[1px] rounded-[3px]"
              style={{
                background: isHead ? "var(--accent)" : isBody ? "rgba(var(--accent-rgb), 0.55)" : isFood ? "#f43f5e" : "transparent",
              }}
            />
          );
        })}
        {(!running || dead) && (
          <button
            onClick={restart}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 rounded-lg text-white cursor-pointer"
          >
            <span className="font-display text-xl font-800">{dead ? "Game over · " + score : "Snake"}</span>
            <span className="text-sm">{dead ? "Click to try again" : "Click to start · arrows / WASD"}</span>
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:hidden select-none">
        <span />
        <button onClick={() => turn(DIRS.ArrowUp)} className="w-14 h-12 rounded-md glass" aria-label="Up">▲</button>
        <span />
        <button onClick={() => turn(DIRS.ArrowLeft)} className="w-14 h-12 rounded-md glass" aria-label="Left">◀</button>
        <button onClick={() => turn(DIRS.ArrowDown)} className="w-14 h-12 rounded-md glass" aria-label="Down">▼</button>
        <button onClick={() => turn(DIRS.ArrowRight)} className="w-14 h-12 rounded-md glass" aria-label="Right">▶</button>
      </div>
    </div>
  );
}
