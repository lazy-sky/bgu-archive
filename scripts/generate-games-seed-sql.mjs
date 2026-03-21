/**
 * src/data/games.json → Supabase SQL Editor용 INSERT 스크립트
 *
 * 실행: pnpm games:sql
 * 출력: supabase/sql/seed_games.sql
 *
 * 전제: 스키마 마이그레이션 적용됨, 김하늘 프로필 존재
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isGameAddedByExcludedFromKim } from "./seed-members-data.mjs";

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

function addedByExpression(g) {
  if (isGameAddedByExcludedFromKim(g.name)) {
    return "NULL";
  }
  return `(SELECT id FROM public.profiles WHERE display_name = '김하늘' LIMIT 1)`;
}

function minPlayersFromJson(g) {
  if (g.minPlayers == null || g.minPlayers === "") return null;
  const n = Number(g.minPlayers);
  if (!Number.isFinite(n) || n < 1) return null;
  return Math.floor(n);
}

function mapRow(g) {
  const raw =
    g.maxPlayersRaw == null ? "NULL" : sqlLiteral(String(g.maxPlayersRaw));
  const val =
    g.maxPlayers == null || g.maxPlayers === ""
      ? "NULL"
      : sqlLiteral(String(g.maxPlayers));

  return `  (${sqlLiteral(g.name)}, ${sqlInt(g.difficulty)}, ${sqlTextNotEmpty(g.genre)}, ${sqlInt(minPlayersFromJson(g))}, ${raw}, ${sqlLiteral(g.maxPlayersKind)}, ${val}, ${g.beginnerFriendly ? "true" : "false"}, ${sqlTextNotEmpty(g.notes)}, ${sqlTextNotEmpty(g.extraNotes)}, ${addedByExpression(g)})`;
}

function main() {
  if (!fs.existsSync(gamesPath)) {
    console.error("없음:", gamesPath);
    process.exit(1);
  }

  const games = JSON.parse(fs.readFileSync(gamesPath, "utf8"));
  const lines = games.map((g) => mapRow(g));

  const sql = `/*
 * games 테이블 시드 (games.json 기준)
 * Supabase → SQL Editor 에 붙여넣고 Run
 *
 * 주의: 기존 games 행을 지웁니다. added_by 는 기본 김하늘, 이름이 「딥씨 크루」인 행만 NULL.
 */

DELETE FROM public.games;

INSERT INTO public.games (
  name,
  difficulty,
  genre,
  min_players,
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
