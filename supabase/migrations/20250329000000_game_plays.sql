-- 회원별 «이 게임 해 봤음» 기록

create table if not exists public.game_plays (
  user_id uuid not null references public.profiles (id) on delete cascade,
  game_id uuid not null references public.games (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, game_id)
);

create index if not exists game_plays_game_id_idx on public.game_plays (game_id);

comment on table public.game_plays is '회원이 «해 봤다»고 표시한 게임.';

alter table public.game_plays enable row level security;

drop policy if exists "game_plays_select_own" on public.game_plays;
create policy "game_plays_select_own"
  on public.game_plays for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "game_plays_insert_own" on public.game_plays;
create policy "game_plays_insert_own"
  on public.game_plays for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "game_plays_delete_own" on public.game_plays;
create policy "game_plays_delete_own"
  on public.game_plays for delete
  to authenticated
  using (user_id = auth.uid());
