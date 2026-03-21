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

/** UI 표시용. 내부 `style` id는 DiceBear 패키지명과 동일 */
export const AVATAR_STYLE_LABELS: Record<AvatarStyleId, string> = {
  /** 엄지손가락 실루엣 스타일 */
  thumbs: "엄지 캐릭터",
  /** 얼굴·헤어 디테일이 많은 인물 일러스트 */
  lorelei: "로렐라이 (상세 인물)",
  /** 둥근 얼굴형의 클래식 카툰 아바타 */
  avataaars: "둥근 카툰",
  /** 단순한 형태의 미니멀 카툰 */
  micah: "심플 카툰",
  /** 머리 비율이 큰 SD 느낌의 툰 */
  "toon-head": "큰 얼굴 툰",
  /** RPG·판타지풍 초상 */
  adventurer: "모험가",
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
