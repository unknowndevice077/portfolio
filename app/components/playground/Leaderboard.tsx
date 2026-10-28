"use client";

import { useEffect, useState } from "react";
import { cleanName, type GameInfo } from "../../lib/games";
import { readName, saveName, useBest } from "./scores";

type Row = { name: string; score: number };

// `last` is the score of the run that just ended (0 = nothing to submit yet).
export default function Leaderboard({ game, last }: { game: GameInfo; last: number }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [offline, setOffline] = useState(false);
  const [name, setName] = useState("");
  const [sent, setSent] = useState(0);
  const [err, setErr] = useState("");
  const [best] = useBest(game.id, game.lower);

  useEffect(() => {
    let alive = true;
    fetch("/api/scores?game=" + game.id)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setRows(d.scores ?? []);
        setOffline(!!d.offline);
      })
      .catch(() => alive && (setRows([]), setOffline(true)));
    return () => {
      alive = false;
    };
  }, [game.id]);

  const fmt = (n: number) => n.toLocaleString() + " " + game.unit;
  const qualifies =
    last > 0 &&
    sent !== last &&
    (!rows || rows.length < 10 || (game.lower ? last < rows[rows.length - 1].score : last > rows[rows.length - 1].score));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = cleanName(name || readName());
    if (n.length < 2) return setErr("Name needs 2+ letters");
    setErr("");
    saveName(n);
    const r = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game: game.id, name: n, score: last }),
    }).catch(() => null);
    const d = await r?.json().catch(() => null);
    if (!r?.ok) return setErr(d?.error ?? "Couldn't reach the leaderboard");
    setRows(d.scores);
    setSent(last);
  }

  return (
    <div className="w-full xl:border-l xl:border-[var(--border)] xl:pl-8">
      <div className="flex items-baseline justify-between mb-3">
        <p className="label">Leaderboard</p>
        <span className="text-xs text-[var(--text-faint)]">
          {game.lower ? "lowest wins" : "top 10"}
        </span>
      </div>

      {qualifies && (
        <form onSubmit={submit} className="mb-5 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] p-3 space-y-2">
          <p className="text-sm">
            You scored <b>{fmt(last)}</b>. That makes the board!
          </p>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={readName() || "Your name"}
              maxLength={14}
              aria-label="Your name"
              className="flex-1 min-w-0 rounded-md bg-transparent border border-[var(--border)] px-3 py-1.5 text-sm outline-none focus:border-[var(--text)]"
            />
            <button className="px-3 py-1.5 rounded-md text-sm font-medium bg-[var(--text)] text-[var(--bg)] cursor-pointer">
              Save
            </button>
          </div>
          {err && <p className="text-xs text-[#f43f5e]">{err}</p>}
        </form>
      )}

      {rows === null ? (
        <p className="text-sm text-[var(--text-faint)]">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-[var(--text-faint)]">{offline ? "Leaderboard is offline right now." : "No scores yet. Be the first."}</p>
      ) : (
        <ol className="space-y-1">
          {rows.map((r, i) => (
            <li key={r.name} className="flex items-center gap-3 text-sm py-1 border-b border-[var(--border)] last:border-0">
              <span className="mono w-6 text-[var(--text-faint)]">{i + 1}</span>
              <span className="flex-1 truncate">{r.name}</span>
              <span className="mono text-[var(--text-dim)]">{fmt(r.score)}</span>
            </li>
          ))}
        </ol>
      )}

      <p className="text-xs text-[var(--text-faint)] mt-4">your best: {best ? fmt(best) : "—"}</p>
    </div>
  );
}
