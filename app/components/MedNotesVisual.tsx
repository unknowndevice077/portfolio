// Mock of the MedNotes library screen: a shelf of book covers, one locked.
const BOOKS = [
  ["#0f766e", "Anatomy"],
  ["#1d4ed8", "Physiology"],
  ["#b45309", "Pharma"],
  ["#7c3aed", "Pathology"],
  ["#be123c", "Micro"],
  ["#15803d", "Biochem"],
];

export default function MedNotesVisual() {
  return (
    <div className="w-[640px] h-[400px] bg-[#f3f6fa] text-[#13263f] p-6 font-sans">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <img src="/images/mednotes-logo.png" alt="" className="w-9 h-9" />
          <span className="font-semibold text-lg">MedNotes</span>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-[#dbe7f5] text-[#2c5d93]">2 devices · 1 computer + 1 phone</span>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {BOOKS.map(([c, t], i) => (
          <div key={t}>
            <div className="relative aspect-[3/4] rounded-md shadow-md flex items-end p-2" style={{ background: c }}>
              <span className="text-white text-[11px] font-semibold leading-tight">{t}</span>
              {i === 4 && <span className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-white">LOCKED</span>}
            </div>
            <p className="text-[10px] mt-1.5 text-[#4d5f75]">{i === 4 ? "₱149" : "Owned"}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-lg bg-white border border-[#d6e1ee] p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Receipt #MN-00418 confirmed</p>
          <p className="text-xs text-[#4d5f75]">GCash payment approved by the publisher · file unlocked</p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-md bg-[#3a6ea5] text-white">Open</span>
      </div>
    </div>
  );
}
