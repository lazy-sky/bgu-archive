"use client";

import { GameRecommendPanel } from "@/components/game-recommend-panel";
import { useAuth, useSupabase } from "@/components/auth-provider";
import { fetchGames } from "@/lib/games-api";
import { fetchMembers } from "@/lib/members-api";
import { buildRuleMastersByGameName } from "@/lib/rule-master";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo } from "react";

export function RecommendClient() {
  const supabase = useSupabase();
  const { session } = useAuth();
  const viewerKey = session?.user.id ?? "anon";

  const { data: games = [], isPending, error } = useQuery({
    queryKey: ["games", viewerKey],
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchGames(supabase, { viewerUserId: session?.user.id });
    },
    enabled: !!supabase,
    staleTime: 30 * 1000,
  });

  const { data: members = [], isPending: membersPending } = useQuery({
    queryKey: ["members"],
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchMembers(supabase);
    },
    enabled: !!supabase,
    staleTime: 30 * 1000,
  });

  const ruleMastersByGame = useMemo(
    () => buildRuleMastersByGameName(members),
    [members],
  );

  if (!supabase) {
    return (
      <p className="rounded-lg border border-amber-900/15 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
        지금은 추천을 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-700" role="alert">
        {(error as Error).message}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-amber-900/60">
          {isPending || membersPending
            ? "불러오는 중…"
            : `${games.length}개 게임을 기준으로 추천합니다`}
        </p>
        <Link
          href="/games"
          className="inline-flex w-fit items-center justify-center rounded-full border border-amber-900/20 bg-white/70 px-4 py-2 text-sm font-medium text-amber-950 hover:bg-amber-50"
        >
          게임 목록으로
        </Link>
      </div>

      {games.length > 0 ? (
        <GameRecommendPanel
          games={games}
          members={members}
          ruleMastersByGame={ruleMastersByGame}
        />
      ) : (
        <p className="rounded-lg border border-amber-900/10 bg-white/60 px-4 py-6 text-center text-sm text-amber-800/80">
          등록된 게임이 없습니다.{" "}
          <Link href="/games" className="font-medium text-amber-900 underline">
            게임 목록
          </Link>
          에서 확인하거나, 로그인 후 게임을 추가해 주세요.
        </p>
      )}
    </div>
  );
}
