"use client";

import type { Options as LoreleiOptions } from "@dicebear/lorelei";
import {
  loreleiBeardLabel,
  loreleiGlassesLabel,
  loreleiHeadLabel,
  loreleiMouthLabel,
  loreleiVariantLabel,
} from "@/lib/lorelei-labels";
import { Select } from "@/components/ui/select";
import {
  firstOr,
  hex6FromInput,
  hexToInput,
} from "@/lib/avatar-field-utils";
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

type Props = {
  value: Extract<AvatarConfig, { style: "lorelei" }>;
  onChange: (next: Extract<AvatarConfig, { style: "lorelei" }>) => void;
};

export function AvatarLoreleiPanel({ value, onChange }: Props) {
  const o = value.options;

  function patchOptions(patch: Partial<LoreleiOptions>) {
    onChange({
      ...value,
      options: { ...value.options, ...patch },
    });
  }

  const glassesOn = (o.glassesProbability ?? 0) >= 50;
  const beardOn = (o.beardProbability ?? 0) >= 50;

  return (
    <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="block text-sm">
        <span className="text-amber-900/80">머리</span>
        <Select
          className="mt-1"
          value={firstOr(o.hair, "variant24")}
          onChange={(e) =>
            patchOptions({
              hair: [e.target.value as LoreleiOptions["hair"] extends (infer U)[] | undefined ? U : never],
            })
          }
        >
          {LORELEI_HAIR_ASC.map((k) => (
            <option key={k} value={k}>
              {loreleiVariantLabel("머리", k)}
            </option>
          ))}
        </Select>
      </label>

      <label className="block text-sm">
        <span className="text-amber-900/80">얼굴형</span>
        <Select
          className="mt-1"
          value={firstOr(o.head, "variant02")}
          onChange={(e) =>
            patchOptions({
              head: [e.target.value as LoreleiOptions["head"] extends (infer U)[] | undefined ? U : never],
            })
          }
        >
          {LORELEI_HEAD_ASC.map((k) => (
            <option key={k} value={k}>
              {loreleiHeadLabel(k)}
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
            patchOptions({
              eyes: [e.target.value as LoreleiOptions["eyes"] extends (infer U)[] | undefined ? U : never],
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
            patchOptions({
              eyebrows: [e.target.value as LoreleiOptions["eyebrows"] extends (infer U)[] | undefined ? U : never],
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

      <label className="block text-sm">
        <span className="text-amber-900/80">입</span>
        <Select
          className="mt-1"
          value={firstOr(o.mouth, "happy01")}
          onChange={(e) =>
            patchOptions({
              mouth: [e.target.value as LoreleiOptions["mouth"] extends (infer U)[] | undefined ? U : never],
            })
          }
        >
          {LORELEI_MOUTH.map((k) => (
            <option key={k} value={k}>
              {loreleiMouthLabel(k)}
            </option>
          ))}
        </Select>
      </label>

      <label className="block text-sm">
        <span className="text-amber-900/80">코</span>
        <Select
          className="mt-1"
          value={firstOr(o.nose, "variant03")}
          onChange={(e) =>
            patchOptions({
              nose: [e.target.value as LoreleiOptions["nose"] extends (infer U)[] | undefined ? U : never],
            })
          }
        >
          {LORELEI_NOSE.map((k) => (
            <option key={k} value={k}>
              {loreleiVariantLabel("코", k)}
            </option>
          ))}
        </Select>
      </label>

      <label className="block text-sm">
        <span className="text-amber-900/80">안경 종류</span>
        <Select
          className="mt-1"
          value={firstOr(o.glasses, "variant01")}
          onChange={(e) =>
            patchOptions({
              glasses: [e.target.value as LoreleiOptions["glasses"] extends (infer U)[] | undefined ? U : never],
            })
          }
          disabled={!glassesOn}
        >
          {LORELEI_GLASSES.map((k) => (
            <option key={k} value={k}>
              {loreleiGlassesLabel(k)}
            </option>
          ))}
        </Select>
      </label>

      <label className="block text-sm">
        <span className="text-amber-900/80">수염</span>
        <Select
          className="mt-1"
          value={firstOr(o.beard, "variant01")}
          onChange={(e) =>
            patchOptions({
              beard: [e.target.value as LoreleiOptions["beard"] extends (infer U)[] | undefined ? U : never],
            })
          }
          disabled={!beardOn}
        >
          {LORELEI_BEARD.map((k) => (
            <option key={k} value={k}>
              {loreleiBeardLabel(k)}
            </option>
          ))}
        </Select>
      </label>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={glassesOn}
          onChange={(e) =>
            patchOptions({
              glassesProbability: e.target.checked ? 100 : 0,
            })
          }
          className="rounded border-amber-900/30"
        />
        안경 쓰기
      </label>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-950 sm:col-span-2">
        <input
          type="checkbox"
          checked={beardOn}
          onChange={(e) =>
            patchOptions({
              beardProbability: e.target.checked ? 100 : 0,
            })
          }
          className="rounded border-amber-900/30"
        />
        수염
      </label>

      <label className="block text-sm">
        <span className="text-amber-900/80">머리 색</span>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="color"
            value={hexToInput(firstOr(o.hairColor, "4a3728"))}
            onChange={(e) =>
              patchOptions({ hairColor: [hex6FromInput(e.target.value)] })
            }
            className="h-10 w-14 cursor-pointer rounded border border-amber-900/20 bg-white p-0.5 sm:h-16 sm:w-28 sm:rounded-lg lg:h-[4.75rem] lg:w-32"
            aria-label="머리 색"
          />
          <input
            type="text"
            value={hexToInput(firstOr(o.hairColor, "4a3728"))}
            onChange={(e) =>
              patchOptions({ hairColor: [hex6FromInput(e.target.value)] })
            }
            className="flex-1 rounded-lg border border-amber-900/15 bg-white px-2 py-2 font-mono text-xs text-amber-950"
            maxLength={7}
          />
        </div>
      </label>

      <label className="block text-sm">
        <span className="text-amber-900/80">피부 색</span>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="color"
            value={hexToInput(firstOr(o.skinColor, "f5c9a8"))}
            onChange={(e) =>
              patchOptions({ skinColor: [hex6FromInput(e.target.value)] })
            }
            className="h-10 w-14 cursor-pointer rounded border border-amber-900/20 bg-white p-0.5 sm:h-16 sm:w-28 sm:rounded-lg lg:h-[4.75rem] lg:w-32"
            aria-label="피부 색"
          />
          <input
            type="text"
            value={hexToInput(firstOr(o.skinColor, "f5c9a8"))}
            onChange={(e) =>
              patchOptions({ skinColor: [hex6FromInput(e.target.value)] })
            }
            className="flex-1 rounded-lg border border-amber-900/15 bg-white px-2 py-2 font-mono text-xs text-amber-950"
            maxLength={7}
          />
        </div>
      </label>
    </div>
  );
}
