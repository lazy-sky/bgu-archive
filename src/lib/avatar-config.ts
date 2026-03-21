import type { Options as LoreleiOptions } from "@dicebear/lorelei";
import type { AvatarConfig } from "@/types/avatar";
import { AVATAR_STYLE_LORELEI } from "@/types/avatar";

export const DEFAULT_AVATAR: AvatarConfig = {
  style: AVATAR_STYLE_LORELEI,
  seed: "",
  options: {
    hair: ["variant24"],
    head: ["variant02"],
    eyes: ["variant12"],
    eyebrows: ["variant06"],
    mouth: ["happy01"],
    nose: ["variant03"],
    glasses: ["variant01"],
    glassesProbability: 0,
    beard: ["variant01"],
    beardProbability: 0,
    earrings: ["variant01"],
    earringsProbability: 0,
    freckles: ["variant01"],
    frecklesProbability: 0,
    hairAccessories: ["flowers"],
    hairAccessoriesProbability: 0,
    hairColor: ["4a3728"],
    skinColor: ["f5c9a8"],
    eyebrowsColor: ["2d1f14"],
    eyesColor: ["000000"],
    mouthColor: ["a1624a"],
    noseColor: ["c49a7c"],
    glassesColor: ["1e293b"],
    earringsColor: ["000000"],
    frecklesColor: ["000000"],
    hairAccessoriesColor: ["000000"],
  },
};

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
    style: AVATAR_STYLE_LORELEI,
    seed: legacySeedFromObject(o),
    options: {},
  });
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/** DB에서 온 options를 기본값과 병합 */
function mergeLoreleiOptions(raw: unknown): LoreleiOptions {
  if (!isPlainObject(raw)) return { ...DEFAULT_AVATAR.options };
  return { ...DEFAULT_AVATAR.options, ...(raw as LoreleiOptions) };
}

/** DB/JSON → 안전한 AvatarConfig */
export function parseAvatarConfig(raw: unknown): AvatarConfig {
  if (raw == null || typeof raw !== "object") {
    return { ...DEFAULT_AVATAR, options: { ...DEFAULT_AVATAR.options } };
  }
  const o = raw as Record<string, unknown>;

  if (o.style === AVATAR_STYLE_LORELEI && typeof o.seed === "string") {
    return mergeAvatarConfig({
      style: AVATAR_STYLE_LORELEI,
      seed: o.seed,
      options: mergeLoreleiOptions(o.options),
    });
  }

  if (isLegacyAvatarShape(o)) {
    return migrateLegacyAvatar(o);
  }

  return { ...DEFAULT_AVATAR, options: { ...DEFAULT_AVATAR.options } };
}

/** 저장 시 시드는 저장하지 않음(회원 id로만 렌더 보조) */
export function avatarConfigForSave(cfg: AvatarConfig): AvatarConfig {
  return { ...cfg, seed: "" };
}

export function mergeAvatarConfig(
  partial: Partial<AvatarConfig> | null | undefined,
): AvatarConfig {
  const base = DEFAULT_AVATAR;
  if (!partial || partial.style !== AVATAR_STYLE_LORELEI) {
    return { ...base, options: { ...base.options } };
  }
  return {
    style: AVATAR_STYLE_LORELEI,
    seed: typeof partial.seed === "string" ? partial.seed : base.seed,
    options: {
      ...base.options,
      ...(partial.options ?? {}),
    },
  };
}
