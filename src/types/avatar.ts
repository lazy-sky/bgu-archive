import type { Options as AdventurerOptions } from "@dicebear/adventurer";
import type { Options as AvataaarsOptions } from "@dicebear/avataaars";
import type { Options as LoreleiOptions } from "@dicebear/lorelei";
import type { Options as MicahOptions } from "@dicebear/micah";
import type { Options as ThumbsOptions } from "@dicebear/thumbs";
import type { Options as ToonHeadOptions } from "@dicebear/toon-head";

export const AVATAR_STYLES = [
  "thumbs",
  "lorelei",
  "avataaars",
  "micah",
  "toon-head",
  "adventurer",
] as const;

export type AvatarStyleId = (typeof AVATAR_STYLES)[number];

export const AVATAR_STYLE_LABELS: Record<AvatarStyleId, string> = {
  lorelei: "Lorelei",
  avataaars: "Avataaars",
  micah: "Micah",
  "toon-head": "Toon Head",
  thumbs: "Thumbs",
  adventurer: "Adventurer",
};

/**
 * `profiles.avatar_config` — `style`에 따라 `options` 스키마가 다릅니다.
 */
export type AvatarConfig =
  | { style: "lorelei"; seed: string; options: LoreleiOptions }
  | { style: "avataaars"; seed: string; options: AvataaarsOptions }
  | { style: "micah"; seed: string; options: MicahOptions }
  | { style: "toon-head"; seed: string; options: ToonHeadOptions }
  | { style: "thumbs"; seed: string; options: ThumbsOptions }
  | { style: "adventurer"; seed: string; options: AdventurerOptions };

/** 하위 호환: 예전 코드에서 `AVATAR_STYLE_LORELEI` 참조 */
export const AVATAR_STYLE_LORELEI = "lorelei" as const satisfies AvatarStyleId;
