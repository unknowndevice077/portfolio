import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell, { PageHeading } from "../components/SiteShell";
import { techIcons } from "../components/TechIcon";
import { competitions, experience, services, skillGroups } from "../data/about";

export const metadata: Metadata = { title: "About — Fritz Dela Cruz" };

function Tag({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <span className="flex items-center gap-2 text-sm px-3.5 py-2 rounded-full border border-[var(--glass-border)] text-[var(--text-dim)] hover:border-[var(--glass-border-hover)] transition-colors">
      {Icon && <Icon className="w-4 h-4 text-[var(--text)]" />}
      {children}
    </span>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-2xl font-800 tracking-tight mb-6">{children}</h2>;
}

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHeading title="About" note="Final-year Computer Engineering student in Leyte, Philippines, building AI, IoT and full-stack systems end to end." />

      <section className="pb-14">
        <Sub>Experience</Sub>
        <div className="grid md:grid-cols-2 gap-5">
          {experience.map((r) => (
            <div key={r.title} className="glass rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: r.accent }} />
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <h3 className="font-display text-lg font-800 leading-tight">{r.title}</h3>
                <span className="mono text-xs text-[var(--text-faint)] shrink-0">{r.dates}</span>
              </div>
              <p className="text-sm mb-3" style={{ color: r.accent }}>{r.org}</p>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 border-t border-[var(--border)]">
        <Sub>Skills</Sub>
        <div className="space-y-5">
          {skillGroups.map(([group, items]) => (
            <div key={group} className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6">
              <span className="text-sm text-[var(--text-dim)] sm:w-48 shrink-0 font-medium">{group}</span>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <Tag key={item} icon={techIcons[item]}>{item}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 border-t border-[var(--border)]">
        <Sub>Competitions</Sub>
        <div className="grid md:grid-cols-2 gap-5">
          {competitions.map((c) => {
            const thumb = (
              <div className="relative w-24 h-16 sm:w-28 sm:h-20 shrink-0 rounded-md overflow-hidden border border-[var(--border)]">
                <Image src={c.certificateUrl} alt={c.title + " certificate"} width={c.certificateDims.width} height={c.certificateDims.height} sizes="120px" className="w-full h-full object-cover" />
              </div>
            );
            return (
              <div key={c.title} className="glass rounded-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: c.accent }} />
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: c.accent }}>{c.result}</p>
                    <h3 className="font-display text-lg font-800 leading-tight mb-1">{c.title}</h3>
                    <p className="text-xs text-[var(--text-faint)] mb-3">{c.org}</p>
                    <p className="text-sm text-[var(--text-dim)] leading-relaxed">{c.description}</p>
                  </div>
                  {c.storyHref ? (
                    <Link href={c.storyHref} className="shrink-0" aria-label={c.title + " story"}>{thumb}</Link>
                  ) : (
                    <a href={c.certificateUrl} target="_blank" rel="noopener noreferrer" className="shrink-0" aria-label={c.title + " certificate"}>{thumb}</a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-14 border-t border-[var(--border)]">
        <Sub>Work with me</Sub>
        <p className="text-[var(--text-dim)] mb-6 max-w-2xl">Available for freelance and contract work. Each area is backed by something already shipped.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => (
            <div key={s.title} className="glass rounded-lg p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.accent }} />
              <h3 className="font-display text-base font-700 mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-3">{s.description}</p>
              <p className="text-xs text-[var(--text-faint)] leading-relaxed">{s.proof}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
