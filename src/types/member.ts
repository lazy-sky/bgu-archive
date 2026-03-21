export type Member = {
  id: string;
  displayName: string;
  mbti: string;
  favoriteGenres: string[];
  favoriteGameTypes: string[];
  bio: string;
  /** 룰 설명 가능한 게임 */
  ruleMasterGames: string[];
};
