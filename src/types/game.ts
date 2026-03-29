export type MaxPlayersKind = "number" | "min_plus" | "unknown" | "text";

export type Game = {
  id: string;
  name: string;
  difficulty: number | null;
  /** 장르 태그(다중) */
  genres: string[];
  /** 최소 인원(명). null이면 미기재 */
  minPlayers: number | null;
  maxPlayersRaw: string | number | null;
  maxPlayersKind: MaxPlayersKind;
  maxPlayers: number | string | null;
  beginnerFriendly: boolean;
  notes: string;
  extraNotes: string;
  /** 게임을 등록한 사용자 */
  addedBy: string | null;
  /** profiles.display_name (추가한 회원) */
  addedByName: string | null;
  /** 전체 유저 평균 별점(1–5). 아직 없으면 null */
  ratingAvg: number | null;
  /** 평점을 남긴 인원 수 */
  ratingCount: number;
  /** 현재 로그인 사용자가 매긴 별점(없으면 null) */
  myRating: number | null;
  /** 현재 로그인 사용자가 «해 봤다»고 표시했는지 */
  myPlayed: boolean;
  /** «해 봤어요»를 표시한 회원 수 */
  playedCount: number;
};
