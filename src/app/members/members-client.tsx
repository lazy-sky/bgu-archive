"use client";

import { AchievementBadgeShowcase } from "@/components/achievement-badge-showcase";
import { MemberAvatar } from "@/components/member-avatar";
import { RuleMasterCollapsible } from "@/components/rule-master-collapsible";
import { useSupabase } from "@/components/auth-provider";
import { fetchAchievementBadgesByUser } from "@/lib/hall-of-fame-api";
import { formatMbtiDisplay } from "@/lib/format-mbti";
import { fetchMembers } from "@/lib/members-api";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function MembersClient() {
  const supabase = useSupabase();

  const { data: members = [], isPending, error } = useQuery({
    queryKey: ["members"],
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchMembers(supabase);
    },
    enabled: !!supabase,
    staleTime: 30 * 1000,
  });

  const { data: badgeMap } = useQuery({
    queryKey: ["member-achievement-badges"],
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchAchievementBadgesByUser(supabase);
    },
    enabled: !!supabase,
    staleTime: 30 * 1000,
  });

  const membersWithBadges = useMemo(() => {
    return members.map((m) => ({
      ...m,
      achievementBadges: badgeMap?.get(m.id) ?? [],
    }));
  }, [members, badgeMap]);

  if (!supabase) {
    return (
      <p className="rounded-lg border border-amber-900/15 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
        지금은 회원 목록을 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.
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

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {membersWithBadges.map((m) => (
        <li
          key={m.id}
          className="min-w-0 rounded-xl border border-amber-900/10 bg-white/80 p-4 shadow-sm sm:p-5"
        >
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <MemberAvatar
                config={m.avatarConfig}
                size={56}
                seedFallback={m.id}
                className="mt-0.5 ring-amber-900/10"
              />
              <h2 className="min-w-0 flex-1 text-base font-semibold text-amber-950 sm:text-lg">
                {m.displayName}
              </h2>
            </div>
            <span className="shrink-0 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
              {formatMbtiDisplay(m.mbti)}
            </span>
          </div>
          <AchievementBadgeShowcase
            badges={m.achievementBadges}
            variant="card"
          />
          <p className="mt-2 text-sm leading-relaxed text-amber-900/85">
            {m.bio}
          </p>
          <div className="mt-3 text-sm">
            <span className="text-amber-900/55">선호 장르: </span>
            <span className="text-amber-900">
              {m.favoriteGenres.join(", ")}
            </span>
          </div>
          <div className="mt-1 text-sm">
            <span className="text-amber-900/55">플레이 스타일: </span>
            <span className="text-amber-900">
              {m.favoriteGameTypes.join(", ")}
            </span>
          </div>
          <div className="mt-3 border-t border-amber-900/10 pt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-900/50">
              룰마스터 가능
            </p>
            <div className="mt-1.5">
              <RuleMasterCollapsible
                names={m.ruleMasterGames}
                countLabel="게임"
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
