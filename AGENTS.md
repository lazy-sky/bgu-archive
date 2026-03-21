<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## BGU / Supabase DB

- 스키마·RLS·함수·트리거 변경은 **Supabase SQL Editor에서 그대로 실행 가능한 SQL**로 작성한다. 기본 경로는 `supabase/migrations/` (또는 `supabase/sql/`).
- 로컬 Postgres·DB 비밀번호 기반 스크립트는 선택 사항이며, 사용자가 대시보드에 직접 붙여넣는 흐름을 기준으로 한다.
