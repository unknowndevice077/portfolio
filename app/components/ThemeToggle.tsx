"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import { setTheme, useTheme } from "../lib/theme";

export default function ThemeToggle() {
  const { mode } = useTheme();
  const next = mode === "dark" ? "light" : "dark";
  return (
    <button
      onClick={() => setTheme({ mode: next })}
      aria-label={"Switch to " + next + " mode"}
      title={"Switch to " + next + " mode"}
      className="relative w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--hover)] cursor-pointer overflow-hidden"
    >
      <FiSun className="absolute w-[18px] h-[18px] transition-all duration-500" style={{ transform: mode === "dark" ? "translateY(0) rotate(0)" : "translateY(28px) rotate(90deg)", opacity: mode === "dark" ? 1 : 0 }} />
      <FiMoon className="absolute w-[18px] h-[18px] transition-all duration-500" style={{ transform: mode === "light" ? "translateY(0) rotate(0)" : "translateY(-28px) rotate(-90deg)", opacity: mode === "light" ? 1 : 0 }} />
    </button>
  );
}
