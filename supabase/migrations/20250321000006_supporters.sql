-- 후원자 명단 + 후원 금액(원, KRW 정수)

create table if not exists public.supporters (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  amount_krw bigint not null default 0 check (amount_krw >= 0),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (display_name)
);

comment on table public.supporters is '후원 감사 명단. 공개 조회, 수정은 관리자만.';

create index if not exists supporters_sort_order_idx on public.supporters (sort_order);

alter table public.supporters enable row level security;

drop policy if exists "supporters_select_all" on public.supporters;
create policy "supporters_select_all"
  on public.supporters for select
  using (true);

drop policy if exists "supporters_insert_admin" on public.supporters;
create policy "supporters_insert_admin"
  on public.supporters for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "supporters_update_admin" on public.supporters;
create policy "supporters_update_admin"
  on public.supporters for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "supporters_delete_admin" on public.supporters;
create policy "supporters_delete_admin"
  on public.supporters for delete
  to authenticated
  using (public.is_admin());

insert into public.supporters (display_name, amount_krw, sort_order) values
  ('김범기', 0, 1),
  ('조서형', 0, 2),
  ('박나현', 10000, 3),
  ('장서연', 5000, 4),
  ('김종인', 5000, 5)
on conflict (display_name) do update set
  amount_krw = excluded.amount_krw,
  sort_order = excluded.sort_order;
