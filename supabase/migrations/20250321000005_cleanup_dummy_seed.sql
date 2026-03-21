-- 운영 DB 정리(선택): 예시 회원 삭제 전에 games.added_by 를 맞춥니다.
-- 더미 auth 사용자 삭제는 대시보드 Authentication 또는 `pnpm seed:delete-dummies` 로 수행하세요.

update public.games g
set added_by = (select id from public.profiles where display_name = '김하늘' limit 1)
where trim(g.name) <> '딥씨 크루';
