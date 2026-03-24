"use client";

import { MemberProfileDialog } from "@/components/member-profile-dialog";
import { MemberAvatar } from "@/components/member-avatar";
import { useSupabase } from "@/components/auth-provider";
import { formatMbtiDisplay } from "@/lib/format-mbti";
import { fetchMembers } from "@/lib/members-api";
import type { Member } from "@/types/member";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";

type RankingTabId = "rule_master" | "offline_plays";

const TABS: {
  id: RankingTabId;
  label: string;
  /** 짧은 부가 설명(접근성·툴팁용) */
  hint: string;
}[] = [
  {
    id: "rule_master",
    label: "겜잘알",
    hint: "프로필에 적어 둔 룰마스터 가능 게임 개수 기준",
  },
  {
    id: "offline_plays",
    label: "오프라인 플레이 기록",
    hint: "추후 오픈 예정",
  },
];

function sortByRuleMasterCount(members: Member[]): Member[] {
  return [...members].sort((a, b) => {
    const diff =
      b.ruleMasterGames.length - a.ruleMasterGames.length;
    if (diff !== 0) return diff;
    return a.displayName.localeCompare(b.displayName, "ko");
  });
}

const TOP_RANK_ROW_CLASS: Record<1 | 2 | 3, string> = {
  1: [
    "border-2 border-amber-400/95 bg-gradient-to-r from-amber-50 via-yellow-50/95 to-amber-50",
    "shadow-[0_4px_24px_-4px_rgba(234,179,8,0.45)]",
    "ring-2 ring-amber-400/55 ring-offset-2 ring-offset-transparent",
  ].join(" "),
  2: [
    "border-2 border-slate-300 bg-gradient-to-r from-slate-50 via-zinc-50/95 to-slate-100/90",
    "shadow-[0_4px_22px_-4px_rgba(148,163,184,0.55)]",
    "ring-2 ring-slate-300/60 ring-offset-2 ring-offset-transparent",
  ].join(" "),
  3: [
    "border-2 border-amber-800/60 bg-gradient-to-br from-orange-50/98 via-amber-50/90 to-orange-100/70",
    "shadow-[0_4px_22px_-4px_rgba(234,88,12,0.35)]",
    "ring-2 ring-orange-400/45 ring-offset-2 ring-offset-transparent",
  ].join(" "),
};

const MEDAL_META: Record<
  1 | 2 | 3,
  { emoji: string; label: string }
> = {
  1: { emoji: "🥇", label: "금메달" },
  2: { emoji: "🥈", label: "은메달" },
  3: { emoji: "🥉", label: "동메달" },
};

export function RankingClient() {
  const supabase = useSupabase();
  const [tab, setTab] = useState<RankingTabId>("rule_master");
  const [profileMember, setProfileMember] = useState<Member | null>(null);

  const { data: members = [], isPending, error } = useQuery({
    queryKey: ["members"],
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchMembers(supabase);
    },
    enabled: !!supabase,
    staleTime: 30 * 1000,
  });

  const ruleMasterRanking = useMemo(
    () => sortByRuleMasterCount(members),
    [members],
  );

  if (!supabase) {
    return (
      <p className="rounded-lg border border-amber-900/15 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
        지금은 랭킹을 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  if (isPending) {
    return <p className="text-amber-900/70">불러오는 중…</p>;
  }

  if (error) {
    return (
      <p className="text-red-700" role="alert">
        {(error as Error).message}
      </p>
    );
  }

  const tabBtnBase =
    "rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50";
  const tabBtnActive =
    "border-amber-800/40 bg-amber-900 text-amber-50 shadow-sm";
  const tabBtnIdle =
    "border-amber-900/15 bg-white/70 text-amber-950 hover:bg-amber-50/90";

  return (
    <div className="space-y-6">
      <nav
        className="flex flex-wrap gap-2"
        aria-label="랭킹 종류"
      >
        {TABS.map((t) => {
          const selected = tab === t.id;
          const isOffline = t.id === "offline_plays";
          return (
            <button
              key={t.id}
              type="button"
              title={t.hint}
              onClick={() => setTab(t.id)}
              className={`${tabBtnBase} ${selected ? tabBtnActive : tabBtnIdle}`}
              aria-pressed={selected}
            >
              {t.label}
              {isOffline ? (
                <span className="ml-1.5 text-xs font-normal opacity-90">
                  (추후 오픈)
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {tab === "offline_plays" ? (
        <section
          className="rounded-xl border border-dashed border-amber-900/25 bg-amber-50/50 px-5 py-10 text-center shadow-sm"
          aria-labelledby="offline-ranking-heading"
        >
          <h2
            id="offline-ranking-heading"
            className="text-base font-semibold text-amber-950"
          >
            오프라인 플레이 기록 랭킹
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-amber-900/85">
            동아리에서 오프라인으로 진행한 보드게임을 기록하는 기능을 준비 중입니다.
            <br />
            기록이 쌓이면 플레이 횟수·다양한 지표로 랭킹을 보여 드릴 예정입니다.
          </p>
          <p className="mt-4 text-sm font-medium text-amber-800/80">
            추후 오픈 예정입니다.
          </p>
        </section>
      ) : (
        <section aria-labelledby="rule-master-ranking-heading">
          <h2 id="rule-master-ranking-heading" className="sr-only">
            겜잘알 랭킹
          </h2>
          <p className="mb-4 text-sm text-amber-800/80">
            「겜잘알」은 프로필의「룰마스터 가능한 게임」에 체크해 둔 개수 순입니다.
            <span className="mt-1 block text-amber-800/65">
              행을 누르면 회원 프로필이 열립니다.
            </span>
          </p>
          <ol className="flex flex-col gap-2">
            {ruleMasterRanking.map((m, index) => {
              const rank = index + 1;
              const count = m.ruleMasterGames.length;
              const topThree = rank <= 3;
              const medalRow = topThree
                ? MEDAL_META[rank as 1 | 2 | 3]
                : null;
              const rowClass = topThree
                ? TOP_RANK_ROW_CLASS[rank as 1 | 2 | 3]
                : "border border-amber-900/10 bg-white/80 shadow-sm";

              return (
                <li key={m.id} className="list-none">
                  <button
                    type="button"
                    onClick={() => setProfileMember(m)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:brightness-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/55 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50/0 sm:gap-4 sm:px-5 sm:py-3.5 ${rowClass}`}
                  >
                    <div
                      className={`flex w-12 shrink-0 flex-col items-center justify-center gap-0.5 sm:w-14`}
                    >
                      {medalRow ? (
                        <span
                          className="text-2xl leading-none"
                          role="img"
                          aria-label={medalRow.label}
                        >
                          {medalRow.emoji}
                        </span>
                      ) : null}
                      <span
                        className={`text-center text-base font-bold tabular-nums sm:text-lg ${
                          topThree
                            ? "text-amber-950"
                            : "text-amber-800/75"
                        }`}
                        aria-label={`${rank}위`}
                      >
                        {rank}
                      </span>
                    </div>
                    <MemberAvatar
                      config={m.avatarConfig}
                      size={44}
                      seedFallback={m.id}
                      className={`shrink-0 ${
                        topThree
                          ? "ring-2 ring-amber-900/20"
                          : "ring-amber-900/10"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-amber-950">
                        {m.displayName}
                      </p>
                      <p className="text-xs text-amber-800/65">
                        MBTI {formatMbtiDisplay(m.mbti)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-lg font-semibold tabular-nums text-amber-950">
                        {count}
                      </span>
                      <span className="ml-1 text-xs text-amber-800/70">게임</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <p className="text-center text-sm">
        <Link
          href="/members"
          className="text-amber-900 underline decoration-amber-900/30 underline-offset-2 hover:text-amber-950"
        >
          ← 회원 목록
        </Link>
      </p>

      <MemberProfileDialog
        member={profileMember}
        open={profileMember != null}
        onClose={() => setProfileMember(null)}
      />
    </div>
  );
}
