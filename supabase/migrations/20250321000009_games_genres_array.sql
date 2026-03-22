-- 장르: 단일 text → 다중 text[] (기존 DB에 genre 컬럼이 있을 때만 이전)

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'games'
      and column_name = 'genre'
  ) then
    alter table public.games
      add column if not exists genres text[] not null default '{}';

    update public.games
    set genres = case
      when coalesce(nullif(trim(genre), ''), '') = '' then '{}'::text[]
      else array[trim(genre)]::text[]
    end
    where genres = '{}'::text[];

    drop index if exists public.games_games_genre_idx;

    alter table public.games drop column genre;

    create index if not exists games_genres_gin_idx on public.games using gin (genres);
  end if;
end $$;

-- 새 init.sql 로 이미 genres 만 있는 경우: GIN 인덱스만 보장
create index if not exists games_genres_gin_idx on public.games using gin (genres);
