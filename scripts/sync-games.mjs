/**
 * games.json → Supabase games 테이블 전체 교체
 * added_by: 기본 김하늘, 이름이 「딥씨 크루」인 행만 null (seed-supabase.mjs 와 동일)
 *
 * 필요: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * 전제: 김하늘 프로필이 있어야 함
 *
 * 실행: pnpm sync-games
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isGameAddedByExcludedFromKim } from "./seed-members-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

dotenv.config({ path: path.join(root, ".env.local") });
dotenv.config();

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL와 SUPABASE_SERVICE_ROLE_KEY가 필요합니다.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function minPlayersFromJson(g) {
  if (g.minPlayers == null || g.minPlayers === "") return null;
  const n = Number(g.minPlayers);
  if (!Number.isFinite(n) || n < 1) return null;
  return Math.floor(n);
}

function mapJsonGame(g, addedBy) {
  const rawStr =
    g.maxPlayersRaw == null ? "" : String(g.maxPlayersRaw);
  const val =
    g.maxPlayers == null || g.maxPlayers === ""
      ? null
      : String(g.maxPlayers);

  return {
    name: g.name,
    difficulty: g.difficulty,
    genre: g.genre ?? "",
    min_players: minPlayersFromJson(g),
    max_players_raw: rawStr || null,
    max_players_kind: g.maxPlayersKind,
    max_players_value: val,
    beginner_friendly: Boolean(g.beginnerFriendly),
    notes: g.notes ?? "",
    extra_notes: g.extraNotes ?? "",
    added_by: addedBy,
  };
}

async function findUserIdByEmail(email) {
  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw error;
    const u = data.users.find((x) => x.email === email);
    if (u) return u.id;
    if (data.users.length < perPage) break;
    page += 1;
  }
  return null;
}

async function main() {
  const kimId = await findUserIdByEmail("kim.haneul@bgu.local");
  if (!kimId) {
    throw new Error(
      "김하늘(kim.haneul@bgu.local) 계정이 없습니다. 먼저 pnpm seed 를 실행하세요.",
    );
  }

  const gamesPath = path.join(root, "src/data/games.json");
  if (!fs.existsSync(gamesPath)) {
    console.error("없음:", gamesPath);
    process.exit(1);
  }

  const games = JSON.parse(fs.readFileSync(gamesPath, "utf8"));
  const rows = games.map((g) =>
    mapJsonGame(
      g,
      isGameAddedByExcludedFromKim(g.name) ? null : kimId,
    ),
  );

  console.log(
    `games 테이블 비우기 후 ${rows.length}건 삽입 (추가자: 김하늘, 딥씨 크루만 null)…`,
  );

  const { error: delErr } = await supabase
    .from("games")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) throw delErr;

  const { error: insErr } = await supabase.from("games").insert(rows);
  if (insErr) throw insErr;

  console.log("완료.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
