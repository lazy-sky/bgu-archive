-- min_players 컬럼 보장, 오타(min_player) 정리, PostgREST 스키마 캐시 갱신
-- "Could not find the min_player column" / min_players 관련 스키마 캐시 오류 완화

alter table public.games
  add column if not exists min_players int null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'games' and column_name = 'min_player'
  ) then
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'games' and column_name = 'min_players'
    ) then
      update public.games
      set min_players = coalesce(min_players, min_player)
      where min_player is not null;
      alter table public.games drop column min_player;
    else
      alter table public.games rename column min_player to min_players;
    end if;
  end if;
end $$;

comment on column public.games.min_players is '최소 인원(명). null이면 미기재로 표시.';

notify pgrst, 'reload schema';
