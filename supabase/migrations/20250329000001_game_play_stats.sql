-- 게임별 «해 봤어요» 표시 인원 수 집계 (정렬·목록용, RLS 없이 함수만 노출)

create or replace function public.game_play_stats()
returns table (game_id uuid, play_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.game_id,
    count(*)::bigint as play_count
  from public.game_plays p
  group by p.game_id;
$$;

grant execute on function public.game_play_stats() to anon, authenticated;

comment on function public.game_play_stats() is '게임별 해 봤음 표시한 회원 수.';
