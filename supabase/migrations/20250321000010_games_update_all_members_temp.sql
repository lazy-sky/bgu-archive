-- 임시: 로그인한 모든 회원이 게임 정보를 수정할 수 있음 (되돌릴 때 정책 복구)

drop policy if exists "games_update_own_or_admin" on public.games;

create policy "games_update_all_authenticated_temp"
  on public.games for update
  to authenticated
  using (true)
  with check (true);
