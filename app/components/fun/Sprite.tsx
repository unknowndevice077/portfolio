// Tiny pixel-art renderer: each string row is a line of pixels, each char a palette key.
export type Art = { rows: string[]; palette: Record<string, string> };

export default function Sprite({ art, size = 4, flip = false, className, style }: { art: Art; size?: number; flip?: boolean; className?: string; style?: React.CSSProperties }) {
  const w = Math.max(...art.rows.map((r) => r.length));
  const h = art.rows.length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * size}
      height={h * size}
      shapeRendering="crispEdges"
      className={className}
      style={{ ...style, transform: (flip ? "scaleX(-1) " : "") + (style?.transform ?? "") }}
      aria-hidden
    >
      {art.rows.flatMap((row, y) =>
        [...row].map((c, x) => (art.palette[c] ? <rect key={x + "-" + y} x={x} y={y} width={1.02} height={1.02} fill={art.palette[c]} /> : null))
      )}
    </svg>
  );
}

export const SLIME = (body: string, shade: string): Art => ({
  palette: { a: body, b: shade, w: "#ffffff", e: "#17161a" },
  rows: [
    "...aaaa...",
    "..aaaaaa..",
    ".aawaaaaa.",
    ".aaeaaeaa.",
    "aaaaaaaaaa",
    "bbbbbbbbbb",
  ],
});
