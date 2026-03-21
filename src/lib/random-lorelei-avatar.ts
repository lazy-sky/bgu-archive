import type { Options as LoreleiOptions } from "@dicebear/lorelei";
import { DEFAULT_AVATAR } from "@/lib/avatar-config";
import type { AvatarConfig } from "@/types/avatar";
import { AVATAR_STYLE_LORELEI } from "@/types/avatar";
import {
  LORELEI_BEARD,
  LORELEI_EYEBROWS_ASC,
  LORELEI_EYES_ASC,
  LORELEI_GLASSES,
  LORELEI_HAIR_ASC,
  LORELEI_HEAD_ASC,
  LORELEI_MOUTH,
  LORELEI_NOSE,
} from "@/lib/lorelei-variants";

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/** 자연스러운 머리·피부 톤 (완전 무작위 hex보다 낫게) */
const HAIR_PALETTE = [
  "1a1a1a",
  "2d1b0e",
  "4a3728",
  "5c4033",
  "6b4423",
  "8b4513",
  "3d2914",
  "6d4c41",
] as const;

const SKIN_PALETTE = [
  "ffdfc4",
  "f5c9a8",
  "e8c4a8",
  "d4a574",
  "c68642",
  "8d5524",
  "f0d5b8",
  "ead4c4",
] as const;

export function randomLoreleiOptions(): LoreleiOptions {
  const glassesOn = Math.random() < 0.38;
  const beardOn = Math.random() < 0.32;
  return {
    ...DEFAULT_AVATAR.options,
    hair: [pick(LORELEI_HAIR_ASC)],
    head: [pick(LORELEI_HEAD_ASC)],
    eyes: [pick(LORELEI_EYES_ASC)],
    eyebrows: [pick(LORELEI_EYEBROWS_ASC)],
    mouth: [pick(LORELEI_MOUTH)],
    nose: [pick(LORELEI_NOSE)],
    glasses: [pick(LORELEI_GLASSES)],
    glassesProbability: glassesOn ? 100 : 0,
    beard: [pick(LORELEI_BEARD)],
    beardProbability: beardOn ? 100 : 0,
    hairColor: [pick(HAIR_PALETTE)],
    skinColor: [pick(SKIN_PALETTE)],
  };
}

export function randomAvatarConfig(): AvatarConfig {
  return {
    style: AVATAR_STYLE_LORELEI,
    seed: "",
    options: randomLoreleiOptions(),
  };
}
