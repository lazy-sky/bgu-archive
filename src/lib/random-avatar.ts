import type { Options as AdventurerOptions } from "@dicebear/adventurer";
import type { Options as AvataaarsOptions } from "@dicebear/avataaars";
import type { Options as LoreleiOptions } from "@dicebear/lorelei";
import type { Options as MicahOptions } from "@dicebear/micah";
import type { Options as ThumbsOptions } from "@dicebear/thumbs";
import type { Options as ToonHeadOptions } from "@dicebear/toon-head";
import {
  DEFAULT_ADVENTURER,
  DEFAULT_AVATAAARS,
  DEFAULT_LORELEI,
  DEFAULT_MICAH,
  DEFAULT_THUMBS,
  DEFAULT_TOON_HEAD,
} from "@/lib/avatar-defaults";
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
import type { AvatarConfig } from "@/types/avatar";

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

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

function randomLoreleiOptions(): LoreleiOptions {
  const glassesOn = Math.random() < 0.38;
  const beardOn = Math.random() < 0.32;
  return {
    ...DEFAULT_LORELEI.options,
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

function randomAvataaarsOptions(): AvataaarsOptions {
  const accOn = Math.random() < 0.35;
  const facialOn = Math.random() < 0.35;
  return {
    ...DEFAULT_AVATAAARS.options,
    top: [pick(AVATAAARS_TOP)],
    eyes: [pick(AVATAAARS_EYES)],
    eyebrows: [pick(AVATAAARS_EYEBROWS)],
    mouth: [pick(AVATAAARS_MOUTH)],
    clothing: [pick(AVATAAARS_CLOTHING)],
    accessories: [pick(AVATAAARS_ACC)],
    accessoriesProbability: accOn ? 100 : 0,
    facialHair: [pick(AVATAAARS_FACIAL)],
    facialHairProbability: facialOn ? 100 : 0,
    clothingGraphic: [pick(AVATAAARS_GRAPHIC)],
    hairColor: [pick(HAIR_PALETTE)],
    skinColor: [pick(SKIN_PALETTE)],
    clothesColor: [pick(["65c9ff", "3c4f5c", "e6e6e6", "ff488e"] as const)],
    accessoriesColor: [pick(["65c9ff", "262e33", "5199e4"] as const)],
    facialHairColor: [pick(HAIR_PALETTE)],
  };
}

const AVATAAARS_TOP = [
  "bob",
  "bun",
  "curly",
  "longButNotTooLong",
  "straight01",
  "shortRound",
  "bigHair",
  "fro",
  "dreads",
] as const;

const AVATAAARS_EYES = [
  "default",
  "happy",
  "surprised",
  "wink",
  "hearts",
  "side",
] as const;

const AVATAAARS_EYEBROWS = [
  "default",
  "defaultNatural",
  "raisedExcited",
  "flatNatural",
  "angryNatural",
] as const;

const AVATAAARS_MOUTH = [
  "smile",
  "serious",
  "twinkle",
  "tongue",
  "grimace",
  "default",
] as const;

const AVATAAARS_CLOTHING = [
  "shirtCrewNeck",
  "hoodie",
  "blazerAndShirt",
  "graphicShirt",
  "overall",
] as const;

const AVATAAARS_ACC = [
  "round",
  "sunglasses",
  "prescription01",
  "wayfarers",
] as const;

const AVATAAARS_FACIAL = [
  "beardMedium",
  "beardLight",
  "moustacheMagnum",
  "moustacheFancy",
] as const;

const AVATAAARS_GRAPHIC = [
  "skull",
  "hola",
  "pizza",
  "bear",
  "bat",
] as const;

function randomMicahOptions(): MicahOptions {
  const gOn = Math.random() < 0.35;
  const eOn = Math.random() < 0.3;
  const fOn = Math.random() < 0.28;
  return {
    ...DEFAULT_MICAH.options,
    hair: [pick(MICAH_HAIR)],
    eyes: [pick(MICAH_EYES)],
    mouth: [pick(MICAH_MOUTH)],
    eyebrows: [pick(MICAH_BROWS)],
    glassesProbability: gOn ? 100 : 0,
    earringsProbability: eOn ? 100 : 0,
    facialHairProbability: fOn ? 100 : 0,
    hairColor: [pick(HAIR_PALETTE)],
    baseColor: [pick(SKIN_PALETTE)],
  };
}

const MICAH_HAIR = [
  "full",
  "pixie",
  "fonze",
  "turban",
  "dannyPhantom",
  "mrT",
] as const;
const MICAH_EYES = ["eyes", "round", "smiling", "smilingShadow"] as const;
const MICAH_MOUTH = [
  "smile",
  "laughing",
  "smirk",
  "frown",
  "surprised",
] as const;
const MICAH_BROWS = ["up", "down", "eyelashesUp"] as const;

function randomToonHeadOptions(): ToonHeadOptions {
  const beardOn = Math.random() < 0.3;
  const rearOn = Math.random() < 0.55;
  return {
    ...DEFAULT_TOON_HEAD.options,
    hair: [pick(TOON_HAIR)],
    eyes: [pick(TOON_EYES)],
    mouth: [pick(TOON_MOUTH)],
    eyebrows: [pick(TOON_BROWS)],
    clothes: [pick(TOON_CLOTHES)],
    beard: [pick(TOON_BEARD)],
    beardProbability: beardOn ? 100 : 0,
    rearHair: [pick(TOON_REAR)],
    rearHairProbability: rearOn ? 100 : 0,
    hairColor: [pick(HAIR_PALETTE)],
    skinColor: [pick(SKIN_PALETTE)],
    clothesColor: [pick(["3b82f6", "64748b", "be185d", "15803d"] as const)],
  };
}

const TOON_HAIR = ["bun", "spiky", "undercut", "sideComed"] as const;
const TOON_EYES = ["happy", "wide", "wink", "humble", "bow"] as const;
const TOON_MOUTH = ["smile", "laugh", "sad", "angry", "agape"] as const;
const TOON_BROWS = ["neutral", "happy", "raised", "angry", "sad"] as const;
const TOON_CLOTHES = [
  "shirt",
  "tShirt",
  "dress",
  "openJacket",
  "turtleNeck",
] as const;
const TOON_BEARD = [
  "chin",
  "fullBeard",
  "moustacheTwirl",
  "longBeard",
  "chinMoustache",
] as const;
const TOON_REAR = ["neckHigh", "longWavy", "shoulderHigh", "longStraight"] as const;

function randomThumbsOptions(): ThumbsOptions {
  return {
    ...DEFAULT_THUMBS.options,
    face: [pick(THUMBS_FACE)],
    mouth: [pick(THUMBS_MOUTH)],
    eyes: [pick(THUMBS_EYES)],
    shapeColor: [pick(["0a5b83", "1c799f", "69d2e7", "f88c49", "f1f4dc"] as const)],
    mouthColor: [pick(["f88c49", "ff5c5c", "ffffff"] as const)],
    eyesColor: [pick(["000000", "1e3a5f"] as const)],
  };
}

const THUMBS_FACE = [
  "variant1",
  "variant2",
  "variant3",
  "variant4",
  "variant5",
] as const;
const THUMBS_MOUTH = [
  "variant1",
  "variant2",
  "variant3",
  "variant4",
  "variant5",
] as const;
const THUMBS_EYES = [
  "variant1W12",
  "variant2W14",
  "variant3W10",
  "variant4W16",
  "variant5W12",
  "variant6W14",
  "variant7W10",
  "variant8W12",
  "variant9W14",
] as const;

const ADVENTURER_HAIR_OPTS = [
  "long01",
  "long05",
  "short01",
  "short05",
  "short10",
  "long12",
  "long20",
  "short19",
  "long18",
  "short15",
] as const;

const ADVENTURER_MOUTH_OPTS = [
  "variant15",
  "variant20",
  "variant08",
  "variant25",
  "variant02",
  "variant12",
  "variant18",
] as const;

function randomAdventurerOptions(): AdventurerOptions {
  const gOn = Math.random() < 0.35;
  const eOn = Math.random() < 0.25;
  const featOn = Math.random() < 0.3;
  return {
    ...DEFAULT_ADVENTURER.options,
    hair: [pick(ADVENTURER_HAIR_OPTS)],
    eyes: [pick(LORELEI_EYES_ASC)],
    eyebrows: [pick(LORELEI_EYEBROWS_ASC)],
    mouth: [pick(ADVENTURER_MOUTH_OPTS)],
    glassesProbability: gOn ? 100 : 0,
    earringsProbability: eOn ? 100 : 0,
    featuresProbability: featOn ? 100 : 0,
    hairColor: [pick(HAIR_PALETTE)],
    skinColor: [pick(SKIN_PALETTE)],
  } as AdventurerOptions;
}

export function randomAvatarConfig(cfg: AvatarConfig): AvatarConfig {
  switch (cfg.style) {
    case "lorelei":
      return { style: "lorelei", seed: "", options: randomLoreleiOptions() };
    case "avataaars":
      return {
        style: "avataaars",
        seed: "",
        options: randomAvataaarsOptions(),
      };
    case "micah":
      return { style: "micah", seed: "", options: randomMicahOptions() };
    case "toon-head":
      return {
        style: "toon-head",
        seed: "",
        options: randomToonHeadOptions(),
      };
    case "thumbs":
      return { style: "thumbs", seed: "", options: randomThumbsOptions() };
    case "adventurer":
      return {
        style: "adventurer",
        seed: "",
        options: randomAdventurerOptions(),
      };
    default: {
      const _e: never = cfg;
      return _e;
    }
  }
}
