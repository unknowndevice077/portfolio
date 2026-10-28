import type { Metadata } from "next";
import Link from "next/link";
import SiteShell, { PageHeading } from "../components/SiteShell";
import { competitions, experience, skillGroups } from "../data/about";

export const metadata: Metadata = { title: "About — Fritz Dela Cruz" };

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid sm:grid-cols-[140px_1fr] gap-x-8 gap-y-3 py-8 border-t border-[var(--border)]">
      <h2 className="label pt-1">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHeading title="About" />
      <div className="text-[18px] leading-[1.75] text-[var(--text-dim)] max-w-[62ch] space-y-4 mb-12">
        <p>
          I&apos;m Fritz, a Computer Engineering student in Leyte, Philippines, and right now a remote full-stack intern at Nexvia
          Technologies. I like building the whole thing: the database rules, the API, the screen people actually use, and
          sometimes the circuit board too.
        </p>
        <p>
          Most of what I make starts from a real problem close to home: barangays that need to spot a crime or a flood early,
          small clinics running on paper logbooks, a seller sharing files over chat. I&apos;m looking for a full-stack or
          applied-AI role where I can keep shipping things like that.
        </p>
      </div>

      <Block title="Experience">
        <div className="space-y-6">
          {experience.map((r) => (
            <div key={r.title}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <p className="text-[17px]">{r.title}</p>
                <p className="text-sm text-[var(--text-faint)]">{r.dates}</p>
              </div>
              <p className="text-sm text-[var(--text-faint)]">{r.org}</p>
              <p className="text-[15px] text-[var(--text-dim)] leading-relaxed mt-2">{r.description}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Education">
        <p className="text-[17px]">BS Computer Engineering</p>
        <p className="text-sm text-[var(--text-faint)]">Western Leyte College, Ormoc City · in progress</p>
        <p className="text-[15px] text-[var(--text-dim)] leading-relaxed mt-2">
          Embedded Systems, Computer Vision, Robotics, Microprocessors, Cloud &amp; Databases.
        </p>
      </Block>

      <Block title="Skills">
        <dl className="space-y-3 text-[15px]">
          {skillGroups.map(([group, items]) => (
            <div key={group} className="grid sm:grid-cols-[170px_1fr] gap-x-4">
              <dt className="text-[var(--text-faint)]">{group}</dt>
              <dd className="text-[var(--text-dim)]">{items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block title="Competitions">
        <div className="space-y-5">
          {competitions.map((c) => (
            <div key={c.title}>
              <p className="text-[17px]">{c.title}</p>
              <p className="text-sm text-[var(--text-faint)]">
                {c.org} · {c.result}
              </p>
              <p className="text-[15px] text-[var(--text-dim)] leading-relaxed mt-2">{c.description}</p>
              <div className="flex gap-5 mt-2 text-sm">
                <a href={c.certificateUrl} target="_blank" rel="noopener noreferrer" className="link">
                  Certificate ↗
                </a>
                {c.storyHref && (
                  <Link href={c.storyHref} className="link">
                    The project →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Contact">
        <p className="text-[15px] text-[var(--text-dim)] leading-relaxed">
          Open to remote full-time, internship or contract work. The fastest way to reach me is{" "}
          <a href="mailto:frjhay.delacruz@gmail.com" className="link">
            frjhay.delacruz@gmail.com
          </a>
          .
        </p>
      </Block>
    </SiteShell>
  );
}
