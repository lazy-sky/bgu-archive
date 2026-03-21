/*
 * BGU Archive — Supabase SQL Editor에서 실행
 *
 * 1. Supabase 대시보드 → SQL Editor → New query
 * 2. 이 파일 전체를 붙여넣기 → Run (또는 Ctrl/Cmd + Enter)
 * 3. 이후 로컬에서 초기 데이터 넣기: pnpm seed
 *
 * 멱등: 같은 프로젝트에서 여러 번 실행해도 안전하게 설계됨.
 */

-- BGU Archive: profiles + games + RLS

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  mbti text not null default '',
  favorite_genres text[] not null default '{}',
  favorite_game_types text[] not null default '{}',
  bio text not null default '',
  rule_master_games text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  difficulty int,
  genre text not null default '',
  max_players_raw text,
  max_players_kind text not null
    check (max_players_kind in ('number', 'min_plus', 'unknown', 'text')),
  max_players_value text,
  beginner_friendly boolean not null default false,
  notes text not null default '',
  extra_notes text not null default '',
  added_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists games_games_genre_idx on public.games (genre);
create index if not exists games_added_by_idx on public.games (added_by);

alter table public.profiles enable row level security;
alter table public.games enable row level security;

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "games_select_all" on public.games;
create policy "games_select_all"
  on public.games for select
  using (true);

drop policy if exists "games_insert_authenticated" on public.games;
create policy "games_insert_authenticated"
  on public.games for insert
  to authenticated
  with check (
    (added_by is not null and added_by = auth.uid())
  );

drop policy if exists "games_delete_own" on public.games;
create policy "games_delete_own"
  on public.games for delete
  to authenticated
  using (added_by = auth.uid());

drop policy if exists "games_update_own" on public.games;
create policy "games_update_own"
  on public.games for update
  to authenticated
  using (added_by = auth.uid())
  with check (added_by = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'name'), ''),
      split_part(coalesce(new.email, 'user'), '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists bgu_on_auth_user_created on auth.users;
create trigger bgu_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
