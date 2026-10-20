"use client";

import Link from "next/link";
import { useState } from "react";
import { codeSamples, type CodeSample } from "../data/codeSamples";

const KEYWORDS: Record<CodeSample["language"], string[]> = {
  python: ["def", "class", "return", "if", "elif", "else", "for", "in", "not", "and", "or", "is", "None", "True", "False", "import", "from", "self", "int", "bool", "str", "min", "max", "sum"],
  typescript: ["const", "let", "function", "return", "if", "else", "await", "async", "new", "null", "type", "import", "from", "export", "number", "string", "boolean", "this", "typeof"],
  java: ["public", "private", "final", "static", "return", "if", "new", "throw", "int", "String", "void", "class"],
  sql: ["CONSTRAINT", "CHECK", "IN", "AND", "EXCLUDE", "USING", "WITH", "WHERE", "CREATE", "INDEX", "ON"],
  cpp: ["bool", "return", "if", "for", "const", "constexpr", "uint8_t", "false", "true"],
};

const COMMENT: Record<CodeSample["language"], RegExp> = {
  python: /#.*/,
  typescript: /\/\/.*/,
  java: /\/\/.*/,
  sql: /--.*/,
  cpp: /\/\/.*/,
};

type Tok = { text: string; kind: "plain" | "comment" | "string" | "keyword" | "number" | "annotation" };

// Small line-based highlighter: enough for short excerpts, not a real parser.
function highlight(line: string, lang: CodeSample["language"]): Tok[] {
  const kw = new Set(KEYWORDS[lang]);
  const re = new RegExp(
    [
      COMMENT[lang].source,
      /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/.source,
      /@\w+/.source,
      /\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?(?:e-?\d+)?\b/.source,
      /\b[A-Za-z_]\w*\b/.source,
    ].join("|"),
    "g"
  );
  const out: Tok[] = [];
  let last = 0;
  for (const m of line.matchAll(re)) {
    const t = m[0];
    const i = m.index ?? 0;
    if (i > last) out.push({ text: line.slice(last, i), kind: "plain" });
    let kind: Tok["kind"] = "plain";
    if (new RegExp("^(?:" + COMMENT[lang].source + ")$").test(t)) kind = "comment";
    else if (/^["'`]/.test(t)) kind = "string";
    else if (t.startsWith("@")) kind = "annotation";
    else if (/^\d|^0x/.test(t)) kind = "number";
    else if (kw.has(t)) kind = "keyword";
    out.push({ text: t, kind });
    last = i + t.length;
  }
  if (last < line.length) out.push({ text: line.slice(last), kind: "plain" });
  return out;
}

const COLORS: Record<Tok["kind"], string> = {
  plain: "#d4d8e0",
  comment: "#6b7686",
  string: "#a5d6a7",
  keyword: "#7dd3fc",
  number: "#fbbf24",
  annotation: "#c4b5fd",
};

export default function CodeShowcase() {
  const [active, setActive] = useState(codeSamples[0].id);
  const sample = codeSamples.find((s) => s.id === active) ?? codeSamples[0];

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-5">
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-1 px-1">
        {codeSamples.map((s) => {
          const on = s.id === sample.id;
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`text-left shrink-0 w-60 lg:w-auto rounded-lg px-4 py-3 border transition-colors cursor-pointer ${
                on ? "border-[var(--accent)] bg-[rgba(var(--accent-rgb),0.08)]" : "border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]"
              }`}
            >
              <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                {s.project} · {s.languageLabel}
              </span>
              <span className="block text-sm font-semibold mt-1 leading-snug">{s.title}</span>
            </button>
          );
        })}
      </div>

      <div className="min-w-0">
        <div className="rounded-lg overflow-hidden border border-[#1b212c] bg-[#0a0e14]">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0d1117] border-b border-[#1b212c]">
            <span className="mono text-xs text-[var(--text-dim)] truncate flex-1">{sample.path}</span>
            <span className="mono text-[10px] px-2 py-0.5 rounded border border-[var(--glass-border)] text-[var(--text-faint)] shrink-0">
              {sample.languageLabel}
            </span>
          </div>
          <pre className="text-[12.5px] leading-[1.6] p-4 overflow-x-auto max-h-[440px]" style={{ fontVariantLigatures: "none" }}>
            <code className="mono">
              {sample.code.split("\n").map((line, li) => (
                <div key={li} className="flex">
                  <span className="select-none w-8 shrink-0 text-right pr-4 text-[#3b4452]">{li + 1}</span>
                  <span className="whitespace-pre">
                    {highlight(line, sample.language).map((t, ti) => (
                      <span key={ti} style={{ color: COLORS[t.kind] }}>
                        {t.text}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        </div>
        <p className="text-sm text-[var(--text-dim)] leading-relaxed mt-4">{sample.why}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <a href={sample.url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
            View the full file on GitHub ↗
          </a>
          <Link href={`/projects/${sample.projectSlug}`} className="text-[var(--text-faint)] hover:text-[var(--text)]">
            About {sample.project} →
          </Link>
        </div>
      </div>
    </div>
  );
}
