-- 회원별 게임 별점(1–5)

create table if not exists public.game_ratings (
  user_id uuid not null references public.profiles (id) on delete cascade,
  game_id uuid not null references public.games (id) on delete cascade,
  rating smallint not null check (rating >= 1 and rating <= 5),
  updated_at timestamptz not null default now(),
  primary key (user_id, game_id)
);

create index if not exists game_ratings_game_id_idx on public.game_ratings (game_id);

comment on table public.game_ratings is '회원이 게임에 매긴 별점(1–5).';

create or replace function public.game_ratings_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists game_ratings_set_updated_at on public.game_ratings;
create trigger game_ratings_set_updated_at
  before update on public.game_ratings
  for each row execute function public.game_ratings_touch_updated_at();

-- 집계는 RLS 없이 함수로만 노출 (목록 평균용)
create or replace function public.game_rating_stats()
returns table (game_id uuid, avg_rating numeric, rating_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    r.game_id,
    round(avg(r.rating::numeric), 2) as avg_rating,
    count(*)::bigint as rating_count
  from public.game_ratings r
  group by r.game_id;
$$;

grant execute on function public.game_rating_stats() to anon, authenticated;

alter table public.game_ratings enable row level security;

drop policy if exists "game_ratings_select_own" on public.game_ratings;
create policy "game_ratings_select_own"
  on public.game_ratings for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "game_ratings_insert_own" on public.game_ratings;
create policy "game_ratings_insert_own"
  on public.game_ratings for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "game_ratings_update_own" on public.game_ratings;
create policy "game_ratings_update_own"
  on public.game_ratings for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "game_ratings_delete_own" on public.game_ratings;
create policy "game_ratings_delete_own"
  on public.game_ratings for delete
  to authenticated
  using (user_id = auth.uid());
