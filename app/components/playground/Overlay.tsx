// The click-to-start / game-over cover every game uses.
export default function Overlay({ title, sub, onClick }: { title: string; sub: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 rounded-lg backdrop-blur-[1px] text-white cursor-pointer z-10"
    >
      <span className="font-display text-2xl">{title}</span>
      <span className="text-sm">{sub}</span>
    </button>
  );
}
