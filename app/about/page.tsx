import type { Metadata } from "next";
import Link from "next/link";
import EmailLink from "../components/EmailLink";
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
          I&apos;m Fritz Rjhay L. Dela Cruz, but most people call me Rjhay or Jae. I&apos;m a Computer Engineering student from Leyte, Philippines, currently working as a
          remote full-stack intern at Nexvia Technologies.
        </p>
        <p>
          I build software end to end: I design the database and its rules, write the API, and make the screens people
          actually use, on the web, on Android, and sometimes on a microcontroller. I like turning a messy manual process
          into something simple and reliable, and I care about the parts nobody sees, like tests, security and what happens
          when things go wrong.
        </p>
        <p>
          I&apos;m looking for a full-stack or applied-AI role where I can keep learning and shipping things people use.
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
          <EmailLink className="link" />
          .
        </p>
      </Block>
    </SiteShell>
  );
}
