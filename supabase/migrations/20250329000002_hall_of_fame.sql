-- 명예의 전당: 관리자가 정의한 업적과 회원별 달성 기록

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.achievements is '명예의 전당 업적(관리자만 생성·수정·삭제).';

create table if not exists public.achievement_awards (
  achievement_id uuid not null references public.achievements (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (achievement_id, user_id)
);

create index if not exists achievement_awards_user_id_idx
  on public.achievement_awards (user_id);

comment on table public.achievement_awards is '업적을 달성한 회원(관리자만 부여·해제).';

alter table public.achievements enable row level security;
alter table public.achievement_awards enable row level security;

drop policy if exists "achievements_select_all" on public.achievements;
create policy "achievements_select_all"
  on public.achievements for select
  using (true);

drop policy if exists "achievements_insert_admin" on public.achievements;
create policy "achievements_insert_admin"
  on public.achievements for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "achievements_update_admin" on public.achievements;
create policy "achievements_update_admin"
  on public.achievements for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "achievements_delete_admin" on public.achievements;
create policy "achievements_delete_admin"
  on public.achievements for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "achievement_awards_select_all" on public.achievement_awards;
create policy "achievement_awards_select_all"
  on public.achievement_awards for select
  using (true);

drop policy if exists "achievement_awards_insert_admin" on public.achievement_awards;
create policy "achievement_awards_insert_admin"
  on public.achievement_awards for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "achievement_awards_delete_admin" on public.achievement_awards;
create policy "achievement_awards_delete_admin"
  on public.achievement_awards for delete
  to authenticated
  using (public.is_admin());
