"use client";

import { useRef, useState, type ReactNode } from "react";

export default function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateZ(10px)`,
    });
  }

  function onMouseLeave() {
    setStyle({
      transform:
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
    });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ ...style, transition: "transform 0.15s ease-out" }}
      className={className}
    >
      {children}
    </div>
  );
}
