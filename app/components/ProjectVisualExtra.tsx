import { Frame } from "./ProjectVisual";

export function QueueUpVisual() {
  const slots = [
    { t: "9:00", who: "Ana R.", svc: "Cleaning", s: "done" },
    { t: "9:30", who: "Walk-in #14", svc: "Checkup", s: "now" },
    { t: "10:00", who: "Ben T.", svc: "Filling", s: "next" },
    { t: "10:30", who: "Carla M.", svc: "Braces adj.", s: "next" },
  ];
  return (
    <Frame url="queueup · /b/sanare-dental" accent="#60a5fa">
      <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="220" fill="#0b1220" />
        {/* Now Serving TV board */}
        <rect x="16" y="16" width="150" height="188" rx="8" fill="#0f1a2e" stroke="#1e3a5f" />
        <text x="91" y="40" textAnchor="middle" fontSize="9" fill="#93c5fd" fontFamily="monospace" letterSpacing="2">
          NOW SERVING
        </text>
        <text x="91" y="98" textAnchor="middle" fontSize="44" fill="#60a5fa" fontFamily="sans-serif" fontWeight="800">
          A14
          <animate attributeName="opacity" values="1;0.55;1" dur="2.4s" repeatCount="indefinite" />
        </text>
        <text x="91" y="118" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">
          Counter 2
        </text>
        <line x1="32" y1="134" x2="150" y2="134" stroke="#1e3a5f" />
        <text x="32" y="152" fontSize="8" fill="#64748b" fontFamily="monospace">NEXT</text>
        {["A15", "A16", "A17"].map((n, i) => (
          <text key={n} x={32 + i * 40} y="174" fontSize="14" fill="#cbd5e1" fontFamily="sans-serif" fontWeight="700">
            {n}
          </text>
        ))}
        {/* today's bookings */}
        <text x="184" y="30" fontSize="10" fill="#e2e8f0" fontFamily="sans-serif" fontWeight="700">
          Today · Sanare Dental
        </text>
        {slots.map((r, i) => (
          <g key={r.t} transform={"translate(184," + (42 + i * 34) + ")"}>
            <rect width="200" height="28" rx="5" fill={r.s === "now" ? "#1e3a5f" : "#0f1a2e"} stroke="#1e3a5f" />
            <text x="8" y="17" fontSize="8" fill="#93c5fd" fontFamily="monospace">{r.t}</text>
            <text x="42" y="17" fontSize="9" fill="#e2e8f0" fontFamily="sans-serif">{r.who}</text>
            <text x="120" y="17" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">{r.svc}</text>
            <circle cx="188" cy="14" r="3.5" fill={r.s === "done" ? "#34d399" : r.s === "now" ? "#60a5fa" : "#475569"} />
          </g>
        ))}
        <text x="184" y="194" fontSize="7" fill="#64748b" fontFamily="monospace">
          20% deposit via GCash · no double booking
        </text>
      </svg>
    </Frame>
  );
}

export function BantayBahaVisual() {
  return (
    <Frame url="embeddedbantaybaha.vercel.app" accent="#38bdf8">
      <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="220" fill="#0a1424" />
        {/* creek banks and rising water */}
        <path d="M0,120 L120,120 L150,200 L250,200 L280,120 L400,120 L400,220 L0,220 Z" fill="#14233a" />
        <rect x="140" y="150" width="120" height="70" fill="#38bdf8" opacity="0.35">
          <animate attributeName="y" values="175;140;175" dur="6s" repeatCount="indefinite" />
        </rect>
        {/* smart pole with the ultrasonic sensor */}
        <line x1="290" y1="40" x2="290" y2="125" stroke="#94a3b8" strokeWidth="3" />
        <rect x="282" y="32" width="26" height="10" fill="#1e293b" stroke="#38bdf8" />
        <line x1="300" y1="42" x2="230" y2="150" stroke="#38bdf8" strokeDasharray="3 3" opacity="0.7" />
        <text x="314" y="40" fontSize="7" fill="#7dd3fc" fontFamily="monospace">ESP32 · ultrasonic</text>
        <text x="16" y="24" fontSize="9" fill="#7dd3fc" fontFamily="monospace">CREEK LEVEL</text>
        <text x="16" y="48" fontSize="22" fill="#e2e8f0" fontFamily="sans-serif" fontWeight="800">262 cm</text>
        <rect x="16" y="58" width="92" height="16" rx="3" fill="#f59e0b" />
        <text x="62" y="69" textAnchor="middle" fontSize="8" fill="#0a1424" fontFamily="sans-serif" fontWeight="700">ADVISORY</text>
        <text x="16" y="92" fontSize="8" fill="#94a3b8" fontFamily="monospace">Forecast: WARNING in ~18 min</text>
      </svg>
    </Frame>
  );
}

export function JaemboyVisual() {
  // Two 128x64 OLEDs: the left one shows the HUD, the right one the raycaster.
  const walls = [44, 36, 30, 26, 24, 26, 30, 36, 44];
  return (
    <Frame url="esp32 · 192.168.4.1" accent="#e879f9">
      <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="220" fill="#120a14" />
        <rect x="20" y="30" width="360" height="130" rx="18" fill="#1f1424" stroke="#3b2442" />
        <rect x="40" y="52" width="140" height="78" fill="#000" stroke="#4a2e52" />
        <text x="48" y="70" fontSize="9" fill="#7fd4ff" fontFamily="monospace">DOOM  L2</text>
        <text x="48" y="86" fontSize="8" fill="#7fd4ff" fontFamily="monospace">HP 87  AMMO 24</text>
        <text x="48" y="100" fontSize="8" fill="#7fd4ff" fontFamily="monospace">SCORE 1350</text>
        <text x="48" y="118" fontSize="7" fill="#7fd4ff" fontFamily="monospace" opacity="0.7">pad: connected</text>
        <rect x="220" y="52" width="140" height="78" fill="#000" stroke="#4a2e52" />
        {walls.map((h, i) => (
          <rect key={i} x={222 + i * 15.2} y={91 - h / 2} width="15.2" height={h} fill="#7fd4ff" opacity={0.35 + (44 - h) / 60} />
        ))}
        <path d="M282,128 L290,108 L298,128 Z" fill="#7fd4ff">
          <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
        </path>
        <rect x="120" y="176" width="160" height="34" rx="8" fill="#1f1424" stroke="#e879f9" strokeOpacity="0.5" />
        <path d="M150,187 h8 v-6 h6 v6 h8 v6 h-8 v6 h-6 v-6 h-8 z" fill="#e879f9" opacity="0.8" />
        <circle cx="236" cy="193" r="7" fill="#e879f9" opacity="0.8" />
        <circle cx="256" cy="187" r="7" fill="#e879f9" opacity="0.5" />
        <text x="200" y="171" textAnchor="middle" fontSize="7" fill="#c084fc" fontFamily="monospace">phone = Wi-Fi WebSocket gamepad</text>
      </svg>
    </Frame>
  );
}

export function LeadCatchVisual() {
  const steps = ["Missed call", "Which client?", "Opted out?", "Texted < 30 min?", "Send text-back", "Log + alert owner"];
  return (
    <Frame url="n8n · Missed Call Text-Back" accent="#f97316">
      <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="lc-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#f97316" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="400" height="220" fill="#140d08" />
        <rect width="400" height="220" fill="url(#lc-dots)" />
        {steps.map((s, i) => {
          const x = 20 + (i % 3) * 126;
          const y = i < 3 ? 40 : 120;
          return (
            <g key={s} transform={"translate(" + x + "," + y + ")"}>
              <rect width="108" height="40" rx="8" fill="#1f140b" stroke="#f97316" strokeOpacity={i === 4 ? 1 : 0.5} />
              <text x="54" y="24" textAnchor="middle" fontSize="9" fill="#fed7aa" fontFamily="sans-serif">{s}</text>
            </g>
          );
        })}
        <path d="M128,60 h18 M254,60 h18 M326,80 v30 H74 v10 M128,140 h18 M254,140 h18" fill="none" stroke="#f97316" strokeOpacity="0.6" strokeWidth="1.5" />
        <circle r="3" fill="#f97316">
          <animateMotion dur="5s" repeatCount="indefinite" path="M74,60 H326 V110 H74 V140 H326" />
        </circle>
        <text x="20" y="196" fontSize="8" fill="#fdba74" fontFamily="monospace">
          &quot;Sorry we missed your call! Reply here and we&apos;ll get right back to you.&quot;
        </text>
      </svg>
    </Frame>
  );
}
