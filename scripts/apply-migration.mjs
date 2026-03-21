/**
 * Postgres에 마이그레이션 SQL 실행 (DDL + RLS)
 *
 * 다음 중 하나:
 * - DATABASE_URL (Supabase → Database → Connection string → URI)
 * - 또는 NEXT_PUBLIC_SUPABASE_URL + SUPABASE_DB_PASSWORD (DB 비밀번호)
 */
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

dotenv.config({ path: path.join(root, ".env.local") });
dotenv.config();

function buildConnectionString() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  const publicUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const password =
    process.env.SUPABASE_DB_PASSWORD ?? process.env.DATABASE_PASSWORD;
  if (!publicUrl || !password) {
    console.error(`
마이그레이션에 DB 연결이 필요합니다. 아래 중 하나를 .env.local 에 설정하세요.

  1) DATABASE_URL=postgresql://postgres:비밀번호@db.프로젝트ref.supabase.co:5432/postgres
     (대시보드 Settings → Database → Connection string → URI)

  2) SUPABASE_DB_PASSWORD=데이터베이스_비밀번호
     (같은 화면의 Database password — API 키와 다릅니다)
`);
    process.exit(1);
  }
  const m = publicUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!m) {
    console.error("NEXT_PUBLIC_SUPABASE_URL 형식이 올바르지 않습니다.");
    process.exit(1);
  }
  const ref = m[1];
  const encoded = encodeURIComponent(password);
  return `postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres`;
}

async function main() {
  const sqlPath = path.join(
    root,
    "supabase/migrations/20250321000000_init.sql",
  );
  const sql = fs.readFileSync(sqlPath, "utf8");

  const connectionString = buildConnectionString();
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    await client.query(sql);
    console.log("마이그레이션 적용 완료:", sqlPath);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
