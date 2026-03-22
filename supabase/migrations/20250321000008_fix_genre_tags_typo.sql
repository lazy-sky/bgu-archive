-- 장르 표기 통일: 전약 → 전략, 트릭테이킹 → 트릭 테이킹

update public.games
set genre = '전략'
where genre = '전약';

update public.games
set genre = '트릭 테이킹'
where genre = '트릭테이킹';

-- 선호 장르 배열 동일 치환 + 중복 제거(가나다순)
update public.profiles
set favorite_genres = (
  select coalesce(array_agg(x order by x), '{}')
  from (
    select distinct unnest(
      array_replace(
        array_replace(favorite_genres, '전약', '전략'),
        '트릭테이킹',
        '트릭 테이킹'
      )
    ) as x
  ) s
)
where favorite_genres && array['전약', '트릭테이킹']::text[];
