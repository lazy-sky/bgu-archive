-- 프로필 아바타 (JSON: DiceBear Lorelei — style, seed, options)

alter table public.profiles
  add column if not exists avatar_config jsonb not null default '{}'::jsonb;

comment on column public.profiles.avatar_config is
  '아바타 설정 JSON. 비어 있으면 클라이언트 기본값 사용.';
