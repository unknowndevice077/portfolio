function Frame({
  url,
  accent,
  children,
}: {
  url: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#23232f] bg-[#0a0a0f]">
      {/* browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#0f0f16] border-b border-[#23232f]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <span
          className="mono text-[10px] ml-3 px-2 py-0.5 rounded bg-[#050507] truncate"
          style={{ color: accent }}
        >
          {url}
        </span>
      </div>
      <div className="relative w-full h-[calc(100%-29px)]">{children}</div>
    </div>
  );
}

export function EcoVisionVisual() {
  return (
    <Frame url="ecovision-crime-detection-ai.app" accent="#8fd400">
      <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="eco-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d0006" />
            <stop offset="100%" stopColor="#160013" />
          </linearGradient>
          <pattern id="eco-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 L0 0 0 20" fill="none" stroke="#8fd400" strokeOpacity="0.12" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="220" fill="url(#eco-bg)" />
        <rect width="400" height="220" fill="url(#eco-grid)" />
        {/* CCTV feed panels */}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${16 + i * 132}, 16)`}>
            <rect width="120" height="90" fill="#000" stroke="#8fd400" strokeOpacity="0.5" />
            <circle cx="8" cy="8" r="3" fill="#ff2f2f">
              <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <text x="60" y="50" textAnchor="middle" fontSize="9" fill="#8fd400" fontFamily="monospace" opacity="0.5">
              CAM {i + 1}
            </text>
          </g>
        ))}
        {/* target reticle */}
        <g transform="translate(148,90)">
          <circle r="26" fill="none" stroke="#5eead4" strokeWidth="1.5">
            <animate attributeName="r" values="20;28;20" dur="2s" repeatCount="indefinite" />
          </circle>
          <line x1="-34" y1="0" x2="-18" y2="0" stroke="#5eead4" strokeWidth="1.5" />
          <line x1="18" y1="0" x2="34" y2="0" stroke="#5eead4" strokeWidth="1.5" />
          <line x1="0" y1="-34" x2="0" y2="-18" stroke="#5eead4" strokeWidth="1.5" />
          <line x1="0" y1="18" x2="0" y2="34" stroke="#5eead4" strokeWidth="1.5" />
        </g>
        {/* HUD text */}
        <text x="16" y="145" fontSize="10" fill="#5eead4" fontFamily="monospace">
          THREAT: WEAPON DETECTED
        </text>
        <text x="16" y="160" fontSize="10" fill="#8fd400" fontFamily="monospace">
          mAP@50: 94.1%  RECALL: 90.3%
        </text>
        <rect x="16" y="175" width="200" height="6" fill="#1a0010" />
        <rect x="16" y="175" width="188" height="6" fill="#8fd400" />
        <text x="16" y="205" fontSize="9" fill="#7a7a8a" fontFamily="monospace">
          YOLOv11 · X3D-XS · role-based alert review
        </text>
      </svg>
    </Frame>
  );
}

export function StudiaVisual() {
  return (
    <Frame url="studia.app/home" accent="#5eead4">
      <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="220" fill="#f7f7f9" />
        <text x="16" y="26" fontSize="13" fill="#111" fontFamily="sans-serif" fontWeight="700">
          Good Morning
        </text>
        <text x="16" y="40" fontSize="9" fill="#888" fontFamily="sans-serif">
          jae.dev
        </text>
        {[
          { x: 16, label: "Study Time", val: "2h 40m", color: "#00c2b8" },
          { x: 112, label: "Classes", val: "5", color: "#4caf7d" },
          { x: 208, label: "Exams", val: "2", color: "#e0506b" },
          { x: 304, label: "Deadlines", val: "3", color: "#e0a020" },
        ].map((c) => (
          <g key={c.label} transform={`translate(${c.x},54)`}>
            <rect width="80" height="56" rx="8" fill="#fff" stroke="#e7e7ec" />
            <text x="8" y="18" fontSize="7" fill="#999" fontFamily="sans-serif">
              {c.label}
            </text>
            <text x="8" y="40" fontSize="15" fill="#111" fontFamily="sans-serif" fontWeight="700">
              {c.val}
            </text>
            <circle cx="66" cy="16" r="7" fill={c.color} opacity="0.15" />
            <circle cx="66" cy="16" r="3" fill={c.color} />
          </g>
        ))}
        <text x="16" y="140" fontSize="12" fill="#111" fontFamily="serif" fontWeight="700">
          Today&apos;s Classes
        </text>
        {["31", "1", "2", "3", "4", "5", "6"].map((d, i) => (
          <g key={d} transform={`translate(${16 + i * 44},150)`}>
            <rect
              width="36"
              height="36"
              rx="8"
              fill={i === 2 ? "#5eead4" : "#fff"}
              stroke={i === 2 ? "#5eead4" : "#e7e7ec"}
            />
            <text x="18" y="22" textAnchor="middle" fontSize="11" fill={i === 2 ? "#000" : "#111"} fontFamily="sans-serif">
              {d}
            </text>
          </g>
        ))}
      </svg>
    </Frame>
  );
}

export function QuestScribeVisual() {
  return (
    <Frame url="isite.app/adventure" accent="#fbbf24">
      <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="qs-bg" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#1a1408" />
            <stop offset="100%" stopColor="#0a0805" />
          </radialGradient>
        </defs>
        <rect width="400" height="220" fill="url(#qs-bg)" />
        {/* path connecting regions */}
        <path
          d="M40,170 Q100,100 180,120 T340,50"
          fill="none"
          stroke="#fbbf24"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        {[
          { x: 40, y: 170, r: 16, label: "Photosynthesis Grove" },
          { x: 180, y: 120, r: 20, label: "Cell Citadel" },
          { x: 300, y: 90, r: 14, label: "Genome Ruins" },
          { x: 340, y: 50, r: 18, label: "Evolution Peak" },
        ].map((n) => (
          <g key={n.label} transform={`translate(${n.x},${n.y})`}>
            <circle r={n.r} fill="#fbbf24" opacity="0.12" />
            <circle r={n.r * 0.5} fill="#fbbf24" opacity="0.6">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        <text x="16" y="20" fontSize="10" fill="#fbbf24" fontFamily="serif" fontStyle="italic">
          &quot;The Dungeon Master awaits your answer...&quot;
        </text>
        <rect x="16" y="190" width="160" height="8" rx="4" fill="#241f10" />
        <rect x="16" y="190" width="112" height="8" rx="4" fill="#fbbf24" />
        <text x="182" y="197" fontSize="9" fill="#fbbf24" fontFamily="monospace">
          XP 1120 / 1600
        </text>
      </svg>
    </Frame>
  );
}

export function AurumVisual() {
  const candles = [
    [40, 20, 1], [60, 35, -1], [80, 15, 1], [100, 50, -1], [120, 25, 1],
    [140, 60, 1], [160, 30, -1], [180, 45, 1], [200, 20, 1], [220, 55, -1],
    [240, 28, 1], [260, 40, 1], [280, 18, 1], [300, 48, -1], [320, 32, 1],
  ];
  return (
    <Frame url="aurum-xauusd-auto-trader.app" accent="#5eead4">
      <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="220" fill="#050a08" />
        <g stroke="#12241e" strokeWidth="1">
          {[40, 80, 120, 160].map((y) => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} />
          ))}
        </g>
        {candles.map(([x, h, dir], i) => (
          <g key={i} transform={`translate(${x},${110 - h / 2})`}>
            <line x1="0" y1={-h / 2 - 8} x2="0" y2={h / 2 + 8} stroke={dir > 0 ? "#34d399" : "#ff3b5c"} strokeWidth="1" />
            <rect
              x="-5"
              y={-h / 2}
              width="10"
              height={h}
              fill={dir > 0 ? "#34d399" : "#ff3b5c"}
              opacity="0.85"
            />
          </g>
        ))}
        <path
          d="M40,100 L60,115 80,92 100,130 120,88 140,140 160,95 180,110 200,80 220,135 240,90 260,105 280,75 300,120 320,85"
          fill="none"
          stroke="#5eead4"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <text x="16" y="20" fontSize="11" fill="#5eead4" fontFamily="monospace">
          XAU/USD
        </text>
        <text x="16" y="34" fontSize="14" fill="#34d399" fontFamily="monospace" fontWeight="700">
          $2,418.62 ▲ 0.84%
        </text>
        <text x="300" y="20" fontSize="8" fill="#7a7a8a" fontFamily="monospace">
          EMA · RSI · MACD
        </text>
        <text x="16" y="200" fontSize="8" fill="#7a7a8a" fontFamily="monospace">
          Kelly-sized · backtest drawdown -4.2%
        </text>
      </svg>
    </Frame>
  );
}

export function NotionAIVisual() {
  return (
    <Frame url="notion-ai-assistant.app" accent="#a78bfa">
      <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="220" fill="#0c0a12" />
        {/* chat bubble in */}
        <rect x="16" y="16" width="220" height="34" rx="8" fill="#a78bfa" opacity="0.15" />
        <text x="26" y="37" fontSize="9" fill="#d8b4fe" fontFamily="monospace">
          &gt; &quot;organize my launch week tasks&quot;
        </text>
        {/* arrow */}
        <path d="M120,58 L120,76" stroke="#a78bfa" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#a78bfa" />
          </marker>
        </defs>
        {/* generated notion blocks */}
        {["Design review", "Ship landing page", "Notify beta users"].map((t, i) => (
          <g key={t} transform={`translate(16,${90 + i * 34})`}>
            <rect width="14" height="14" rx="3" fill="none" stroke="#a78bfa" />
            {i === 0 && <path d="M3,7 L6,10 L11,4" stroke="#a78bfa" strokeWidth="1.5" fill="none" />}
            <text x="22" y="11" fontSize="10" fill="#e8e8f0" fontFamily="sans-serif">
              {t}
            </text>
          </g>
        ))}
        <text x="16" y="200" fontSize="8" fill="#7a7a8a" fontFamily="monospace">
          Rust · Tauri 2 · local Ollama · no cloud required
        </text>
      </svg>
    </Frame>
  );
}
