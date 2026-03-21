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

/** 프로필만 (룰마스터 목록은 buildSeedUsers 에서 채움) */
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
  {
    email: "lee.jeon@bgu.local",
    display_name: "이전략",
    mbti: "INTJ",
    favorite_genres: ["전략", "엔진 빌딩"],
    favorite_game_types: ["중·장시간", "빡센 판"],
    bio: "메카닉 읽는 속도가 빠른 편. 룰북 정리 도와줄게요.",
    ruleSeed: 22,
  },
  {
    email: "park.hyp@bgu.local",
    display_name: "박협동",
    mbti: "ISFJ",
    favorite_genres: ["협력", "스토리"],
    favorite_game_types: ["가족/캐주얼"],
    bio: "분위기 맞추는 거 좋아해요. 초보랑 같이 플레이 자주 해요.",
    ruleSeed: 33,
  },
  {
    email: "choi.un@bgu.local",
    display_name: "최운",
    mbti: "ENTP",
    favorite_genres: ["베팅", "협력/배신"],
    favorite_game_types: ["짧게 여러 판"],
    bio: "운 좋은 날엔 주사위 게임도 환영.",
    ruleSeed: 44,
  },
  {
    email: "han.card@bgu.local",
    display_name: "한카드",
    mbti: "ENFJ",
    favorite_genres: ["카드", "덱빌딩"],
    favorite_game_types: ["중간 길이", "확장 이야기"],
    bio: "덱 구성 맛집. 카드 게임이면 일단 좋아요.",
    ruleSeed: 55,
  },
  {
    email: "jung.deck@bgu.local",
    display_name: "정덱빌",
    mbti: "ISTP",
    favorite_genres: ["엔진 빌딩", "전략"],
    favorite_game_types: ["손맛", "한 판 길게"],
    bio: "조용히 테이블 정리하는 타입. 룰 질문은 편하게.",
    ruleSeed: 66,
  },
  {
    email: "seo.party@bgu.local",
    display_name: "서파티",
    mbti: "ESFP",
    favorite_genres: ["파티", "술게임"],
    favorite_game_types: ["시끌벅적", "짧게 여러 판"],
    bio: "분위기 메이커. 웃기면 성공이에요.",
    ruleSeed: 77,
  },
  {
    email: "yoon.betray@bgu.local",
    display_name: "윤배신",
    mbti: "ENTJ",
    favorite_genres: ["협력/배신", "블러핑"],
    favorite_game_types: ["심리전", "밤샘"],
    bio: "배신 게임은 제가 설명할게요. (믿거나 말거나)",
    ruleSeed: 88,
  },
  {
    email: "kang.intro@bgu.local",
    display_name: "강입문",
    mbti: "INFP",
    favorite_genres: ["가족", "카드"],
    favorite_game_types: ["천천히", "분위기"],
    bio: "처음 오신 분 옆에 앉는 게 편해요.",
    ruleSeed: 99,
  },
  {
    email: "min.mini@bgu.local",
    display_name: "민미니",
    mbti: "ISFP",
    favorite_genres: ["퍼즐", "미니"],
    favorite_game_types: ["30분 안팎", "귀여운 테마"],
    bio: "짧고 귀여운 거 좋아해요. 룰은 천천히 읽어요.",
    ruleSeed: 101,
  },
];

/** 김하늘 제외 시드 회원 display_name — games added_by 랜덤 배정 풀 */
export const SEED_ADDED_BY_DISPLAY_NAMES = SEED_MEMBER_PROFILES.filter(
  (p) => p.email !== "kim.haneul@bgu.local",
).map((p) => p.display_name);

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
