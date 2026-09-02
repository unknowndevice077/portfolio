type Language = { name: string; percent: number; color: string };

export default function LanguageBar({ languages }: { languages: Language[] }) {
  if (!languages || languages.length === 0) return null;

  return (
    <div className="mb-5">
      <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-[var(--glass-border)]">
        {languages.map((l) => (
          <div
            key={l.name}
            style={{ width: `${l.percent}%`, background: l.color }}
            title={`${l.name} — ${l.percent}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {languages.map((l) => (
          <span key={l.name} className="flex items-center gap-1.5 text-[11px] text-[var(--text-faint)]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
            {l.name} <span className="mono">{l.percent}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
