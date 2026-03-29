-- 명예의 전당: 봄버스터즈 66 스테이지 올클 + 달성 회원 4명
-- Supabase SQL Editor에서 실행 (멱등: 같은 제목 업적이 없을 때만 삽입, 달성은 ON CONFLICT 무시)

insert into public.achievements (title, description, sort_order)
select
  '봄버스터즈 66 스테이지 올클',
  '봄버스터즈 66 스테이지를 모두 클리어했습니다.',
  coalesce((select max(sort_order) from public.achievements), -1) + 1
where not exists (
  select 1 from public.achievements where title = '봄버스터즈 66 스테이지 올클'
);

insert into public.achievement_awards (achievement_id, user_id)
select a.id, p.id
from public.achievements a
cross join public.profiles p
where a.title = '봄버스터즈 66 스테이지 올클'
  and trim(p.display_name) in (
    '조서형',
    '장서연',
    '이명진',
    '박치용'
  )
on conflict (achievement_id, user_id) do nothing;
