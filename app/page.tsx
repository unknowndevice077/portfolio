import Image from "next/image";
import Link from "next/link";
import SiteShell from "./components/SiteShell";
import { projects } from "./data/projects";

const featured = ["ecovision", "bantay-baha", "queueup"];

export default function Home() {
  const picks = featured.map((s) => projects.find((p) => p.slug === s)!);
  return (
    <SiteShell>
      <header className="pt-16 pb-16 sm:pt-24 sm:pb-20">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-start w-full">
          <div>
            <div className="flex items-center gap-3 mb-6 mono text-xs tracking-[0.2em] text-[var(--text-faint)] uppercase">
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
              Computer Engineering · Leyte, Philippines
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 tracking-tight mb-2 leading-[0.95]">
              Fritz Rjhay Dela Cruz
            </h1>
            <p className="font-display text-base sm:text-lg text-[var(--accent)] tracking-tight mb-6">
              Applied AI, Full-Stack &amp; Embedded Engineer
            </p>
            <p className="text-lg text-[var(--text-dim)] leading-relaxed max-w-xl mb-8 font-body">
              I build AI, IoT and full-stack systems end to end — from trained
              vision models and ESP32 hardware to deployed backends and
              dashboards.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/projects" className="text-sm px-5 py-2.5 rounded-md font-semibold text-[#071019]" style={{ background: "var(--accent)" }}>
                See projects →
              </Link>
              <a href="https://github.com/unknowndevice077" target="_blank" rel="noopener noreferrer" className="text-sm px-5 py-2.5 rounded-md glass font-semibold">
                GitHub ↗
              </a>
              <a href="https://www.linkedin.com/in/fritz-rjhay-dela-cruz-9b604737b/" target="_blank" rel="noopener noreferrer" className="text-sm px-5 py-2.5 rounded-md glass font-semibold">
                LinkedIn ↗
              </a>
              <Link href="/resume" className="text-sm px-5 py-2.5 rounded-md glass font-semibold">
                Resume
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end order-first lg:order-last">
            <div className="target-frame relative w-36 h-36 sm:w-48 sm:h-48 rounded-lg overflow-hidden glass shrink-0">
              <Image
                src="/images/avatar-placeholder.jpg"
                alt="Fritz Rjhay Dela Cruz"
                fill
                sizes="(min-width: 640px) 12rem, 9rem"
                className="object-cover grayscale-[35%] contrast-[1.05]"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* three doors into the rest of the site */}
      <section className="grid md:grid-cols-3 gap-5 pb-10">
        <Link href="/projects" className="glass rounded-lg p-6 group">
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)] mb-3">{projects.length} projects</p>
          <h2 className="font-display text-xl font-800 mb-3 group-hover:text-[var(--accent)] transition-colors">Projects →</h2>
          <ul className="space-y-1.5 text-sm text-[var(--text-dim)]">
            {picks.map((p) => (
              <li key={p.slug}>
                <span className="text-[var(--text)] font-semibold">{p.name}</span> — {p.highlight}
              </li>
            ))}
          </ul>
        </Link>
        <Link href="/playground" className="glass rounded-lg p-6 group">
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)] mb-3">Try it</p>
          <h2 className="font-display text-xl font-800 mb-3 group-hover:text-[var(--accent)] transition-colors">Playground →</h2>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Games written from scratch, a theme switcher for this whole site, one component in six design styles, a working terminal, and real code from my repos.
          </p>
        </Link>
        <Link href="/about" className="glass rounded-lg p-6 group">
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)] mb-3">Background</p>
          <h2 className="font-display text-xl font-800 mb-3 group-hover:text-[var(--accent)] transition-colors">About →</h2>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            Skills, experience, competitions, and the kind of work I take on.
          </p>
        </Link>
      </section>
    </SiteShell>
  );
}
