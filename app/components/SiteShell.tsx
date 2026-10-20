"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SceneBackground from "./SceneBackground";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../lib/theme";

const LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/playground", label: "Playground" },
  { href: "/about", label: "About" },
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const { accent } = useTheme();
  const path = usePathname();

  return (
    <>
      <SceneBackground accent1={accent} accent2={accent} />
      <nav className="sticky top-0 z-20 backdrop-blur-md bg-[var(--nav-bg)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-12 h-14 flex items-center gap-3 sm:gap-6 text-sm">
          <Link href="/" className="font-display font-800 mr-auto whitespace-nowrap">
            Fritz<span className="hidden sm:inline"> Dela Cruz</span>
          </Link>
          {LINKS.map((l) => {
            const on = path === l.href || path.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={on ? "text-[var(--text)] font-semibold" : "text-[var(--text-dim)] hover:text-[var(--text)]"}
                style={on ? { textDecoration: "underline", textDecorationColor: "var(--accent)", textUnderlineOffset: 6, textDecorationThickness: 2 } : undefined}
              >
                {l.label}
              </Link>
            );
          })}
          <ThemeToggle />
          <Link
            href="/resume"
            className="hidden sm:inline px-3.5 py-1.5 rounded-md font-semibold text-[#071019]"
            style={{ background: "var(--accent)" }}
          >
            Resume
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">{children}</main>

      <footer className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-14 mt-10 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <p className="text-[var(--text-dim)] text-sm">Open to remote full-time or contract work.</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="mailto:frjhay.delacruz@gmail.com" className="text-[var(--accent)] hover:underline">frjhay.delacruz@gmail.com</a>
          <span className="text-[var(--text-faint)]">·</span>
          <a href="https://github.com/unknowndevice077" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">GitHub</a>
          <span className="text-[var(--text-faint)]">·</span>
          <a href="https://www.linkedin.com/in/fritz-rjhay-dela-cruz-9b604737b/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">LinkedIn</a>
          <span className="text-[var(--text-faint)]">·</span>
          <Link href="/resume" className="text-[var(--accent)] hover:underline">Resume</Link>
        </div>
      </footer>
    </>
  );
}

export function PageHeading({ title, note }: { title: string; note?: string }) {
  return (
    <div className="pt-14 pb-8">
      <h1 className="font-display text-4xl sm:text-5xl font-800 tracking-tight mb-3">{title}</h1>
      {note && <p className="text-[var(--text-dim)] max-w-2xl text-lg">{note}</p>}
    </div>
  );
}
