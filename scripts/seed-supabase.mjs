/**
 * 서비스 롤로 시드: 회원(auth + profiles) + games.json 전체
 * games added_by: 기본 김하늘, `딥씨 크루`만 예외(null — 운영에서 지정 가능)
 *
 * 필요: SUPABASE_URL(또는 NEXT_PUBLIC_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY
 * 선택: SEED_PASSWORD (기본 bgu-dev-2025), FORCE=1 이면 games 전체 삭제 후 재삽입
 *
 * 실행: pnpm seed
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildSeedUsers,
  isGameAddedByExcludedFromKim,
} from "./seed-members-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

dotenv.config({ path: path.join(root, ".env.local") });
dotenv.config();

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const seedPassword = process.env.SEED_PASSWORD ?? "bgu-dev-2025";

if (!url || !serviceKey) {
  console.error(
    "SUPABASE_URL(또는 NEXT_PUBLIC_SUPABASE_URL)와 SUPABASE_SERVICE_ROLE_KEY가 필요합니다.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

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

async function ensureUser(u) {
  let id = await findUserIdByEmail(u.email);
  if (!id) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: seedPassword,
      email_confirm: true,
      user_metadata: { display_name: u.display_name },
    });
    if (error) throw error;
    id = data.user.id;
  }

  const { error: upErr } = await supabase.from("profiles").update({
    display_name: u.display_name,
    mbti: u.mbti,
    favorite_genres: u.favorite_genres,
    favorite_game_types: u.favorite_game_types,
    bio: u.bio,
    rule_master_games: u.rule_master_games,
  }).eq("id", id);
  if (upErr) throw upErr;

  return id;
}

function minPlayersFromJson(g) {
  if (g.minPlayers == null || g.minPlayers === "") return null;
  const n = Number(g.minPlayers);
  if (!Number.isFinite(n) || n < 1) return null;
  return Math.floor(n);
}

function genresFromJson(g) {
  if (Array.isArray(g.genres)) return g.genres;
  if (g.genre != null && String(g.genre).trim() !== "") {
    return [String(g.genre).trim()];
  }
  return [];
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
    genres: genresFromJson(g),
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

async function main() {
  const gamesPath = path.join(root, "src/data/games.json");
  const gamesJson = JSON.parse(fs.readFileSync(gamesPath, "utf8"));
  const gameNames = gamesJson.map((g) => g.name).filter(Boolean);
  const SEED_USERS = buildSeedUsers(gameNames);

  console.log("시드: 회원(profiles), 룰마스터 목록은 games.json 기준 임의 배정…");
  const ids = [];
  for (const u of SEED_USERS) {
    const id = await ensureUser(u);
    ids.push({ email: u.email, id });
    console.log("  OK", u.email, id);
  }

  const kim = ids.find((x) => x.email === "kim.haneul@bgu.local");
  if (!kim) {
    throw new Error("김하늘(kim.haneul@bgu.local) 시드 계정이 필요합니다.");
  }

  const games = gamesJson;

  const { count: existingCount, error: countErr } = await supabase
    .from("games")
    .select("*", { count: "exact", head: true });
  if (countErr) throw countErr;
  if (existingCount && existingCount > 0 && process.env.FORCE !== "1") {
    console.log(
      `games에 이미 ${existingCount}건이 있습니다. 회원 프로필만 갱신했습니다. games를 다시 넣으려면 FORCE=1 pnpm seed`,
    );
    process.exit(0);
  }

  if (process.env.FORCE === "1") {
    console.log("FORCE=1: games 테이블 비우기…");
    const { error: delErr } = await supabase
      .from("games")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (delErr) throw delErr;
  }

  function addedByForGame(g) {
    if (isGameAddedByExcludedFromKim(g.name)) return null;
    return kim.id;
  }

  const rows = games.map((g) => mapJsonGame(g, addedByForGame(g)));
  console.log(
    `시드: 게임 ${rows.length}건 (추가자: 김하늘, 이름이 「딥씨 크루」인 행만 added_by null)…`,
  );

  const { error: insErr } = await supabase.from("games").insert(rows);
  if (insErr) {
    if (insErr.code === "23505" || insErr.message?.includes("duplicate")) {
      console.error(
        "삽입 실패: 이미 데이터가 있을 수 있습니다. 재실행 시 FORCE=1 pnpm seed",
      );
    }
    throw insErr;
  }

  console.log("완료.");
  console.log(
    "시드 계정 비밀번호(기본):",
    seedPassword,
    "(kim.haneul@bgu.local 등)",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
