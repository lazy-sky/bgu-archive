-- 관리자: profiles.is_admin = true 인 사용자는 RLS 상 모든 게임·모든 프로필 수정 가능
--
-- 최초 관리자 지정 (Supabase Dashboard → SQL Editor, 한 번만 실행):
--   update public.profiles set is_admin = true where id = '<해당 유저 uuid>';
-- 이후에는 관리자 계정으로 로그인한 상태에서 다른 사용자의 is_admin 만 변경 가능(트리거로 보호).

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

comment on column public.profiles.is_admin is
  '관리자 여부. true면 games/profiles 전체 수정·삭제 가능(RLS).';

-- RLS 정책에서 재귀 없이 admin 여부 확인
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin() to anon;

-- 일반 사용자가 API로 is_admin 을 true 로 올리는 것 방지 (대시보드 SQL은 auth.uid() 가 없어 예외 없음)
create or replace function public.profiles_guard_is_admin_column()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_admin is distinct from old.is_admin then
    if auth.uid() is null then
      return new;
    end if;
    if not exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    ) then
      raise exception 'is_admin can only be changed by an existing admin or SQL editor';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists bgu_profiles_guard_is_admin on public.profiles;
create trigger bgu_profiles_guard_is_admin
  before update of is_admin on public.profiles
  for each row
  execute procedure public.profiles_guard_is_admin_column();

-- profiles: 본인 또는 관리자가 수정
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- games: 등록자 또는 관리자
drop policy if exists "games_insert_authenticated" on public.games;
create policy "games_insert_authenticated"
  on public.games for insert
  to authenticated
  with check (
    (added_by is not null and added_by = auth.uid())
    or public.is_admin()
  );

drop policy if exists "games_delete_own" on public.games;
drop policy if exists "games_delete_own_or_admin" on public.games;
create policy "games_delete_own_or_admin"
  on public.games for delete
  to authenticated
  using (added_by = auth.uid() or public.is_admin());

drop policy if exists "games_update_own" on public.games;
drop policy if exists "games_update_own_or_admin" on public.games;
create policy "games_update_own_or_admin"
  on public.games for update
  to authenticated
  using (added_by = auth.uid() or public.is_admin())
  with check (added_by = auth.uid() or public.is_admin());
