"use client";

import type { Options as AdventurerOptions } from "@dicebear/adventurer";
import type { Options as AvataaarsOptions } from "@dicebear/avataaars";
import type { Options as MicahOptions } from "@dicebear/micah";
import type { Options as ThumbsOptions } from "@dicebear/thumbs";
import type { Options as ToonHeadOptions } from "@dicebear/toon-head";
import { Select } from "@/components/ui/select";
import {
  firstOr,
  hex6FromInput,
  hexToInput,
} from "@/lib/avatar-field-utils";
import { loreleiVariantLabel } from "@/lib/lorelei-labels";
import {
  LORELEI_EYEBROWS_ASC,
  LORELEI_EYES_ASC,
} from "@/lib/lorelei-variants";
import type { AvatarConfig } from "@/types/avatar";

/* ─── Avataaars (스키마 enum) ─── */
const AV_TOP = [
  "hat",
  "hijab",
  "turban",
  "winterHat1",
  "winterHat02",
  "winterHat03",
  "winterHat04",
  "bob",
  "bun",
  "curly",
  "curvy",
  "dreads",
  "frida",
  "fro",
  "froBand",
  "longButNotTooLong",
  "miaWallace",
  "shavedSides",
  "straight02",
  "straight01",
  "straightAndStrand",
  "dreads01",
  "dreads02",
  "frizzle",
  "shaggy",
  "shaggyMullet",
  "shortCurly",
  "shortFlat",
  "shortRound",
  "shortWaved",
  "sides",
  "theCaesar",
  "theCaesarAndSidePart",
  "bigHair",
] as const;

const AV_EYES = [
  "closed",
  "cry",
  "default",
  "eyeRoll",
  "happy",
  "hearts",
  "side",
  "squint",
  "surprised",
  "winkWacky",
  "wink",
  "xDizzy",
] as const;

const AV_BROWS = [
  "angryNatural",
  "defaultNatural",
  "flatNatural",
  "frownNatural",
  "raisedExcitedNatural",
  "sadConcernedNatural",
  "unibrowNatural",
  "upDownNatural",
  "angry",
  "default",
  "raisedExcited",
  "sadConcerned",
  "upDown",
] as const;

const AV_MOUTH = [
  "concerned",
  "default",
  "disbelief",
  "eating",
  "grimace",
  "sad",
  "screamOpen",
  "serious",
  "smile",
  "tongue",
  "twinkle",
  "vomit",
] as const;

const AV_CLOTHING = [
  "blazerAndShirt",
  "blazerAndSweater",
  "collarAndSweater",
  "graphicShirt",
  "hoodie",
  "overall",
  "shirtCrewNeck",
  "shirtScoopNeck",
  "shirtVNeck",
] as const;

const AV_ACC = [
  "kurt",
  "prescription01",
  "prescription02",
  "round",
  "sunglasses",
  "wayfarers",
  "eyepatch",
] as const;

const AV_FACIAL = [
  "beardLight",
  "beardMajestic",
  "beardMedium",
  "moustacheFancy",
  "moustacheMagnum",
] as const;

const AV_GRAPHIC = [
  "bat",
  "bear",
  "cumbia",
  "deer",
  "diamond",
  "hola",
  "pizza",
  "resist",
  "skull",
  "skullOutline",
] as const;

type AvProps = {
  value: Extract<AvatarConfig, { style: "avataaars" }>;
  onChange: (next: Extract<AvatarConfig, { style: "avataaars" }>) => void;
};

export function AvatarAvataaarsPanel({ value, onChange }: AvProps) {
  const o = value.options;
  function patch(p: Partial<AvataaarsOptions>) {
    onChange({ ...value, options: { ...value.options, ...p } });
  }
  const accOn = (o.accessoriesProbability ?? 0) >= 50;
  const facialOn = (o.facialHairProbability ?? 0) >= 50;

  return (
    <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="block text-sm sm:col-span-2">
        <span className="text-amber-900/80">헤어 / 모자 (top)</span>
        <Select
          className="mt-1"
          value={firstOr(o.top, "bob")}
          onChange={(e) => patch({ top: [e.target.value as (typeof AV_TOP)[number]] })}
        >
          {AV_TOP.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">눈</span>
        <Select
          className="mt-1"
          value={firstOr(o.eyes, "default")}
          onChange={(e) => patch({ eyes: [e.target.value as (typeof AV_EYES)[number]] })}
        >
          {AV_EYES.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">눈썹</span>
        <Select
          className="mt-1"
          value={firstOr(o.eyebrows, "default")}
          onChange={(e) => patch({ eyebrows: [e.target.value as (typeof AV_BROWS)[number]] })}
        >
          {AV_BROWS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">입</span>
        <Select
          className="mt-1"
          value={firstOr(o.mouth, "smile")}
          onChange={(e) => patch({ mouth: [e.target.value as (typeof AV_MOUTH)[number]] })}
        >
          {AV_MOUTH.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">의상</span>
        <Select
          className="mt-1"
          value={firstOr(o.clothing, "shirtCrewNeck")}
          onChange={(e) =>
            patch({ clothing: [e.target.value as (typeof AV_CLOTHING)[number]] })
          }
        >
          {AV_CLOTHING.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">액세서리</span>
        <Select
          className="mt-1"
          value={firstOr(o.accessories, "round")}
          onChange={(e) => patch({ accessories: [e.target.value as (typeof AV_ACC)[number]] })}
          disabled={!accOn}
        >
          {AV_ACC.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">수염·털</span>
        <Select
          className="mt-1"
          value={firstOr(o.facialHair, "beardMedium")}
          onChange={(e) =>
            patch({ facialHair: [e.target.value as (typeof AV_FACIAL)[number]] })
          }
          disabled={!facialOn}
        >
          {AV_FACIAL.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">그래픽 티 패턴</span>
        <Select
          className="mt-1"
          value={firstOr(o.clothingGraphic, "skull")}
          onChange={(e) =>
            patch({ clothingGraphic: [e.target.value as (typeof AV_GRAPHIC)[number]] })
          }
        >
          {AV_GRAPHIC.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={accOn}
          onChange={(e) =>
            patch({ accessoriesProbability: e.target.checked ? 100 : 0 })
          }
          className="rounded border-amber-900/30"
        />
        액세서리(안경 등) 표시
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={facialOn}
          onChange={(e) =>
            patch({ facialHairProbability: e.target.checked ? 100 : 0 })
          }
          className="rounded border-amber-900/30"
        />
        얼굴 털 표시
      </label>
      <ColorRow
        label="머리 색"
        value={firstOr(o.hairColor, "724133")}
        onChange={(hex) => patch({ hairColor: [hex] })}
        largePreview
      />
      <ColorRow
        label="피부 색"
        value={firstOr(o.skinColor, "fd9841")}
        onChange={(hex) => patch({ skinColor: [hex] })}
        largePreview
      />
      <ColorRow
        label="옷 색"
        value={firstOr(o.clothesColor, "65c9ff")}
        onChange={(hex) => patch({ clothesColor: [hex] })}
      />
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
  largePreview = false,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  /** 데스크톱에서 머리색·피부색 등 스와치를 크게 */
  largePreview?: boolean;
}) {
  const swatchClass = largePreview
    ? "h-10 w-14 cursor-pointer rounded border border-amber-900/20 bg-white p-0.5 sm:h-16 sm:w-28 sm:rounded-lg lg:h-[4.75rem] lg:w-32"
    : "h-10 w-14 cursor-pointer rounded border border-amber-900/20 bg-white p-0.5";
  return (
    <label className="block text-sm">
      <span className="text-amber-900/80">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={hexToInput(value)}
          onChange={(e) => onChange(hex6FromInput(e.target.value))}
          className={swatchClass}
          aria-label={label}
        />
        <input
          type="text"
          value={hexToInput(value)}
          onChange={(e) => onChange(hex6FromInput(e.target.value))}
          className="flex-1 rounded-lg border border-amber-900/15 bg-white px-2 py-2 font-mono text-xs text-amber-950"
          maxLength={7}
        />
      </div>
    </label>
  );
}

/* ─── Micah ─── */
const MI_HAIR = [
  "fonze",
  "mrT",
  "dougFunny",
  "mrClean",
  "dannyPhantom",
  "full",
  "turban",
  "pixie",
] as const;
const MI_EYES = ["eyes", "round", "eyesShadow", "smiling", "smilingShadow"] as const;
const MI_MOUTH = [
  "surprised",
  "laughing",
  "nervous",
  "smile",
  "sad",
  "pucker",
  "frown",
  "smirk",
] as const;
const MI_BROWS = ["up", "down", "eyelashesUp", "eyelashesDown"] as const;
const MI_NOSE = ["curve", "pointed", "tound"] as const;
const MI_EARS = ["attached", "detached"] as const;
const MI_SHIRT = ["open", "crew", "collared"] as const;
const MI_EARR = ["hoop", "stud"] as const;
const MI_GLASSES = ["round", "square"] as const;
const MI_FACIAL = ["beard", "scruff"] as const;

type MicProps = {
  value: Extract<AvatarConfig, { style: "micah" }>;
  onChange: (next: Extract<AvatarConfig, { style: "micah" }>) => void;
};

export function AvatarMicahPanel({ value, onChange }: MicProps) {
  const o = value.options;
  function patch(p: Partial<MicahOptions>) {
    onChange({ ...value, options: { ...value.options, ...p } });
  }
  const gOn = (o.glassesProbability ?? 0) >= 50;
  const eOn = (o.earringsProbability ?? 0) >= 50;
  const fOn = (o.facialHairProbability ?? 0) >= 50;
  const hairOn = (o.hairProbability ?? 0) >= 50;

  return (
    <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={hairOn}
          onChange={(e) =>
            patch({ hairProbability: e.target.checked ? 100 : 0 })
          }
          className="rounded border-amber-900/30"
        />
        머리카락 표시
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">머리 스타일</span>
        <Select
          className="mt-1"
          value={firstOr(o.hair, "full")}
          onChange={(e) => patch({ hair: [e.target.value as (typeof MI_HAIR)[number]] })}
          disabled={!hairOn}
        >
          {MI_HAIR.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">눈</span>
        <Select
          className="mt-1"
          value={firstOr(o.eyes, "eyes")}
          onChange={(e) => patch({ eyes: [e.target.value as (typeof MI_EYES)[number]] })}
        >
          {MI_EYES.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">입</span>
        <Select
          className="mt-1"
          value={firstOr(o.mouth, "smile")}
          onChange={(e) => patch({ mouth: [e.target.value as (typeof MI_MOUTH)[number]] })}
        >
          {MI_MOUTH.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">눈썹</span>
        <Select
          className="mt-1"
          value={firstOr(o.eyebrows, "up")}
          onChange={(e) => patch({ eyebrows: [e.target.value as (typeof MI_BROWS)[number]] })}
        >
          {MI_BROWS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">코</span>
        <Select
          className="mt-1"
          value={firstOr(o.nose, "curve")}
          onChange={(e) => patch({ nose: [e.target.value as (typeof MI_NOSE)[number]] })}
        >
          {MI_NOSE.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">귀</span>
        <Select
          className="mt-1"
          value={firstOr(o.ears, "attached")}
          onChange={(e) => patch({ ears: [e.target.value as (typeof MI_EARS)[number]] })}
        >
          {MI_EARS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">셔츠</span>
        <Select
          className="mt-1"
          value={firstOr(o.shirt, "crew")}
          onChange={(e) => patch({ shirt: [e.target.value as (typeof MI_SHIRT)[number]] })}
        >
          {MI_SHIRT.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">귀걸이</span>
        <Select
          className="mt-1"
          value={firstOr(o.earrings, "hoop")}
          onChange={(e) => patch({ earrings: [e.target.value as (typeof MI_EARR)[number]] })}
          disabled={!eOn}
        >
          {MI_EARR.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">안경</span>
        <Select
          className="mt-1"
          value={firstOr(o.glasses, "round")}
          onChange={(e) => patch({ glasses: [e.target.value as (typeof MI_GLASSES)[number]] })}
          disabled={!gOn}
        >
          {MI_GLASSES.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">수염</span>
        <Select
          className="mt-1"
          value={firstOr(o.facialHair, "beard")}
          onChange={(e) => patch({ facialHair: [e.target.value as (typeof MI_FACIAL)[number]] })}
          disabled={!fOn}
        >
          {MI_FACIAL.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={gOn}
          onChange={(e) =>
            patch({ glassesProbability: e.target.checked ? 100 : 0 })
          }
          className="rounded border-amber-900/30"
        />
        안경
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={eOn}
          onChange={(e) =>
            patch({ earringsProbability: e.target.checked ? 100 : 0 })
          }
          className="rounded border-amber-900/30"
        />
        귀걸이
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={fOn}
          onChange={(e) =>
            patch({ facialHairProbability: e.target.checked ? 100 : 0 })
          }
          className="rounded border-amber-900/30"
        />
        잔털·수염
      </label>
      <ColorRow
        label="피부(베이스)"
        value={firstOr(o.baseColor, "f9c9b6")}
        onChange={(hex) => patch({ baseColor: [hex] })}
        largePreview
      />
      <ColorRow
        label="머리 색"
        value={firstOr(o.hairColor, "4a3728")}
        onChange={(hex) => patch({ hairColor: [hex] })}
        largePreview
      />
      <ColorRow
        label="셔츠 색"
        value={firstOr(o.shirtColor, "65c9ff")}
        onChange={(hex) => patch({ shirtColor: [hex] })}
      />
    </div>
  );
}

/* ─── Toon Head ─── */
const TH_REAR = [
  "longStraight",
  "longWavy",
  "shoulderHigh",
  "neckHigh",
] as const;
const TH_CLOTHES = ["turtleNeck", "openJacket", "dress", "shirt", "tShirt"] as const;
const TH_MOUTH = ["laugh", "angry", "agape", "smile", "sad"] as const;
const TH_BEARD = [
  "moustacheTwirl",
  "fullBeard",
  "chin",
  "chinMoustache",
  "longBeard",
] as const;
const TH_EYES = ["happy", "wide", "bow", "humble", "wink"] as const;
const TH_BROWS = ["raised", "angry", "happy", "sad", "neutral"] as const;
const TH_HAIR = ["sideComed", "undercut", "spiky", "bun"] as const;

type ToonProps = {
  value: Extract<AvatarConfig, { style: "toon-head" }>;
  onChange: (next: Extract<AvatarConfig, { style: "toon-head" }>) => void;
};

export function AvatarToonHeadPanel({ value, onChange }: ToonProps) {
  const o = value.options;
  function patch(p: Partial<ToonHeadOptions>) {
    onChange({ ...value, options: { ...value.options, ...p } });
  }
  const rearOn = (o.rearHairProbability ?? 0) >= 50;
  const beardOn = (o.beardProbability ?? 0) >= 50;
  const hairOn = (o.hairProbability ?? 0) >= 50;

  return (
    <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="block text-sm">
        <span className="text-amber-900/80">의상</span>
        <Select
          className="mt-1"
          value={firstOr(o.clothes, "shirt")}
          onChange={(e) =>
            patch({ clothes: [e.target.value as (typeof TH_CLOTHES)[number]] })
          }
        >
          {TH_CLOTHES.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">입</span>
        <Select
          className="mt-1"
          value={firstOr(o.mouth, "smile")}
          onChange={(e) => patch({ mouth: [e.target.value as (typeof TH_MOUTH)[number]] })}
        >
          {TH_MOUTH.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">눈</span>
        <Select
          className="mt-1"
          value={firstOr(o.eyes, "happy")}
          onChange={(e) => patch({ eyes: [e.target.value as (typeof TH_EYES)[number]] })}
        >
          {TH_EYES.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">눈썹</span>
        <Select
          className="mt-1"
          value={firstOr(o.eyebrows, "neutral")}
          onChange={(e) => patch({ eyebrows: [e.target.value as (typeof TH_BROWS)[number]] })}
        >
          {TH_BROWS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">앞머리·스타일</span>
        <Select
          className="mt-1"
          value={firstOr(o.hair, "bun")}
          onChange={(e) => patch({ hair: [e.target.value as (typeof TH_HAIR)[number]] })}
          disabled={!hairOn}
        >
          {TH_HAIR.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">뒷머리</span>
        <Select
          className="mt-1"
          value={firstOr(o.rearHair, "neckHigh")}
          onChange={(e) => patch({ rearHair: [e.target.value as (typeof TH_REAR)[number]] })}
          disabled={!rearOn}
        >
          {TH_REAR.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">수염 스타일</span>
        <Select
          className="mt-1"
          value={firstOr(o.beard, "chin")}
          onChange={(e) => patch({ beard: [e.target.value as (typeof TH_BEARD)[number]] })}
          disabled={!beardOn}
        >
          {TH_BEARD.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={hairOn}
          onChange={(e) =>
            patch({ hairProbability: e.target.checked ? 100 : 0 })
          }
          className="rounded border-amber-900/30"
        />
        앞머리 헤어 표시
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={rearOn}
          onChange={(e) =>
            patch({ rearHairProbability: e.target.checked ? 100 : 0 })
          }
          className="rounded border-amber-900/30"
        />
        뒷머리 표시
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={beardOn}
          onChange={(e) =>
            patch({ beardProbability: e.target.checked ? 100 : 0 })
          }
          className="rounded border-amber-900/30"
        />
        수염
      </label>
      <ColorRow
        label="피부"
        value={firstOr(o.skinColor, "f5c9a8")}
        onChange={(hex) => patch({ skinColor: [hex] })}
        largePreview
      />
      <ColorRow
        label="머리 색"
        value={firstOr(o.hairColor, "4a3728")}
        onChange={(hex) => patch({ hairColor: [hex] })}
        largePreview
      />
      <ColorRow
        label="옷 색"
        value={firstOr(o.clothesColor, "3b82f6")}
        onChange={(hex) => patch({ clothesColor: [hex] })}
      />
    </div>
  );
}

/* ─── Thumbs ─── */
const THB_FACE = [
  "variant1",
  "variant2",
  "variant3",
  "variant5",
  "variant4",
] as const;
const THB_MOUTH = [
  "variant2",
  "variant1",
  "variant3",
  "variant4",
  "variant5",
] as const;

/** 일부만 (전체는 매우 많음) */
const THB_EYES = [
  "variant1W10",
  "variant1W12",
  "variant1W14",
  "variant2W10",
  "variant3W12",
  "variant4W14",
  "variant5W10",
  "variant6W12",
  "variant7W14",
  "variant8W12",
  "variant9W14",
] as const;

type ThumbsProps = {
  value: Extract<AvatarConfig, { style: "thumbs" }>;
  onChange: (next: Extract<AvatarConfig, { style: "thumbs" }>) => void;
};

export function AvatarThumbsPanel({ value, onChange }: ThumbsProps) {
  const o = value.options;
  function patch(p: Partial<ThumbsOptions>) {
    onChange({ ...value, options: { ...value.options, ...p } });
  }

  return (
    <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="block text-sm">
        <span className="text-amber-900/80">얼굴 형태</span>
        <Select
          className="mt-1"
          value={firstOr(o.face, "variant1")}
          onChange={(e) => patch({ face: [e.target.value as (typeof THB_FACE)[number]] })}
        >
          {THB_FACE.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">입</span>
        <Select
          className="mt-1"
          value={firstOr(o.mouth, "variant1")}
          onChange={(e) => patch({ mouth: [e.target.value as (typeof THB_MOUTH)[number]] })}
        >
          {THB_MOUTH.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm sm:col-span-2">
        <span className="text-amber-900/80">눈 (일부 옵션)</span>
        <Select
          className="mt-1"
          value={firstOr(o.eyes, "variant1W12")}
          onChange={(e) => patch({ eyes: [e.target.value as (typeof THB_EYES)[number]] })}
        >
          {THB_EYES.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <ColorRow
        label="손·외곽 색"
        value={firstOr(o.shapeColor, "0a5b83")}
        onChange={(hex) => patch({ shapeColor: [hex] })}
      />
      <ColorRow
        label="입 색"
        value={firstOr(o.mouthColor, "f88c49")}
        onChange={(hex) => patch({ mouthColor: [hex] })}
      />
      <ColorRow
        label="눈 색"
        value={firstOr(o.eyesColor, "000000")}
        onChange={(hex) => patch({ eyesColor: [hex] })}
      />
    </div>
  );
}

/* ─── Adventurer ─── */
const AD_HAIR = [
  "short16",
  "short15",
  "short10",
  "short01",
  "long01",
  "long12",
  "long20",
  "long05",
  "short19",
  "long18",
] as const;

const AD_MOUTH = [
  "variant30",
  "variant25",
  "variant20",
  "variant15",
  "variant10",
  "variant05",
  "variant01",
] as const;

const AD_GLASSES = [
  "variant01",
  "variant02",
  "variant03",
  "variant04",
  "variant05",
] as const;

const AD_EARR = [
  "variant06",
  "variant01",
  "variant02",
  "variant03",
  "variant04",
  "variant05",
] as const;

const AD_FEAT = ["mustache", "blush", "birthmark", "freckles"] as const;

type AdvProps = {
  value: Extract<AvatarConfig, { style: "adventurer" }>;
  onChange: (next: Extract<AvatarConfig, { style: "adventurer" }>) => void;
};

export function AvatarAdventurerPanel({ value, onChange }: AdvProps) {
  const o = value.options;
  function patch(p: Partial<AdventurerOptions>) {
    onChange({ ...value, options: { ...value.options, ...p } });
  }
  const gOn = (o.glassesProbability ?? 0) >= 50;
  const eOn = (o.earringsProbability ?? 0) >= 50;
  const featOn = (o.featuresProbability ?? 0) >= 50;
  const hairOn = (o.hairProbability ?? 0) >= 50;

  return (
    <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={hairOn}
          onChange={(e) =>
            patch({ hairProbability: e.target.checked ? 100 : 0 })
          }
          className="rounded border-amber-900/30"
        />
        머리 표시
      </label>
      <label className="block text-sm sm:col-span-2">
        <span className="text-amber-900/80">머리</span>
        <Select
          className="mt-1"
          value={firstOr(o.hair, "long01")}
          onChange={(e) => patch({ hair: [e.target.value as (typeof AD_HAIR)[number]] })}
          disabled={!hairOn}
        >
          {AD_HAIR.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">눈</span>
        <Select
          className="mt-1"
          value={firstOr(o.eyes, "variant12")}
          onChange={(e) =>
            patch({
              eyes: [e.target.value as NonNullable<AdventurerOptions["eyes"]>[number]],
            })
          }
        >
          {LORELEI_EYES_ASC.map((k) => (
            <option key={k} value={k}>
              {loreleiVariantLabel("눈", k)}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">눈썹</span>
        <Select
          className="mt-1"
          value={firstOr(o.eyebrows, "variant06")}
          onChange={(e) =>
            patch({
              eyebrows: [e.target.value as NonNullable<AdventurerOptions["eyebrows"]>[number]],
            })
          }
        >
          {LORELEI_EYEBROWS_ASC.map((k) => (
            <option key={k} value={k}>
              {loreleiVariantLabel("눈썹", k)}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm sm:col-span-2">
        <span className="text-amber-900/80">입</span>
        <Select
          className="mt-1"
          value={firstOr(o.mouth, "variant15")}
          onChange={(e) => patch({ mouth: [e.target.value as (typeof AD_MOUTH)[number]] })}
        >
          {AD_MOUTH.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">안경</span>
        <Select
          className="mt-1"
          value={firstOr(o.glasses, "variant01")}
          onChange={(e) => patch({ glasses: [e.target.value as (typeof AD_GLASSES)[number]] })}
          disabled={!gOn}
        >
          {AD_GLASSES.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/80">귀걸이</span>
        <Select
          className="mt-1"
          value={firstOr(o.earrings, "variant01")}
          onChange={(e) => patch({ earrings: [e.target.value as (typeof AD_EARR)[number]] })}
          disabled={!eOn}
        >
          {AD_EARR.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm sm:col-span-2">
        <span className="text-amber-900/80">얼굴 특징</span>
        <Select
          className="mt-1"
          value={firstOr(o.features, "freckles")}
          onChange={(e) =>
            patch({ features: [e.target.value as (typeof AD_FEAT)[number]] })
          }
          disabled={!featOn}
        >
          {AD_FEAT.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={gOn}
          onChange={(e) =>
            patch({ glassesProbability: e.target.checked ? 100 : 0 })
          }
          className="rounded border-amber-900/30"
        />
        안경
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={eOn}
          onChange={(e) =>
            patch({ earringsProbability: e.target.checked ? 100 : 0 })
          }
          className="rounded border-amber-900/30"
        />
        귀걸이
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={featOn}
          onChange={(e) =>
            patch({ featuresProbability: e.target.checked ? 100 : 0 })
          }
          className="rounded border-amber-900/30"
        />
        얼굴 특징(주근깨 등)
      </label>
      <ColorRow
        label="피부"
        value={firstOr(o.skinColor, "f5c9a8")}
        onChange={(hex) => patch({ skinColor: [hex] })}
        largePreview
      />
      <ColorRow
        label="머리 색"
        value={firstOr(o.hairColor, "4a3728")}
        onChange={(hex) => patch({ hairColor: [hex] })}
        largePreview
      />
    </div>
  );
}
