export type MaxPlayersKind = "number" | "min_plus" | "unknown" | "text";

export type Game = {
  id: string;
  name: string;
  difficulty: number | null;
  genre: string;
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
};
