import type { Metadata } from "next";
import Image from "next/image";
import SiteShell, { PageHeading } from "../components/SiteShell";

export const metadata: Metadata = { title: "Resume — Fritz Dela Cruz" };

// The resume is shown as an image of the PDF page: phone browsers can't render an embedded PDF,
// and it reads like a page on the site instead of a file download.
const links = [
  ["GitHub", "https://github.com/unknowndevice077"],
  ["LinkedIn", "https://www.linkedin.com/in/fritz-rjhay-dela-cruz-9b604737b/"],
  ["EcoVision", "https://github.com/unknowndevice077/ecovision-crime-detection-ai"],
  ["Bantay Baha", "https://github.com/unknowndevice077/bantay-baha"],
  ["QueueUp", "https://github.com/unknowndevice077/queueup"],
  ["jaemboy", "https://github.com/unknowndevice077/jaemboy"],
  ["Clash Games", "https://github.com/unknowndevice077/copycatclash"],
  ["Notion AI Assistant", "https://github.com/unknowndevice077/notion-ai-assistant"],
];

export default function ResumePage() {
  return (
    <SiteShell>
      <PageHeading title="Resume" />
      <div className="grid lg:grid-cols-[1fr_240px] gap-8 items-start pb-6">
        <div className="rounded-lg overflow-hidden shadow-2xl border border-[var(--border)] bg-white max-w-[850px] w-full mx-auto lg:mx-0">
          <Image
            src="/resume/resume.png"
            alt="Resume of Fritz Rjhay L. Dela Cruz"
            width={1700}
            height={2200}
            sizes="(min-width: 1024px) 850px, 100vw"
            className="w-full h-auto"
            priority
          />
        </div>
        <aside className="lg:sticky lg:top-24 space-y-4">
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Links from the resume</p>
          <ul className="space-y-2 text-sm">
            {links.map(([label, url]) => (
              <li key={label}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
                  {label} ↗
                </a>
              </li>
            ))}
            <li>
              <a href="mailto:frjhay.delacruz@gmail.com" className="text-[var(--accent)] hover:underline">
                frjhay.delacruz@gmail.com
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </SiteShell>
  );
}
