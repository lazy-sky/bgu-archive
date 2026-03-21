/**
 * src/data/games.json → Supabase SQL Editor용 INSERT 스크립트
 *
 * 실행: pnpm games:sql
 * 출력: supabase/sql/seed_games.sql
 *
 * 전제: 스키마 마이그레이션 적용됨, 시드 회원(김하늘 제외) 프로필이 존재
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  mulberry32,
  SEED_ADDED_BY_DISPLAY_NAMES,
} from "./seed-members-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const gamesPath = path.join(root, "src/data/games.json");
const outPath = path.join(root, "supabase/sql/seed_games.sql");

/** DB text (nullable) */
function sqlLiteral(s) {
  if (s == null || s === "") return "NULL";
  return `'${String(s).replace(/'/g, "''")}'`;
}

/** notes / extra_notes 는 NOT NULL */
function sqlTextNotEmpty(s) {
  if (s == null || s === "") return "''";
  return `'${String(s).replace(/'/g, "''")}'`;
}

function sqlInt(n) {
  if (n == null || n === "") return "NULL";
  const x = Number(n);
  return Number.isNaN(x) ? "NULL" : String(Math.trunc(x));
}

function addedBySubquery(i) {
  const next = mulberry32((i * 0x9e3779b9 + 0xbeef) >>> 0);
  const idx = Math.floor(next() * SEED_ADDED_BY_DISPLAY_NAMES.length);
  const name = SEED_ADDED_BY_DISPLAY_NAMES[idx];
  return `(SELECT id FROM public.profiles WHERE display_name = ${sqlLiteral(name)} LIMIT 1)`;
}

function mapRow(g, i) {
  const raw =
    g.maxPlayersRaw == null ? "NULL" : sqlLiteral(String(g.maxPlayersRaw));
  const val =
    g.maxPlayers == null || g.maxPlayers === ""
      ? "NULL"
      : sqlLiteral(String(g.maxPlayers));

  return `  (${sqlLiteral(g.name)}, ${sqlInt(g.difficulty)}, ${sqlTextNotEmpty(g.genre)}, ${raw}, ${sqlLiteral(g.maxPlayersKind)}, ${val}, ${g.beginnerFriendly ? "true" : "false"}, ${sqlTextNotEmpty(g.notes)}, ${sqlTextNotEmpty(g.extraNotes)}, ${addedBySubquery(i)})`;
}

function main() {
  if (!fs.existsSync(gamesPath)) {
    console.error("없음:", gamesPath);
    process.exit(1);
  }

  const games = JSON.parse(fs.readFileSync(gamesPath, "utf8"));
  const lines = games.map((g, i) => mapRow(g, i));

  const sql = `/*
 * games 테이블 시드 (games.json 기준)
 * Supabase → SQL Editor 에 붙여넣고 Run
 *
 * 주의: 기존 games 행을 지웁니다. added_by 는 김하늘을 제외한 시드 회원(display_name) 중
 * games.json 순번마다 결정적으로 골라 지정합니다 (seed-supabase.mjs 와 동일 규칙).
 */

DELETE FROM public.games;

INSERT INTO public.games (
  name,
  difficulty,
  genre,
  max_players_raw,
  max_players_kind,
  max_players_value,
  beginner_friendly,
  notes,
  extra_notes,
  added_by
)
VALUES
${lines.join(",\n")};
`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, sql, "utf8");
  console.log(`작성: ${outPath} (${games.length}건)`);
}

main();
