/*
 * supporters 시드 (마이그레이션 20250321000006 과 동일 데이터)
 * 필요 시 SQL Editor에서만 실행.
 */

insert into public.supporters (display_name, amount_krw, sort_order) values
  ('김범기', 0, 1),
  ('조서형', 0, 2),
  ('박나현', 10000, 3),
  ('장서연', 5000, 4),
  ('김종인', 5000, 5)
on conflict (display_name) do update set
  amount_krw = excluded.amount_krw,
  sort_order = excluded.sort_order;
