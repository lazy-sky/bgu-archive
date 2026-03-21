"use client";

import { useAuth, useSupabase } from "@/components/auth-provider";
import { fetchGames, getGameGenres } from "@/lib/games-api";
import { fetchProfile } from "@/lib/profile-api";
import { fetchMembers } from "@/lib/members-api";
import { formatMaxPlayers, formatMinPlayers } from "@/lib/format-players";
import { buildRuleMastersByGameName } from "@/lib/rule-master";
import type { Game } from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";

function filterGames(
  list: Game[],
  q: string,
  genre: string,
  beginner: "all" | "yes" | "no",
  maxDifficulty: number,
): Game[] {
  const needle = q.trim().toLowerCase();
  return list.filter((g) => {
    if (needle && !g.name.toLowerCase().includes(needle)) return false;
    if (genre && g.genre !== genre) return false;
    if (beginner === "yes" && !g.beginnerFriendly) return false;
    if (beginner === "no" && g.beginnerFriendly) return false;
    if (g.difficulty != null && g.difficulty > maxDifficulty) return false;
    return true;
  });
}

export function GamesClient() {
  const supabase = useSupabase();
  const { session } = useAuth();

  const { data: myProfile } = useQuery({
    queryKey: ["profile", session?.user.id],
    queryFn: async () => {
      if (!supabase || !session?.user.id) return null;
      return fetchProfile(supabase, session.user.id);
    },
    enabled: !!supabase && !!session?.user.id,
    staleTime: 30 * 1000,
  });
  const isAdmin = myProfile?.is_admin ?? false;

  const { data: games = [], isPending, error } = useQuery({
    queryKey: ["games"],
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchGames(supabase);
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
        지금은 게임 목록을 불러올 수 없습니다. 잠시 후 다시 시도하거나 관리자에게
        문의해 주세요.
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

  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const [beginner, setBeginner] = useState<"all" | "yes" | "no">("all");
  const [maxDifficulty, setMaxDifficulty] = useState(4);

  const genres = useMemo(() => getGameGenres(games), [games]);
  const filtered = useMemo(
    () => filterGames(games, q, genre, beginner, maxDifficulty),
    [games, q, genre, beginner, maxDifficulty],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm text-amber-900/60">
            {isPending || membersPending
              ? "불러오는 중…"
              : `${filtered.length} / ${games.length}개 표시`}
          </p>
          <Link
            href="/games/recommend"
            className="text-sm font-medium text-violet-800 underline decoration-violet-800/40 underline-offset-2 hover:text-violet-950"
          >
            게임 추천
          </Link>
        </div>
        {session ? (
          <Link
            href="/games/new"
            className="inline-flex w-fit items-center justify-center rounded-full bg-amber-900 px-4 py-2 text-sm font-medium text-amber-50 hover:bg-amber-800"
          >
            게임 추가
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="text-sm text-amber-800 underline underline-offset-2 hover:text-amber-950"
          >
            로그인하면 게임을 등록할 수 있어요
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-amber-900/10 bg-white/60 p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-amber-900/70">검색</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="게임명"
              className="rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950 outline-none ring-amber-400/30 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-amber-900/70">장르</span>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950 outline-none focus:ring-2 focus:ring-amber-400/30"
            >
              <option value="">전체</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-amber-900/70">입문용</span>
            <select
              value={beginner}
              onChange={(e) =>
                setBeginner(e.target.value as "all" | "yes" | "no")
              }
              className="rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950 outline-none focus:ring-2 focus:ring-amber-400/30"
            >
              <option value="all">전체</option>
              <option value="yes">입문용만</option>
              <option value="no">비입문만</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-amber-900/70">난이도 이하</span>
            <select
              value={maxDifficulty}
              onChange={(e) => setMaxDifficulty(Number(e.target.value))}
              className="rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950 outline-none focus:ring-2 focus:ring-amber-400/30"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} 이하
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <ul className="space-y-3 md:hidden" role="list">
        {filtered.map((g, rowIndex) => {
          const rm = ruleMastersByGame.get(g.name) ?? [];
          const n = rowIndex + 1;
          return (
            <li
              key={g.id}
              className="rounded-xl border border-amber-900/10 bg-white/80 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="min-w-0 flex-1 text-base font-semibold text-amber-950">
                  <span className="mr-2 tabular-nums text-amber-800/55">
                    {n}.
                  </span>
                  {g.name}
                </h3>
                {session?.user.id &&
                  (isAdmin ||
                    (g.addedBy != null && session.user.id === g.addedBy)) && (
                    <Link
                      href={`/games/${g.id}/edit`}
                      className="shrink-0 text-sm font-medium text-amber-800 underline underline-offset-2 hover:text-amber-950"
                    >
                      수정
                    </Link>
                  )}
              </div>
              <div className="mt-3 space-y-2 text-sm text-amber-900/90">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <span>
                    난이도 <strong className="font-medium">{g.difficulty ?? "—"}</strong>
                  </span>
                  <span className="text-amber-800/80">· {g.genre}</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-amber-800/85">
                  <span>인원(최소) {formatMinPlayers(g)}</span>
                  <span>인원(최대) {formatMaxPlayers(g)}</span>
                </div>
                <div>
                  {g.beginnerFriendly ? (
                    <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-900">
                      입문
                    </span>
                  ) : (
                    <span className="text-amber-800/60">입문 아님</span>
                  )}
                </div>
                <div>
                  <span className="text-amber-900/55">룰마스터 가능: </span>
                  {rm.length ? (
                    <span className="leading-snug">{rm.join(", ")}</span>
                  ) : (
                    <span className="text-amber-800/50">—</span>
                  )}
                </div>
                <div>
                  <span className="text-amber-900/55">추가한 사람: </span>
                  {g.addedByName ?? "—"}
                </div>
                {(g.notes || g.extraNotes) && (
                  <div className="border-t border-amber-900/10 pt-2 text-amber-900/85">
                    {g.notes && <p className="break-words">{g.notes}</p>}
                    {g.extraNotes && (
                      <p className="mt-1 break-words text-xs text-amber-800/70">
                        {g.extraNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-x-auto rounded-xl border border-amber-900/10 bg-white/80 shadow-sm [touch-action:pan-x] md:block">
        <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-amber-900/10 bg-amber-100/50 text-amber-950">
              <th className="w-12 px-2 py-3 text-center font-medium tabular-nums text-amber-900/70">
                번호
              </th>
              <th className="px-3 py-3 font-medium">게임명</th>
              <th className="px-3 py-3 font-medium">난이도</th>
              <th className="px-3 py-3 font-medium">장르</th>
              <th className="px-3 py-3 font-medium">인원(최소)</th>
              <th className="px-3 py-3 font-medium">인원(최대)</th>
              <th className="px-3 py-3 font-medium">입문</th>
              <th className="px-3 py-3 font-medium">룰마스터 가능</th>
              <th className="px-3 py-3 font-medium">추가한 사람</th>
              <th className="px-3 py-3 font-medium">비고</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g, rowIndex) => {
              const rm = ruleMastersByGame.get(g.name) ?? [];
              const n = rowIndex + 1;
              return (
                <tr
                  key={g.id}
                  className="border-b border-amber-900/5 odd:bg-amber-50/30 hover:bg-amber-100/40"
                >
                  <td className="px-2 py-2.5 text-center tabular-nums text-amber-800/75">
                    {n}
                  </td>
                  <td className="max-w-[220px] px-3 py-2.5 font-medium text-amber-950">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="min-w-0">{g.name}</span>
                      {session?.user.id &&
                        (isAdmin ||
                          (g.addedBy != null &&
                            session.user.id === g.addedBy)) && (
                          <Link
                            href={`/games/${g.id}/edit`}
                            className="shrink-0 text-xs font-medium text-amber-800 underline underline-offset-2 hover:text-amber-950"
                          >
                            수정
                          </Link>
                        )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-amber-900/90">
                    {g.difficulty ?? "—"}
                  </td>
                  <td className="px-3 py-2.5 text-amber-900/90">{g.genre}</td>
                  <td className="px-3 py-2.5 text-amber-800/80">
                    {formatMinPlayers(g)}
                  </td>
                  <td className="px-3 py-2.5 text-amber-800/80">
                    {formatMaxPlayers(g)}
                  </td>
                  <td className="px-3 py-2.5">
                    {g.beginnerFriendly ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-900">
                        입문
                      </span>
                    ) : (
                      <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-700">
                        —
                      </span>
                    )}
                  </td>
                  <td className="max-w-[200px] px-3 py-2.5 text-amber-900/85">
                    {rm.length ? (
                      <span className="leading-snug">{rm.join(", ")}</span>
                    ) : (
                      <span className="text-amber-800/50">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-amber-900/90">
                    {g.addedByName ?? "—"}
                  </td>
                  <td className="max-w-[200px] px-3 py-2.5 text-amber-900/85">
                    <div className="space-y-1">
                      {g.notes && <p>{g.notes}</p>}
                      {g.extraNotes && (
                        <p className="text-xs text-amber-800/70">
                          {g.extraNotes}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
