/**
 * DiceBear Lorelei 스키마와 동일한 variant 목록 (UI 셀렉트용)
 * @see node_modules/@dicebear/lorelei/lib/types.d.ts
 */
export const LORELEI_HAIR = [
  "variant48",
  "variant47",
  "variant46",
  "variant45",
  "variant44",
  "variant43",
  "variant42",
  "variant41",
  "variant40",
  "variant39",
  "variant38",
  "variant37",
  "variant36",
  "variant35",
  "variant34",
  "variant33",
  "variant32",
  "variant31",
  "variant30",
  "variant29",
  "variant28",
  "variant27",
  "variant26",
  "variant25",
  "variant24",
  "variant23",
  "variant22",
  "variant21",
  "variant20",
  "variant19",
  "variant18",
  "variant17",
  "variant16",
  "variant15",
  "variant14",
  "variant13",
  "variant12",
  "variant11",
  "variant10",
  "variant09",
  "variant08",
  "variant07",
  "variant06",
  "variant05",
  "variant04",
  "variant03",
  "variant02",
  "variant01",
] as const;

/** variant01 → variant48 순(드롭다운 정렬용) */
export const LORELEI_HAIR_ASC = [...LORELEI_HAIR].reverse();

export const LORELEI_HEAD = [
  "variant04",
  "variant03",
  "variant02",
  "variant01",
] as const;

export const LORELEI_HEAD_ASC = [...LORELEI_HEAD].reverse();

export const LORELEI_EYES = [
  "variant24",
  "variant23",
  "variant22",
  "variant21",
  "variant20",
  "variant19",
  "variant18",
  "variant17",
  "variant16",
  "variant15",
  "variant14",
  "variant13",
  "variant12",
  "variant11",
  "variant10",
  "variant09",
  "variant08",
  "variant07",
  "variant06",
  "variant05",
  "variant04",
  "variant03",
  "variant02",
  "variant01",
] as const;

export const LORELEI_EYES_ASC = [...LORELEI_EYES].reverse();

export const LORELEI_EYEBROWS = [
  "variant13",
  "variant12",
  "variant11",
  "variant10",
  "variant09",
  "variant08",
  "variant07",
  "variant06",
  "variant05",
  "variant04",
  "variant03",
  "variant02",
  "variant01",
] as const;

export const LORELEI_EYEBROWS_ASC = [...LORELEI_EYEBROWS].reverse();

export const LORELEI_NOSE = [
  "variant01",
  "variant02",
  "variant03",
  "variant04",
  "variant05",
  "variant06",
] as const;

export const LORELEI_GLASSES = [
  "variant01",
  "variant02",
  "variant03",
  "variant04",
  "variant05",
] as const;

export const LORELEI_MOUTH = [
  "happy01",
  "happy02",
  "happy03",
  "happy04",
  "happy05",
  "happy06",
  "happy07",
  "happy08",
  "happy18",
  "happy09",
  "happy10",
  "happy11",
  "happy12",
  "happy13",
  "happy14",
  "happy17",
  "happy15",
  "happy16",
  "sad01",
  "sad02",
  "sad03",
  "sad04",
  "sad05",
  "sad06",
  "sad07",
  "sad08",
  "sad09",
] as const;

export const LORELEI_BEARD = ["variant01", "variant02"] as const;

export const LORELEI_EARRINGS = [
  "variant01",
  "variant02",
  "variant03",
] as const;
