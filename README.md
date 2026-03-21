# BGU Archive

BoardGameUnion(BGU) 동아리용 보드게임 아카이브 웹앱.

- **게임 / 회원**: Supabase (`games`, `profiles`)
- **로컬 백업용 JSON**: `src/data/games.json` (엑셀 `pnpm import-games`로 갱신 가능)
- **스택**: Next.js, Tailwind, TanStack Query, Supabase Auth + `@supabase/ssr`
- **패키지 매니저**: [pnpm](https://pnpm.io) (`packageManager` 필드 참고)

## 개발

```bash
pnpm install
pnpm dev
```

pnpm이 없으면 `corepack enable` 후 `pnpm`을 쓰거나, `npx pnpm@10 install`로 설치할 수 있습니다.

## Supabase

1. **스키마:** [`supabase/migrations/20250321000000_init.sql`](./supabase/migrations/20250321000000_init.sql) 전체를 대시보드 **SQL Editor**에 붙여 실행합니다. ([`supabase/README.md`](./supabase/README.md) 참고)
2. **시드:** `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY`를 넣은 뒤:

```bash
pnpm seed
```

회원(시드) + 게임 전체가 들어갑니다. 게임 `added_by`는 **김하늘을 제외한** 시드 회원에게 결정적 랜덤 배정됩니다. 이미 `games`에 행이 있으면 건너뜁니다. 덮어쓰려면 `FORCE=1 pnpm seed`.

`pnpm seed`는 **가짜 회원 10명**을 만들고, `rule_master_games`는 `games.json`에 있는 게임 이름 중에서 **임의(시드 고정)**로 골라 넣습니다. 정의는 `scripts/seed-members-data.mjs` 참고.

시드 계정 예: `kim.haneul@bgu.local` … `min.mini@bgu.local` (비밀번호 기본 `bgu-dev-2025`, `SEED_PASSWORD`로 변경 가능). `games`가 이미 있으면 게임 삽입은 건너뛰고 **회원 프로필만** 다시 갱신합니다.

**선택:** 로컬에서 Postgres로 마이그레이션을 돌리려면 `pnpm db:migrate` (`SUPABASE_DB_PASSWORD` 또는 `DATABASE_URL` 필요).

## 엑셀 → Supabase `games`에 넣기

**한 번에 (엑셀 → DB):**

```bash
pnpm games:from-xlsx -- "/path/to/BGU 게임 목록.xlsx"
```

(`SUPABASE_SERVICE_ROLE_KEY` 필요. [`supabase/README.md`](./supabase/README.md) 참고)

**SQL Editor만 사용:** `pnpm import-games` → `pnpm games:sql` → `supabase/sql/seed_games.sql` 붙여넣기.

**JSON만 갱신:**

```bash
pnpm import-games -- "/path/to/BGU 게임 목록.xlsx"
pnpm sync-games
```

## 환경 변수

| 변수 | 용도 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon 키 (클라이언트) |
| `SUPABASE_SERVICE_ROLE_KEY` | `pnpm seed` 등 (비공개) |
| `SUPABASE_DB_PASSWORD` | (선택) `pnpm db:migrate`로 로컬에서 DDL 실행할 때만 |
| `DATABASE_URL` | (선택) 위와 동일, 전체 URI |
