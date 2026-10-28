"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY } from "./accents";

export type Mode = "dark" | "light";
export type Theme = { mode: Mode };

const DEFAULT: Theme = { mode: "light" };
const listeners = new Set<() => void>();
let current: Theme = DEFAULT;
let loaded = false;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(THEME_KEY) ?? "null");
    if (saved?.mode === "dark" || saved?.mode === "light") current = { mode: saved.mode };
  } catch {
    // private mode / blocked storage: just use the default
  }
}

export function setTheme(patch: Partial<Theme>) {
  load();
  current = { ...current, ...patch };
  document.documentElement.dataset.theme = current.mode;
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
