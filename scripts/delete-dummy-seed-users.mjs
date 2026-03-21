/**
 * 예시 시드 계정(김하늘 제외) 삭제 + games.added_by 정리
 *
 * 1) games: 이름이 「딥씨 크루」가 아닌 행은 added_by → 김하늘
 * 2) 아래 목록의 auth.users 삭제(프로필은 cascade)
 *
 * 필요: SUPABASE_URL(또는 NEXT_PUBLIC_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY
 *
 * 실행: pnpm seed:delete-dummies
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isGameAddedByExcludedFromKim } from "./seed-members-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

dotenv.config({ path: path.join(root, ".env.local") });
dotenv.config();

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** 예전 seed-members-data 에 있던 더미(김하늘 제외) */
const DUMMY_EMAILS = [
  "lee.jeon@bgu.local",
  "park.hyp@bgu.local",
  "choi.un@bgu.local",
  "han.card@bgu.local",
  "jung.deck@bgu.local",
  "seo.party@bgu.local",
  "yoon.betray@bgu.local",
  "kang.intro@bgu.local",
  "min.mini@bgu.local",
];

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

/**
 * games.added_by FK는 public.profiles(id) 를 가리킵니다.
 * auth 사용자 id와 profiles 행이 어긋나 있으면 이메일만으로는 실패합니다.
 */
async function resolveKimProfileId() {
  const { data: byName, error: e1 } = await supabase
    .from("profiles")
    .select("id")
    .eq("display_name", "김하늘")
    .limit(1)
    .maybeSingle();
  if (e1) throw e1;
  if (byName?.id) return byName.id;

  const authId = await findUserIdByEmail("kim.haneul@bgu.local");
  if (!authId) return null;
  const { data: byAuth, error: e2 } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", authId)
    .maybeSingle();
  if (e2) throw e2;
  return byAuth?.id ?? null;
}

async function main() {
  const kimId = await resolveKimProfileId();
  if (!kimId) {
    console.error(`
profiles에 display_name이 「김하늘」인 행이 없습니다. games.added_by 는 profiles.id 를 가리켜야 합니다.

  · 실제로 쓰는 계정이 본명이 김하늘이면 마이페이지에서 표시 이름을 확인하거나
  · kim.haneul@bgu.local 로 시드 로그인 후 프로필이 생겼는지 확인하세요.
`);
    process.exit(1);
  }

  console.log("games.added_by 정리: 딥씨 크루 제외 → 김하늘…");
  const { data: games, error: gErr } = await supabase
    .from("games")
    .select("id, name");
  if (gErr) throw gErr;

  let nUp = 0;
  for (const row of games ?? []) {
    if (isGameAddedByExcludedFromKim(row.name)) continue;
    const { error: uErr } = await supabase
      .from("games")
      .update({ added_by: kimId })
      .eq("id", row.id);
    if (uErr) throw uErr;
    nUp += 1;
  }
  console.log(`  ${nUp}건 업데이트 (딥씨 크루 등 예외는 그대로).`);

  for (const email of DUMMY_EMAILS) {
    const id = await findUserIdByEmail(email);
    if (!id) {
      console.log(`  건너뜀(없음): ${email}`);
      continue;
    }
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) {
      console.error(`  삭제 실패 ${email}:`, error.message);
    } else {
      console.log(`  삭제: ${email}`);
    }
  }

  console.log("완료.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
