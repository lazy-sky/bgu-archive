/**
 * 가짜 회원 프로필 + games.json 기준 룰마스터 가능 목록(시드마다 결정적 임의)
 * seed-supabase.mjs 에서 import
 */

/** 멤버당 rule_master_games 개수 범위 */
const RULE_COUNT_MIN = 3;
const RULE_COUNT_MAX = 6;

/** mulberry32 PRNG (시드 게임 added_by 배정 등에서 재사용) */
export function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * gameNames 에서 seed 로 섞어 count 개 선택 (중복 없음)
 */
export function pickRuleMasterGames(gameNames, seed, count = 4) {
  if (!gameNames.length) return [];
  const n = Math.min(count, gameNames.length);
  const rand = mulberry32(seed >>> 0);
  const copy = [...gameNames];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

/** 프로필만 (룰마스터 목록은 buildSeedUsers 에서 채움). 예시 더미 다수는 제거하고 김하늘만 둡니다. */
export const SEED_MEMBER_PROFILES = [
  {
    email: "kim.haneul@bgu.local",
    display_name: "김하늘",
    mbti: "ENFP",
    favorite_genres: ["파티", "블러핑", "카드"],
    favorite_game_types: ["단시간", "웃음 위주"],
    bio: "신입 환영 담당. 입문용 게임 추천 좋아해요.",
    ruleSeed: 11,
  },
];

/**
 * games `added_by`를 김하늘로 두지 않는 예외 (이름 정확히 일치, 앞뒤 공백 무시).
 * 해당 행은 시드 시 added_by 를 null 로 두고, 운영에서 직접 지정할 수 있습니다.
 */
export const GAME_ADDED_BY_EXCLUDE_KIM_NAME = "딥씨 크루";

export function isGameAddedByExcludedFromKim(name) {
  return String(name ?? "").trim() === GAME_ADDED_BY_EXCLUDE_KIM_NAME;
}

/**
 * @param {string[]} gameNames — games.json 의 name 목록
 */
export function buildSeedUsers(gameNames) {
  return SEED_MEMBER_PROFILES.map((p, i) => {
    const { ruleSeed, ...rest } = p;
    const count =
      RULE_COUNT_MIN +
      (Math.abs(ruleSeed * 7 + i * 13) %
        (RULE_COUNT_MAX - RULE_COUNT_MIN + 1));
    const seed = (ruleSeed * 1009 + i * 7919) >>> 0;
    return {
      ...rest,
      rule_master_games: pickRuleMasterGames(gameNames, seed, count),
    };
  });
}
