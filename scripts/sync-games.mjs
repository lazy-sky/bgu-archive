/**
 * games.json → Supabase games 테이블 전체 교체
 * added_by: 김하늘 제외 시드 회원에게 결정적 랜덤 (seed-supabase.mjs / games:sql 과 동일)
 *
 * 필요: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * 전제: pnpm seed 로 시드 회원(auth + profiles)이 이미 있어야 함
 *
 * 실행: pnpm sync-games
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mulberry32, SEED_MEMBER_PROFILES } from "./seed-members-data.mjs";

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

const NON_KIM_MEMBERS = SEED_MEMBER_PROFILES.filter(
  (p) => p.email !== "kim.haneul@bgu.local",
);

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

async function resolveNonKimUserIds() {
  const ids = [];
  for (const p of NON_KIM_MEMBERS) {
    const id = await findUserIdByEmail(p.email);
    if (!id) {
      throw new Error(
        `시드 계정 없음: ${p.email}. 먼저 pnpm seed 를 실행하세요.`,
      );
    }
    ids.push(id);
  }
  return ids;
}

function addedByIdForGameIndex(i, nonKimIds) {
  const next = mulberry32((i * 0x9e3779b9 + 0xbeef) >>> 0);
  const idx = Math.floor(next() * nonKimIds.length);
  return nonKimIds[idx];
}

async function main() {
  const nonKimIds = await resolveNonKimUserIds();

  const gamesPath = path.join(root, "src/data/games.json");
  if (!fs.existsSync(gamesPath)) {
    console.error("없음:", gamesPath);
    process.exit(1);
  }

  const games = JSON.parse(fs.readFileSync(gamesPath, "utf8"));
  const rows = games.map((g, i) =>
    mapJsonGame(g, addedByIdForGameIndex(i, nonKimIds)),
  );

  console.log(
    `games 테이블 비우기 후 ${rows.length}건 삽입 (추가자: 김하늘 제외 ${nonKimIds.length}명 중 랜덤)…`,
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
