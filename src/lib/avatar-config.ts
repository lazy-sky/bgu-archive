import type { Options as AdventurerOptions } from "@dicebear/adventurer";
import type { Options as AvataaarsOptions } from "@dicebear/avataaars";
import type { Options as LoreleiOptions } from "@dicebear/lorelei";
import type { Options as MicahOptions } from "@dicebear/micah";
import type { Options as ThumbsOptions } from "@dicebear/thumbs";
import type { Options as ToonHeadOptions } from "@dicebear/toon-head";
import {
  DEFAULT_ADVENTURER,
  DEFAULT_AVATAAARS,
  DEFAULT_AVATAR,
  DEFAULT_LORELEI,
  DEFAULT_MICAH,
  DEFAULT_THUMBS,
  DEFAULT_TOON_HEAD,
  defaultAvatarForStyle,
  isAvatarStyleId,
} from "@/lib/avatar-defaults";
import type { AvatarConfig, AvatarStyleId } from "@/types/avatar";

export { DEFAULT_AVATAR } from "@/lib/avatar-defaults";

/** 예전 커스텀 SVG 아바타 JSON (hairStyle, topType 등) */
function isLegacyAvatarShape(o: Record<string, unknown>): boolean {
  return (
    "hairStyle" in o ||
    "topType" in o ||
    (typeof o.eyes === "string" && !Array.isArray(o.eyes))
  );
}

function legacySeedFromObject(o: Record<string, unknown>): string {
  const keys = Object.keys(o).sort();
  let s = "";
  for (const k of keys) {
    s += `${k}:${JSON.stringify(o[k])}|`;
  }
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `legacy-${(h >>> 0).toString(36)}`;
}

function migrateLegacyAvatar(
  o: Record<string, unknown>,
): AvatarConfig {
  return mergeAvatarConfig({
    style: "lorelei",
    seed: legacySeedFromObject(o),
    options: {},
  });
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function mergeLoreleiOptions(raw: unknown): LoreleiOptions {
  if (!isPlainObject(raw)) return { ...DEFAULT_LORELEI.options };
  return { ...DEFAULT_LORELEI.options, ...(raw as LoreleiOptions) };
}

function mergeAvataaarsOptions(raw: unknown): AvataaarsOptions {
  if (!isPlainObject(raw)) return { ...DEFAULT_AVATAAARS.options };
  return { ...DEFAULT_AVATAAARS.options, ...(raw as AvataaarsOptions) };
}

function mergeMicahOptions(raw: unknown): MicahOptions {
  if (!isPlainObject(raw)) return { ...DEFAULT_MICAH.options };
  return { ...DEFAULT_MICAH.options, ...(raw as MicahOptions) };
}

function mergeToonHeadOptions(raw: unknown): ToonHeadOptions {
  if (!isPlainObject(raw)) return { ...DEFAULT_TOON_HEAD.options };
  return { ...DEFAULT_TOON_HEAD.options, ...(raw as ToonHeadOptions) };
}

function mergeThumbsOptions(raw: unknown): ThumbsOptions {
  if (!isPlainObject(raw)) return { ...DEFAULT_THUMBS.options };
  return { ...DEFAULT_THUMBS.options, ...(raw as ThumbsOptions) };
}

function mergeAdventurerOptions(raw: unknown): AdventurerOptions {
  if (!isPlainObject(raw)) return { ...DEFAULT_ADVENTURER.options };
  return { ...DEFAULT_ADVENTURER.options, ...(raw as AdventurerOptions) };
}

/** DB/JSON → 안전한 AvatarConfig */
export function parseAvatarConfig(raw: unknown): AvatarConfig {
  if (raw == null || typeof raw !== "object") {
    return defaultAvatarForStyle("thumbs");
  }
  const o = raw as Record<string, unknown>;

  const styleRaw = o.style;
  const seed = typeof o.seed === "string" ? o.seed : "";

  if (isAvatarStyleId(String(styleRaw))) {
    const style = styleRaw as AvatarStyleId;
    switch (style) {
      case "lorelei":
        return mergeAvatarConfig({
          style: "lorelei",
          seed,
          options: mergeLoreleiOptions(o.options),
        });
      case "avataaars":
        return mergeAvatarConfig({
          style: "avataaars",
          seed,
          options: mergeAvataaarsOptions(o.options),
        });
      case "micah":
        return mergeAvatarConfig({
          style: "micah",
          seed,
          options: mergeMicahOptions(o.options),
        });
      case "toon-head":
        return mergeAvatarConfig({
          style: "toon-head",
          seed,
          options: mergeToonHeadOptions(o.options),
        });
      case "thumbs":
        return mergeAvatarConfig({
          style: "thumbs",
          seed,
          options: mergeThumbsOptions(o.options),
        });
      case "adventurer":
        return mergeAvatarConfig({
          style: "adventurer",
          seed,
          options: mergeAdventurerOptions(o.options),
        });
      default: {
        const _e: never = style;
        return _e;
      }
    }
  }

  if (isLegacyAvatarShape(o)) {
    return migrateLegacyAvatar(o);
  }

  return defaultAvatarForStyle("thumbs");
}

/** 저장 시 시드는 저장하지 않음(회원 id로만 렌더 보조) */
export function avatarConfigForSave(cfg: AvatarConfig): AvatarConfig {
  return { ...cfg, seed: "" };
}

export function mergeAvatarConfig(
  partial: Partial<AvatarConfig> | null | undefined,
): AvatarConfig {
  if (!partial?.style) {
    return defaultAvatarForStyle("lorelei");
  }
  const seed = typeof partial.seed === "string" ? partial.seed : "";
  switch (partial.style) {
    case "lorelei":
      return {
        style: "lorelei",
        seed,
        options: {
          ...DEFAULT_LORELEI.options,
          ...((partial as { options?: LoreleiOptions }).options ?? {}),
        },
      };
    case "avataaars":
      return {
        style: "avataaars",
        seed,
        options: {
          ...DEFAULT_AVATAAARS.options,
          ...((partial as { options?: AvataaarsOptions }).options ?? {}),
        },
      };
    case "micah":
      return {
        style: "micah",
        seed,
        options: {
          ...DEFAULT_MICAH.options,
          ...((partial as { options?: MicahOptions }).options ?? {}),
        },
      };
    case "toon-head":
      return {
        style: "toon-head",
        seed,
        options: {
          ...DEFAULT_TOON_HEAD.options,
          ...((partial as { options?: ToonHeadOptions }).options ?? {}),
        },
      };
    case "thumbs":
      return {
        style: "thumbs",
        seed,
        options: {
          ...DEFAULT_THUMBS.options,
          ...((partial as { options?: ThumbsOptions }).options ?? {}),
        },
      };
    case "adventurer":
      return {
        style: "adventurer",
        seed,
        options: {
          ...DEFAULT_ADVENTURER.options,
          ...((partial as { options?: AdventurerOptions }).options ?? {}),
        },
      };
    default:
      return defaultAvatarForStyle("thumbs");
  }
}
