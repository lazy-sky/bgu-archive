import type { AvatarConfig, AvatarStyleId } from "@/types/avatar";

export const DEFAULT_LORELEI: Extract<AvatarConfig, { style: "lorelei" }> = {
  style: "lorelei",
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

export const DEFAULT_AVATAAARS: Extract<AvatarConfig, { style: "avataaars" }> = {
  style: "avataaars",
  seed: "",
  options: {
    style: ["default"],
    base: ["default"],
    top: ["bob"],
    topProbability: 100,
    eyes: ["default"],
    eyebrows: ["default"],
    mouth: ["smile"],
    nose: ["default"],
    clothing: ["shirtCrewNeck"],
    facialHair: ["beardMedium"],
    facialHairProbability: 0,
    accessories: ["round"],
    accessoriesProbability: 0,
    clothingGraphic: ["skull"],
    hairColor: ["724133"],
    skinColor: ["fd9841"],
    clothesColor: ["65c9ff"],
    accessoriesColor: ["65c9ff"],
    facialHairColor: ["724133"],
    hatColor: ["65c9ff"],
  },
};

export const DEFAULT_MICAH: Extract<AvatarConfig, { style: "micah" }> = {
  style: "micah",
  seed: "",
  options: {
    base: ["standard"],
    mouth: ["smile"],
    eyebrows: ["up"],
    hair: ["full"],
    hairProbability: 100,
    eyes: ["eyes"],
    nose: ["curve"],
    ears: ["attached"],
    shirt: ["crew"],
    earrings: ["hoop"],
    earringsProbability: 0,
    glasses: ["round"],
    glassesProbability: 0,
    facialHair: ["beard"],
    facialHairProbability: 0,
    baseColor: ["f9c9b6"],
    hairColor: ["4a3728"],
    eyebrowsColor: ["000000"],
    eyesColor: ["000000"],
    mouthColor: ["a1624a"],
    shirtColor: ["65c9ff"],
    earringColor: ["000000"],
    glassesColor: ["1e293b"],
    facialHairColor: ["4a3728"],
    eyeShadowColor: ["d2eff3"],
  },
};

export const DEFAULT_TOON_HEAD: Extract<AvatarConfig, { style: "toon-head" }> = {
  style: "toon-head",
  seed: "",
  options: {
    body: ["body"],
    head: ["head"],
    clothes: ["shirt"],
    mouth: ["smile"],
    eyes: ["happy"],
    eyebrows: ["neutral"],
    hair: ["bun"],
    hairProbability: 100,
    beard: ["chin"],
    beardProbability: 0,
    rearHair: ["neckHigh"],
    rearHairProbability: 100,
    skinColor: ["f5c9a8"],
    hairColor: ["4a3728"],
    clothesColor: ["3b82f6"],
  },
};

export const DEFAULT_THUMBS: Extract<AvatarConfig, { style: "thumbs" }> = {
  style: "thumbs",
  seed: "",
  options: {
    shape: ["default"],
    shapeRotation: [0],
    shapeOffsetX: [0],
    shapeOffsetY: [0],
    face: ["variant1"],
    faceRotation: [0],
    faceOffsetX: [0],
    faceOffsetY: [0],
    eyes: ["variant1W12"],
    mouth: ["variant1"],
    backgroundColor: ["transparent"],
    shapeColor: ["0a5b83"],
    mouthColor: ["f88c49"],
    eyesColor: ["000000"],
  },
};

export const DEFAULT_ADVENTURER: Extract<AvatarConfig, { style: "adventurer" }> = {
  style: "adventurer",
  seed: "",
  options: {
    base: ["default"],
    hair: ["long01"],
    hairProbability: 100,
    eyes: ["variant12"],
    eyebrows: ["variant06"],
    mouth: ["variant15"],
    glasses: ["variant01"],
    glassesProbability: 0,
    earrings: ["variant01"],
    earringsProbability: 0,
    features: ["freckles"],
    featuresProbability: 0,
    skinColor: ["f5c9a8"],
    hairColor: ["4a3728"],
  },
};

/** 앱·빈 프로필 기본 스타일 */
export const DEFAULT_AVATAR: AvatarConfig = DEFAULT_THUMBS;

export function defaultAvatarForStyle(style: AvatarStyleId): AvatarConfig {
  switch (style) {
    case "lorelei":
      return {
        ...DEFAULT_LORELEI,
        options: { ...DEFAULT_LORELEI.options },
      };
    case "avataaars":
      return {
        ...DEFAULT_AVATAAARS,
        options: { ...DEFAULT_AVATAAARS.options },
      };
    case "micah":
      return { ...DEFAULT_MICAH, options: { ...DEFAULT_MICAH.options } };
    case "toon-head":
      return {
        ...DEFAULT_TOON_HEAD,
        options: { ...DEFAULT_TOON_HEAD.options },
      };
    case "thumbs":
      return { ...DEFAULT_THUMBS, options: { ...DEFAULT_THUMBS.options } };
    case "adventurer":
      return {
        ...DEFAULT_ADVENTURER,
        options: { ...DEFAULT_ADVENTURER.options },
      };
    default: {
      const _exhaustive: never = style;
      return _exhaustive;
    }
  }
}

export function isAvatarStyleId(s: string): s is AvatarStyleId {
  return (
    s === "lorelei" ||
    s === "avataaars" ||
    s === "micah" ||
    s === "toon-head" ||
    s === "thumbs" ||
    s === "adventurer"
  );
}
