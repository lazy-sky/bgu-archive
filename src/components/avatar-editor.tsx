"use client";

import type { Options as LoreleiOptions } from "@dicebear/lorelei";
import { MemberAvatar } from "@/components/member-avatar";
import type { AvatarConfig } from "@/types/avatar";
import {
  loreleiBeardLabel,
  loreleiGlassesLabel,
  loreleiHeadLabel,
  loreleiMouthLabel,
  loreleiVariantLabel,
} from "@/lib/lorelei-labels";
import { randomAvatarConfig } from "@/lib/random-lorelei-avatar";
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

function hex6FromInput(s: string): string {
  const x = s.trim().replace(/^#/, "");
  if (/^[a-fA-F0-9]{6}$/.test(x)) return x.toLowerCase();
  return "000000";
}

function hexToInput(s: string | undefined): string {
  const x = (s ?? "").replace(/^#/, "");
  if (/^[a-fA-F0-9]{6}$/.test(x)) return `#${x.toLowerCase()}`;
  return "#000000";
}

function firstOr<T extends string>(
  arr: readonly T[] | undefined,
  fallback: T,
): T {
  if (arr && arr.length > 0) return arr[0];
  return fallback;
}

type Props = {
  value: AvatarConfig;
  onChange: (next: AvatarConfig) => void;
  onSaveAvatar?: () => void;
  saveAvatarPending?: boolean;
  saveAvatarError?: unknown;
  saveAvatarSuccess?: boolean;
  seedFallback?: string;
};

export function AvatarEditor({
  value,
  onChange,
  onSaveAvatar,
  saveAvatarPending,
  saveAvatarError,
  saveAvatarSuccess,
  seedFallback,
}: Props) {
  const o = value.options;

  function patchOptions(patch: Partial<LoreleiOptions>) {
    onChange({
      ...value,
      options: { ...value.options, ...patch },
    });
  }

  const sel =
    "mt-1 w-full rounded-lg border border-amber-900/15 bg-white px-2 py-2 text-sm text-amber-950 outline-none focus:ring-2 focus:ring-amber-400/40";

  const glassesOn = (o.glassesProbability ?? 0) >= 50;
  const beardOn = (o.beardProbability ?? 0) >= 50;

  return (
    <fieldset className="min-w-0 rounded-xl border border-amber-900/10 bg-amber-50/40 p-4">
      <legend className="text-sm font-semibold text-amber-950">
        아바타
      </legend>
      <p className="mt-1 text-xs text-amber-800/75">
        회원 목록에 표시되는 캐릭터입니다.
      </p>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-2">
          <MemberAvatar
            config={value}
            size={112}
            seedFallback={seedFallback}
          />
          <span className="text-xs text-amber-800/60">미리보기</span>
          <button
            type="button"
            onClick={() => onChange(randomAvatarConfig())}
            className="rounded-full border border-amber-900/25 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 shadow-sm hover:bg-amber-50"
          >
            랜덤 생성
          </button>
        </div>

        <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-amber-900/80">머리</span>
            <select
              className={sel}
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
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-amber-900/80">얼굴형</span>
            <select
              className={sel}
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
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-amber-900/80">눈</span>
            <select
              className={sel}
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
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-amber-900/80">눈썹</span>
            <select
              className={sel}
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
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-amber-900/80">입</span>
            <select
              className={sel}
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
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-amber-900/80">코</span>
            <select
              className={sel}
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
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-amber-900/80">안경 종류</span>
            <select
              className={sel}
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
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-amber-900/80">수염</span>
            <select
              className={sel}
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
            </select>
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
                className="h-10 w-14 cursor-pointer rounded border border-amber-900/20 bg-white p-0.5"
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
                className="h-10 w-14 cursor-pointer rounded border border-amber-900/20 bg-white p-0.5"
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
      </div>

      {onSaveAvatar ? (
        <div className="mt-4 flex flex-col gap-2 border-t border-amber-900/10 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={onSaveAvatar}
            disabled={saveAvatarPending}
            className="rounded-full border border-amber-900/25 bg-white px-4 py-2 text-sm font-medium text-amber-950 hover:bg-amber-50 disabled:opacity-60"
          >
            {saveAvatarPending ? "저장 중…" : "아바타 저장"}
          </button>
          {saveAvatarSuccess ? (
            <p className="text-sm text-emerald-800" role="status">
              아바타만 저장했습니다. 회원 목록에 반영됩니다.
            </p>
          ) : null}
          {saveAvatarError ? (
            <p className="text-sm text-red-700" role="alert">
              {saveAvatarError instanceof Error
                ? saveAvatarError.message
                : "아바타 저장에 실패했습니다."}
            </p>
          ) : null}
        </div>
      ) : null}
    </fieldset>
  );
}
