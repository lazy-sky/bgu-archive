import type { AvatarConfig } from "@/types/avatar";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  createdAt: string;
};

export type Honoree = {
  userId: string;
  displayName: string;
  awardedAt: string;
  avatarConfig: AvatarConfig;
};

export type HallOfFameEntry = Achievement & {
  honorees: Honoree[];
};

/** 회원 카드·프로필용 업적 요약 */
export type AchievementBadge = {
  id: string;
  title: string;
  sortOrder: number;
};
