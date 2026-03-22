"use client";

import {
  AvatarAdventurerPanel,
  AvatarAvataaarsPanel,
  AvatarMicahPanel,
  AvatarThumbsPanel,
  AvatarToonHeadPanel,
} from "@/components/avatar-dicebear-extra-panels";
import { AvatarLoreleiPanel } from "@/components/avatar-lorelei-panel";
import { MemberAvatar } from "@/components/member-avatar";
import { defaultAvatarForStyle } from "@/lib/avatar-defaults";
import { randomAvatarConfig } from "@/lib/random-avatar";
import { Select } from "@/components/ui/select";
import {
  AVATAR_STYLE_LABELS,
  AVATAR_STYLES,
  type AvatarConfig,
  type AvatarStyleId,
} from "@/types/avatar";
import Link from "next/link";

type Props = {
  value: AvatarConfig;
  onChange: (next: AvatarConfig) => void;
  onSaveAvatar?: () => void;
  saveAvatarPending?: boolean;
  saveAvatarError?: unknown;
  saveAvatarSuccess?: boolean;
  seedFallback?: string;
  /** false면 로렐라이 선택 시 후원 안내 표시(저장 제한은 프로필에서 처리) */
  loreleiSaveAllowed?: boolean;
};

export function AvatarEditor({
  value,
  onChange,
  onSaveAvatar,
  saveAvatarPending,
  saveAvatarError,
  saveAvatarSuccess,
  seedFallback,
  loreleiSaveAllowed = true,
}: Props) {
  function setStyle(next: AvatarStyleId) {
    if (next === value.style) return;
    onChange(defaultAvatarForStyle(next));
  }

  return (
    <fieldset className="min-w-0 rounded-xl border border-amber-900/10 bg-amber-50/40 p-4">
      <legend className="text-sm font-semibold text-amber-950">아바타</legend>
      <p className="mt-1 text-xs text-amber-800/75">
        회원 목록에 표시되는 캐릭터입니다.
      </p>

      <label className="mt-4 block text-sm sm:max-w-md">
        <span className="text-amber-900/80">스타일</span>
        <Select
          className="mt-1"
          value={value.style}
          onChange={(e) => setStyle(e.target.value as AvatarStyleId)}
        >
          {AVATAR_STYLES.map((s) => (
            <option key={s} value={s}>
              {AVATAR_STYLE_LABELS[s]}
            </option>
          ))}
        </Select>
      </label>

      {value.style === "lorelei" && !loreleiSaveAllowed ? (
        <div
          className="mt-3 rounded-lg border border-amber-800/20 bg-amber-100/50 px-3 py-2 text-xs leading-relaxed text-amber-950"
          role="status"
        >
          <p>
            <strong className="font-semibold">로렐라이</strong>는 후원 감사
            명단에 이름이 올라가고 금액이 표시된 경우에만 저장할 수 있습니다.
            미리보기·옵션 조절은 자유롭게 해 볼 수 있어요.
          </p>
          <p className="mt-1.5 text-amber-900/85">
            <Link
              href="/donate"
              className="font-medium text-amber-900 underline decoration-amber-800/35 underline-offset-2"
            >
              후원하기
            </Link>
            · 저장 시에는 다른 스타일을 선택하거나, 후원 후 표시 이름을 명단과
            맞춰 주세요.
          </p>
        </div>
      ) : null}

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
            onClick={() => onChange(randomAvatarConfig(value))}
            className="rounded-full border border-amber-900/25 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 shadow-sm hover:bg-amber-50"
          >
            랜덤 생성
          </button>
        </div>

        {value.style === "lorelei" ? (
          <AvatarLoreleiPanel value={value} onChange={onChange} />
        ) : null}
        {value.style === "avataaars" ? (
          <AvatarAvataaarsPanel value={value} onChange={onChange} />
        ) : null}
        {value.style === "micah" ? (
          <AvatarMicahPanel value={value} onChange={onChange} />
        ) : null}
        {value.style === "toon-head" ? (
          <AvatarToonHeadPanel value={value} onChange={onChange} />
        ) : null}
        {value.style === "thumbs" ? (
          <AvatarThumbsPanel value={value} onChange={onChange} />
        ) : null}
        {value.style === "adventurer" ? (
          <AvatarAdventurerPanel value={value} onChange={onChange} />
        ) : null}
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
              아바타가 저장됐습니다.
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
