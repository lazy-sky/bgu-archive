# Supabase

## 1. 스키마 (최초 1회)

**파일:** [`migrations/20250321000000_init.sql`](./migrations/20250321000000_init.sql)

대시보드 **SQL Editor**에 통째로 붙여 실행합니다.

## 2. 엑셀 내용을 `games` 테이블에 넣기

목표는 **엑셀 행 = Supabase `public.games` 행**입니다. 방법은 두 가지입니다.

### A) API로 넣기 (권장, 한 줄)

`.env.local`에 `SUPABASE_SERVICE_ROLE_KEY`가 있을 때:

```bash
pnpm games:from-xlsx -- "/절대/경로/BGU 게임 목록(하늘).xlsx"
```

엑셀 → `src/data/games.json` 갱신 → 원격 DB `games` **전체 교체**까지 한 번에 합니다. (`added_by`는 김하늘 제외 시드 회원에게 결정적 랜덤 배정 — `seed-supabase.mjs`와 동일 규칙)

### B) SQL Editor만 쓰기

1. 로컬에서 엑셀을 JSON으로 변환:

   ```bash
   pnpm import-games -- "/절대/경로/게임목록.xlsx"
   ```

2. SQL 파일 생성:

   ```bash
   pnpm games:sql
   ```

3. 생성된 [`sql/seed_games.sql`](./sql/seed_games.sql) 내용을 **SQL Editor**에 붙여 **Run**.

   - 기존 `games` 행을 `DELETE` 한 뒤 `INSERT` 합니다.
   - `added_by`는 김하늘을 제외한 시드 회원(`display_name`) 중에서 `games.json` 순번마다 골라 지정합니다. **시드 회원 프로필이 없으면** `pnpm seed`로 넣은 뒤 실행하세요.

## 3. 회원 등 초기 시드 (선택)

```bash
pnpm seed
```

(서비스 롤 키 필요)

가짜 회원 **10명** + `games.json` 기준으로 골라 넣은 **룰마스터 가능 게임 목록**(`rule_master_games`). 프로필 정의는 `scripts/seed-members-data.mjs` 참고.

## 4. Google 로그인 (앱은 이메일/비밀번호 없음)

1. **[Google Cloud Console](https://console.cloud.google.com/)**  
   - APIs & Services → Credentials → **OAuth 2.0 클라이언트 ID** (웹 애플리케이션)  
   - **승인된 리디렉션 URI**에 다음을 추가 (프로젝트 ref 는 Supabase URL 과 동일):
     - `https://<project-ref>.supabase.co/auth/v1/callback`
2. **Supabase** → Authentication → **Providers** → **Google** 활성화  
   - Client ID / Client Secret 을 Google 에서 복사해 넣기
3. **Supabase** → Authentication → **URL Configuration**  
   - Site URL: 로컬이면 `http://localhost:3000`  
   - Redirect URLs 에 `http://localhost:3000/auth/callback` (배포 도메인도 추가)
4. **SQL** (아직이면): [`migrations/20250321000001_google_oauth_profile_name.sql`](./migrations/20250321000001_google_oauth_profile_name.sql) 실행 — Google 의 `full_name` 을 `profiles.display_name` 에 쓰도록 트리거 함수 갱신. (`20250321000000_init.sql` 만 처음부터 돌린 경우 이미 포함됨)
5. (선택) Authentication → Providers → **Email** 끄기 — 이메일 가입 차단

앱 경로: `/auth/login` → Google → `/auth/callback` 에서 세션 교환.

**신규로 Google 로그인하면** Supabase가 `auth.users`에 사용자를 만들고, DB 트리거 `bgu_on_auth_user_created`가 같은 `id`로 `public.profiles` 행을 자동 삽입합니다(`display_name`은 Google 메타데이터·이메일에서 채움). 앱 코드가 직접 `profiles`를 넣는 것이 아니라 **마이그레이션에 포함된 트리거**가 처리합니다.

## 5. 관리자 (`is_admin`)

**파일:** [`migrations/20250321000002_admin_profiles.sql`](./migrations/20250321000002_admin_profiles.sql) — SQL Editor에서 실행.

- `profiles.is_admin = true` 인 계정은 **모든 게임·모든 프로필**을 수정·삭제할 수 있습니다(RLS).
- **최초 한 명**은 대시보드 SQL에서 `auth.uid()` 없이 실행되므로 트리거를 통과합니다:

  ```sql
  update public.profiles set is_admin = true
  where id = '<Supabase Authentication → Users 에서 복사한 uuid>';
  ```

- 이후에는 **이미 관리자인 계정으로 로그인한 상태**에서만 다른 사람의 `is_admin` 을 바꿀 수 있습니다(일반 사용자는 스스로 관리자로 올릴 수 없음).

## 이후 스키마 변경

`migrations/`에 Supabase에서 실행 가능한 SQL을 추가하면 됩니다.
