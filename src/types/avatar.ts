import type { Options as LoreleiOptions } from "@dicebear/lorelei";

/** 현재 사용 중인 DiceBear 컬렉션 */
export const AVATAR_STYLE_LORELEI = "lorelei" as const;

export type AvatarStyle = typeof AVATAR_STYLE_LORELEI;

/**
 * `profiles.avatar_config`에 저장되는 값.
 * Lorelei 전용 옵션은 DiceBear 스키마와 동일(배열로 variant·색 고정).
 */
export type AvatarConfig = {
  style: AvatarStyle;
  /** 비어 있으면 렌더 시 `seedFallback`(예: user id) 사용 */
  seed: string;
  options: LoreleiOptions;
};
