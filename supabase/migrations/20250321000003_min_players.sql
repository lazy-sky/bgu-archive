-- 게임 최소 인원 (선택, 미입력 시 null)

alter table public.games
  add column if not exists min_players int null;

comment on column public.games.min_players is '최소 인원(명). null이면 미기재로 표시.';
