import { cleanName, gameById } from "../../lib/games";

// Leaderboards live in Upstash Redis (one sorted set per game). Vercel's Upstash
// integration sets KV_REST_API_*, a manual setup uses UPSTASH_REDIS_REST_*.
// With neither set (local dev) scores sit in memory until the server restarts.
const URL_ = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const TOP = 10;

const mem = new Map<string, Map<string, number>>();
const hits = new Map<string, number[]>();

async function redis(cmd: (string | number)[]) {
  const res = await fetch(URL_!, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("redis " + res.status);
  return (await res.json()).result;
}

async function top(id: string, lower: boolean) {
  if (URL_ && TOKEN) {
    const flat: string[] = await redis(["ZRANGE", "lb:" + id, 0, TOP - 1, ...(lower ? [] : ["REV"]), "WITHSCORES"]);
    const out = [];
    for (let i = 0; i < flat.length; i += 2) out.push({ name: flat[i], score: Number(flat[i + 1]) });
    return out;
  }
  const board = [...(mem.get(id) ?? new Map()).entries()].map(([name, score]) => ({ name, score }));
  board.sort((a, b) => (lower ? a.score - b.score : b.score - a.score));
  return board.slice(0, TOP);
}

async function save(id: string, lower: boolean, name: string, score: number) {
  if (URL_ && TOKEN) {
    // GT/LT keeps each name's best instead of overwriting it with a worse run
    await redis(["ZADD", "lb:" + id, lower ? "LT" : "GT", score, name]);
    return;
  }
  const board = mem.get(id) ?? new Map<string, number>();
  const old = board.get(name);
  if (old === undefined || (lower ? score < old : score > old)) board.set(name, score);
  mem.set(id, board);
}

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 12;
}

export async function GET(req: Request) {
  const game = gameById(new URL(req.url).searchParams.get("game") ?? "");
  if (!game) return Response.json({ error: "unknown game" }, { status: 400 });
  try {
    return Response.json({ scores: await top(game.id, !!game.lower) });
  } catch {
    return Response.json({ scores: [], offline: true });
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (limited(ip)) return Response.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const game = gameById(body?.game);
  const name = cleanName(body?.name);
  const score = Number(body?.score);
  if (!game || name.length < 2 || !Number.isInteger(score) || score <= 0 || score > game.max) {
    return Response.json({ error: "bad score" }, { status: 400 });
  }
  try {
    await save(game.id, !!game.lower, name, score);
    return Response.json({ scores: await top(game.id, !!game.lower) });
  } catch {
    return Response.json({ error: "leaderboard is offline" }, { status: 503 });
  }
}
