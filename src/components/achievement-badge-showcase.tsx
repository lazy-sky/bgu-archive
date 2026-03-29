"use client";

import type { AchievementBadge } from "@/types/hall-of-fame";
import Link from "next/link";
import { useId } from "react";

/** 컵·손잡이·받침이 분명한 트로피 실루엣 (24×24 기준 단일 path) */
function TrophyIcon({ className }: { className?: string }) {
  const uid = useId();
  const gradId = `trophy-grad-${uid.replace(/:/g, "")}`;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="5" y1="3" x2="19" y2="21">
          <stop stopColor="#fde68a" />
          <stop offset="0.45" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradId})`}
        d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"
      />
    </svg>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <span
      className={[
        "pointer-events-none select-none text-amber-300/90",
        className ?? "",
      ].join(" ")}
      aria-hidden
    >
      ✦
    </span>
  );
}

type ShowcaseProps = {
  badges: AchievementBadge[];
  /** 회원 카드용: 한 줄 칩 */
  variant?: "card" | "profile";
  /** 프로필에서만 링크 표시 */
  showHallLink?: boolean;
};

export function AchievementBadgeShowcase({
  badges,
  variant = "card",
  showHallLink = false,
}: ShowcaseProps) {
  if (badges.length === 0) return null;

  if (variant === "card") {
    return (
      <div className="relative mt-3 overflow-hidden rounded-xl border border-amber-400/35 bg-gradient-to-br from-amber-50/95 via-yellow-50/80 to-amber-100/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_24px_-6px_rgba(180,83,9,0.35)] ring-1 ring-amber-300/40">
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-amber-300/30 to-transparent blur-2xl"
          aria-hidden
        />
        <div className="relative flex items-center gap-2">
          <TrophyIcon className="h-7 w-7 shrink-0 drop-shadow-sm" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-900/70">
              <Sparkles className="text-[10px]" />
              업적
            </p>
            <ul className="mt-1.5 flex flex-wrap gap-1.5" role="list">
              {badges.map((b) => (
                <li key={b.id}>
                  <span
                    className="inline-flex max-w-full items-center rounded-full border border-amber-600/25 bg-gradient-to-b from-amber-100/95 to-amber-200/60 px-2.5 py-1 text-xs font-semibold text-amber-950 shadow-sm [overflow-wrap:anywhere]"
                    title={b.title}
                  >
                    {b.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-100/90 via-yellow-50/95 to-violet-100/50 p-5 shadow-[0_12px_40px_-12px_rgba(124,45,18,0.45),inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-amber-400/50"
      aria-labelledby="profile-achievements-heading"
    >
      <div
        className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-gradient-to-br from-amber-300/40 to-transparent blur-3xl motion-reduce:opacity-60"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rounded-full bg-gradient-to-tl from-violet-400/25 to-transparent blur-2xl"
        aria-hidden
      />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 shadow-lg shadow-amber-900/25 ring-2 ring-amber-200/80">
              <TrophyIcon className="h-8 w-8" />
            </div>
            <div>
              <h2
                id="profile-achievements-heading"
                className="flex items-center gap-2 text-base font-bold tracking-tight text-amber-950"
              >
                <Sparkles />
                명예의 업적
              </h2>
              <p className="mt-0.5 text-xs text-amber-900/65">
                명예의 전당에 등록된 업적을 달성했어요.
              </p>
            </div>
          </div>
          {showHallLink ? (
            <Link
              href="/honors"
              className="shrink-0 text-xs font-medium text-violet-800 underline decoration-violet-700/40 underline-offset-2 hover:text-violet-950"
            >
              전체 보기 →
            </Link>
          ) : null}
        </div>
        <ul
          className="mt-4 grid gap-2.5 sm:grid-cols-1"
          role="list"
        >
          {badges.map((b) => (
            <li key={b.id}>
              <div className="flex items-center gap-2 rounded-xl border border-amber-600/20 bg-white/75 px-4 py-3 shadow-md shadow-amber-900/10 backdrop-blur-sm ring-1 ring-white/60">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-white shadow-inner"
                  aria-hidden
                >
                  ★
                </span>
                <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-amber-950 [overflow-wrap:anywhere]">
                  {b.title}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
