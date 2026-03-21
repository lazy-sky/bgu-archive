import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const xlsxPath = process.argv[2];
const outPath =
  process.argv[3] ??
  path.join(process.cwd(), "src/data/games.json");

if (!xlsxPath) {
  console.error("Usage: node scripts/import-games.mjs <path-to.xlsx> [out.json]");
  process.exit(1);
}

function parseMaxPlayers(val) {
  if (val === null || val === undefined || val === "") {
    return { kind: "unknown", value: null };
  }
  if (typeof val === "number") {
    return Number.isInteger(val) ? { kind: "number", value: val } : { kind: "number", value: val };
  }
  const s = String(val).trim();
  if (s === "--" || s === "-" || s === "?") {
    return { kind: "unknown", value: null };
  }
  const m = s.match(/^(\d+)\s*이상$/);
  if (m) {
    return { kind: "min_plus", value: Number(m[1]) };
  }
  const n = Number(String(s).replace(",", ""));
  if (!Number.isNaN(n)) {
    return { kind: "number", value: n };
  }
  return { kind: "text", value: s };
}

const wb = XLSX.readFile(xlsxPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

const games = [];
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (!r || !r[0]) continue;
  const name = String(r[0]).trim();
  if (!name) continue;

  const diff = r[1];
  const genre = r[2] != null ? String(r[2]).trim() : "";
  const maxRaw = r[3];
  let beginner = r[4];
  if (beginner === null || beginner === undefined) beginner = false;
  const notes = r[5] != null ? String(r[5]).trim() : "";
  const extra = r[6] != null ? String(r[6]).trim() : "";

  const parsed = parseMaxPlayers(maxRaw);

  games.push({
    id: games.length + 1,
    name,
    difficulty: diff != null ? Number(diff) : null,
    genre,
    maxPlayersRaw: maxRaw,
    maxPlayersKind: parsed.kind,
    maxPlayers: parsed.value,
    beginnerFriendly: Boolean(beginner),
    notes,
    extraNotes: extra,
  });
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(games, null, 2), "utf8");
console.log(`Wrote ${games.length} games to ${outPath}`);
