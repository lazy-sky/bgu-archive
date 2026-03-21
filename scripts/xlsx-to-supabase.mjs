/**
 * 엑셀 → games.json 갱신 → Supabase games 전체 동기화 (한 번에)
 *
 * 사용: node scripts/xlsx-to-supabase.mjs "/path/to/게임목록.xlsx"
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const xlsxPath = process.argv[2];

if (!xlsxPath) {
  console.error(
    "Usage: pnpm games:from-xlsx -- \"/path/to/BGU 게임 목록.xlsx\"",
  );
  process.exit(1);
}

const outJson = path.join(root, "src/data/games.json");

const r1 = spawnSync(
  process.execPath,
  [path.join(root, "scripts/import-games.mjs"), xlsxPath, outJson],
  { stdio: "inherit", cwd: root },
);
if (r1.status !== 0) process.exit(r1.status ?? 1);

const r2 = spawnSync(
  process.execPath,
  [path.join(root, "scripts/sync-games.mjs")],
  { stdio: "inherit", cwd: root },
);
process.exit(r2.status ?? 0);
