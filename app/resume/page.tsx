import type { Metadata } from "next";
import Image from "next/image";
import SiteShell from "../components/SiteShell";

export const metadata: Metadata = { title: "Resume — Fritz Dela Cruz" };

// Shown as an image of the PDF page: phone browsers can't render an embedded PDF,
// and it reads like a page on the site instead of a file download.
export default function ResumePage() {
  return (
    <SiteShell>
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
        <h1 className="font-display text-[40px] sm:text-[48px] leading-[1.05]">Resume</h1>
        <a href="mailto:frjhay.delacruz@gmail.com" className="link text-[15px]">
          frjhay.delacruz@gmail.com
        </a>
      </div>
      <div className="rounded-sm overflow-hidden border border-[var(--border)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.06)]">
        <Image
          src="/resume/resume.png"
          alt="Resume of Fritz Rjhay L. Dela Cruz"
          width={1700}
          height={2200}
          sizes="(min-width: 1024px) 760px, 100vw"
          className="w-full h-auto"
          priority
        />
      </div>
    </SiteShell>
  );
}
