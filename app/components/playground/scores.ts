"use client";

import { useCallback, useSyncExternalStore } from "react";

// Personal bests stay in localStorage; the shared leaderboard is /api/scores.
const KEY = "fritz-best-";
const listeners = new Set<() => void>();

function read(id: string) {
  try {
    return Number(localStorage.getItem(KEY + id)) || 0;
  } catch {
    return 0;
  }
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useBest(id: string, lower = false) {
  const best = useSyncExternalStore(subscribe, () => read(id), () => 0);
  const submit = useCallback(
    (score: number) => {
      if (score <= 0) return;
      const b = read(id);
      if (b && (lower ? score >= b : score <= b)) return;
      try {
        localStorage.setItem(KEY + id, String(score));
      } catch {}
      listeners.forEach((l) => l());
    },
    [id, lower]
  );
  return [best, submit] as const;
}

export function readName() {
  try {
    return localStorage.getItem("fritz-player") ?? "";
  } catch {
    return "";
  }
}

export function saveName(n: string) {
  try {
    localStorage.setItem("fritz-player", n);
  } catch {}
}
