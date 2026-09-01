"use client";

type NodeDef = {
  id: string;
  label: string;
  sub: string;
  x: number;
  icon: "webhook" | "code" | "http" | "respond";
};

const nodes: NodeDef[] = [
  { id: "webhook", label: "Webhook", sub: "trigger", x: 40, icon: "webhook" },
  { id: "prompt", label: "Build Prompt", sub: "Code", x: 220, icon: "code" },
  { id: "openai", label: "Call OpenAI", sub: "HTTP Request", x: 400, icon: "http" },
  { id: "parse", label: "Parse Response", sub: "Code", x: 580, icon: "code" },
  { id: "respond", label: "Respond", sub: "Respond to Webhook", x: 760, icon: "respond" },
];

const Y = 70;

function NodeIcon({ type, accent }: { type: NodeDef["icon"]; accent: string }) {
  switch (type) {
    case "webhook":
      return (
        <path
          d="M12 2 L5 13 h5 l-2 9 9-13h-5z"
          fill="none"
          stroke={accent}
          strokeWidth="1.6"
          strokeLinejoin="round"
          transform="translate(4,3) scale(0.7)"
        />
      );
    case "code":
      return (
        <text x="12" y="16" textAnchor="middle" fontSize="13" fill={accent} fontFamily="monospace" fontWeight="700">
          {"{ }"}
        </text>
      );
    case "http":
      return (
        <path
          d="M4 8 h11 M11 4 l4 4-4 4 M20 16 H9 M13 12 l-4 4 4 4"
          fill="none"
          stroke={accent}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case "respond":
      return (
        <path
          d="M4 5 h16 v10 H9 l-4 4 v-4 H4 z"
          fill="none"
          stroke={accent}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      );
  }
}

export default function N8nWorkflowDiagram({ accent }: { accent: string }) {
  return (
    <div className="relative w-full aspect-[16/7] rounded-lg overflow-hidden border border-[#23232f] bg-[#0a0a0f]">
      <div className="flex items-center gap-2 px-3 py-2 bg-[#0f0f16] border-b border-[#23232f]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <span className="mono text-[10px] ml-3 px-2 py-0.5 rounded bg-[#050507]" style={{ color: accent }}>
          n8n — isite / dungeon-master
        </span>
      </div>
      <svg viewBox="0 0 840 160" className="w-full h-[calc(100%-29px)]" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="wf-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill={accent} opacity="0.08" />
          </pattern>
        </defs>
        <rect width="840" height="160" fill="url(#wf-grid)" />

        {/* connections */}
        {nodes.slice(0, -1).map((n, i) => {
          const next = nodes[i + 1];
          const x1 = n.x + 56;
          const x2 = next.x;
          return (
            <g key={n.id}>
              <path
                d={`M${x1},${Y} C${x1 + 40},${Y} ${x2 - 40},${Y} ${x2},${Y}`}
                fill="none"
                stroke={accent}
                strokeOpacity="0.35"
                strokeWidth="1.5"
              />
              <circle r="3" fill={accent}>
                <animateMotion
                  dur="2.4s"
                  begin={`${i * 0.4}s`}
                  repeatCount="indefinite"
                  path={`M${x1},${Y} C${x1 + 40},${Y} ${x2 - 40},${Y} ${x2},${Y}`}
                />
              </circle>
            </g>
          );
        })}

        {/* nodes */}
        {nodes.map((n) => (
          <g key={n.id} transform={`translate(${n.x},${Y - 28})`}>
            <rect
              width="56"
              height="56"
              rx="14"
              fill="#12121a"
              stroke={accent}
              strokeOpacity="0.5"
              strokeWidth="1.5"
            />
            <g transform="translate(16,16)">
              <NodeIcon type={n.icon} accent={accent} />
            </g>
            <text
              x="28"
              y="72"
              textAnchor="middle"
              fontSize="11"
              fill="#e8e8f0"
              fontFamily="ui-sans-serif, sans-serif"
              fontWeight="600"
            >
              {n.label}
            </text>
            <text
              x="28"
              y="86"
              textAnchor="middle"
              fontSize="9"
              fill="#5c5e6b"
              fontFamily="ui-monospace, monospace"
            >
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
