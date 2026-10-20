"use client";

import { useSyncExternalStore } from "react";
import { ACCENTS, THEME_KEY } from "./accents";

export { ACCENTS };
export type Mode = "dark" | "light";
export type Theme = { mode: Mode; accent: string };

const DEFAULT: Theme = { mode: "dark", accent: ACCENTS[0].hex };
const listeners = new Set<() => void>();
let current: Theme = DEFAULT;
let loaded = false;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(THEME_KEY) ?? "null");
    if (saved?.mode && saved?.accent) current = saved;
  } catch {
    // private mode / blocked storage: just use the default
  }
}

function apply(t: Theme) {
  const root = document.documentElement;
  root.dataset.theme = t.mode;
  const a = ACCENTS.find((x) => x.hex === t.accent) ?? ACCENTS[0];
  root.style.setProperty("--accent", a.hex);
  root.style.setProperty("--accent-rgb", a.rgb);
}

export function setTheme(patch: Partial<Theme>) {
  load();
  current = { ...current, ...patch };
  apply(current);
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(current));
  } catch {}
  listeners.forEach((l) => l());
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => {
      load();
      return current;
    },
    () => DEFAULT
  );
}
