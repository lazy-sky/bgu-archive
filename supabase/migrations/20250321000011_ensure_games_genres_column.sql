-- 복구: 이미 적용된 DB에 genres 가 없을 때(PGRST204) 안전하게 컬럼 추가·이전

alter table public.games
  add column if not exists genres text[] not null default '{}';

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'games'
      and column_name = 'genre'
  ) then
    update public.games
    set genres = case
      when coalesce(nullif(trim(genre), ''), '') = '' then '{}'::text[]
      else array[trim(genre)]::text[]
    end
    where genres = '{}'::text[];

    drop index if exists public.games_games_genre_idx;

    alter table public.games drop column genre;
  end if;
end $$;

create index if not exists games_genres_gin_idx on public.games using gin (genres);
