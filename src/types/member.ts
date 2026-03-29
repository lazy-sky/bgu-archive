import type { AvatarConfig } from "@/types/avatar";
import type { AchievementBadge } from "@/types/hall-of-fame";

export type Member = {
  id: string;
  displayName: string;
  mbti: string;
  favoriteGenres: string[];
  favoriteGameTypes: string[];
  bio: string;
  /** 룰 설명 가능한 게임 */
  ruleMasterGames: string[];
  avatarConfig: AvatarConfig;
  /** 회원 목록 등에서만 채움 */
  achievementBadges?: AchievementBadge[];
};
