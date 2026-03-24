import type { Game } from "@/types/game";

/**
 * 게임 데이터에 쓰이는 기본 장르 태그(정렬·표시용).
 * DB에 없는 새 장르는 폼에서 직접 입력하거나, 등록 후 목록에 합쳐집니다.
 */
export const GAME_GENRE_TAGS = [
  "경매",
  "기타",
  "낱말게임",
  "덱 빌딩",
  "마피아",
  "베팅",
  "블러핑",
  "세트 콜렉션",
  "영향력",
  "일꾼 놓기",
  "전략",
  "주사위",
  "추리",
  "추상 전략",
  "카드 클라이밍",
  "트릭 테이킹",
  "파티",
  "협력",
  "협상",
] as const;

/** 기본 태그 + 현재 등록된 게임의 장르(중복 제거, 가나다순). 직접 입력 없이 선택만 할 때 사용 */
export function getGenreOptionsForPicker(games: Game[]): string[] {
  const set = new Set<string>(GAME_GENRE_TAGS);
  for (const g of games) {
    for (const x of g.genres) {
      const t = x?.trim();
      if (t) set.add(t);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b, "ko"));
}
