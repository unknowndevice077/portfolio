"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBriefcase, FiFileText, FiGithub, FiLinkedin, FiMail, FiPlay, FiUser } from "react-icons/fi";
import Arena from "./fun/Arena";
import Slimes from "./fun/Slimes";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Work", icon: FiBriefcase, match: (p: string) => p === "/" || p.startsWith("/projects") },
  { href: "/playground", label: "Play", icon: FiPlay, match: (p: string) => p.startsWith("/playground") },
  { href: "/about", label: "About", icon: FiUser, match: (p: string) => p.startsWith("/about") },
  { href: "/resume", label: "Resume", icon: FiFileText, match: (p: string) => p.startsWith("/resume") },
];

const CONTACT = [
  { label: "Email", icon: FiMail, href: "mailto:frjhay.delacruz@gmail.com" },
  { label: "GitHub", icon: FiGithub, href: "https://github.com/unknowndevice077" },
  { label: "LinkedIn", icon: FiLinkedin, href: "https://www.linkedin.com/in/fritz-rjhay-dela-cruz-9b604737b/" },
];

function Nav({ path, row }: { path: string; row?: boolean }) {
  return (
    <nav className={row ? "flex gap-5" : "flex flex-col gap-1.5"}>
      {NAV.map((n) => {
        const on = n.match(path);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={on ? "page" : undefined}
            className={
              "relative flex items-center gap-2.5 transition-colors " +
              (row ? "text-[15px] py-1 " : "text-[17px] py-1 px-3 -mx-3 rounded-md " + (on ? "bg-[var(--hover)] " : "")) +
              (on ? "text-[var(--text)]" : "text-[var(--text-faint)] hover:text-[var(--text)]")
            }
          >
            {on && row && <span className="absolute left-0 right-0 -bottom-[13px] h-[2px]" style={{ background: "var(--text)" }} />}
            <n.icon className={row ? "w-4 h-4 hidden sm:block" : "w-[17px] h-[17px]"} />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="lg:grid lg:grid-cols-[300px_1fr] min-h-screen">
      {/* desktop sidebar */}
      <aside className="hidden lg:flex flex-col sticky top-0 h-screen px-10 py-12 border-r border-[var(--border)]">
        <Link href="/" className="font-display text-[30px] leading-[1.1]">
          Fritz Rjhay
          <br />
          Dela Cruz
        </Link>
        <p className="text-[15px] text-[var(--text-dim)] leading-relaxed mt-4">
          Computer engineer building full-stack, AI and embedded systems. Full-stack intern at Nexvia.
        </p>
        <div className="mt-12">
          <Nav path={path} />
        </div>
        <div className="mt-auto space-y-5">
          <Slimes />
          <div className="flex flex-col gap-1.5 text-sm">
            {CONTACT.map((c) => (
              <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--text)] w-fit">
                <c.icon className="w-4 h-4" />
                {c.label}
              </a>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-[var(--text-faint)]">
            <span>Leyte, PH · open to remote</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* mobile header */}
      <header className="lg:hidden sticky top-0 z-20 bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="px-5 h-14 flex items-center justify-between">
          <Link href="/" className="font-display text-xl">
            Fritz Dela Cruz
          </Link>
          <ThemeToggle />
        </div>
        <div className="px-5 pb-3">
          <Nav path={path} row />
        </div>
      </header>

      <div className="min-w-0 flex flex-col">
        <main key={path} className="enter flex-1 w-full max-w-[880px] px-5 sm:px-10 lg:px-16 pt-10 lg:pt-16 pb-16">
          {children}
        </main>
        <Arena />
        <footer className="lg:hidden px-5 py-8 border-t border-[var(--border)] flex gap-5 text-sm">
          {CONTACT.map((c) => (
            <a key={c.label} href={c.href} aria-label={c.label} className="text-[var(--text-dim)]">
              <c.icon className="w-5 h-5" />
            </a>
          ))}
        </footer>
      </div>
    </div>
  );
}

export function PageHeading({ title, note }: { title: string; note?: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h1 className="font-display text-[40px] sm:text-[48px] leading-[1.05]">{title}</h1>
      {note && <p className="text-[var(--text-dim)] max-w-[60ch] text-[17px] leading-relaxed mt-3">{note}</p>}
    </div>
  );
}
