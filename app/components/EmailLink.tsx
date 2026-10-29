"use client";

import { useState } from "react";

export const EMAIL = "frjhay.delacruz@gmail.com";

// mailto does nothing on machines without a mail app, so copy the address too.
export default function EmailLink({ className, children }: { className?: string; children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  return (
    <a
      href={"mailto:" + EMAIL}
      onClick={() => {
        navigator.clipboard?.writeText(EMAIL).then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          },
          () => {}
        );
      }}
      className={className}
      title="Opens your mail app and copies the address"
    >
      {copied ? "Copied!" : children ?? EMAIL}
    </a>
  );
}
