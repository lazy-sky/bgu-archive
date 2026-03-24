"use client";

import { MemberAvatar } from "@/components/member-avatar";
import { RuleMasterCollapsible } from "@/components/rule-master-collapsible";
import { formatMbtiDisplay } from "@/lib/format-mbti";
import type { Member } from "@/types/member";
import { useEffect, useId } from "react";

type Props = {
  member: Member | null;
  open: boolean;
  onClose: () => void;
};

export function MemberProfileDialog({ member, open, onClose }: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !member) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6"
    >
      <button
        type="button"
        className="absolute inset-0 bg-amber-950/45 backdrop-blur-[1px] transition-opacity"
        aria-label="프로필 닫기"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(85vh,36rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-amber-900/15 bg-gradient-to-b from-white to-amber-50/95 shadow-2xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-amber-900/10 bg-white/90 px-5 py-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <MemberAvatar
              config={member.avatarConfig}
              size={56}
              seedFallback={member.id}
              className="mt-0.5 shrink-0 ring-amber-900/10"
            />
            <div className="min-w-0">
              <h2
                id={titleId}
                className="text-lg font-semibold tracking-tight text-amber-950"
              >
                {member.displayName}
              </h2>
              <p className="mt-0.5 text-xs text-amber-800/70">
                MBTI {formatMbtiDisplay(member.mbti)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-amber-900/15 bg-white px-3 py-1.5 text-sm font-medium text-amber-950 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
          >
            닫기
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-4">
          <p className="text-sm leading-relaxed text-amber-900/85 whitespace-pre-wrap">
            {member.bio.trim() ? member.bio : "소개가 없습니다."}
          </p>
          <div className="mt-4 text-sm">
            <span className="text-amber-900/55">선호 장르: </span>
            <span className="text-amber-900">
              {member.favoriteGenres.length
                ? member.favoriteGenres.join(", ")
                : "—"}
            </span>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-amber-900/55">플레이 스타일: </span>
            <span className="text-amber-900">
              {member.favoriteGameTypes.length
                ? member.favoriteGameTypes.join(", ")
                : "—"}
            </span>
          </div>
          <div className="mt-4 border-t border-amber-900/10 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-900/50">
              룰마스터 가능
            </p>
            <div className="mt-1.5">
              <RuleMasterCollapsible
                names={member.ruleMasterGames}
                countLabel="게임"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
