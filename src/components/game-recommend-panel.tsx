"use client";

import { canAccommodatePlayerCount } from "@/lib/game-capacity";
import { formatMaxPlayers, formatMinPlayers } from "@/lib/format-players";
import type { Game } from "@/types/game";
import type { Member } from "@/types/member";
import { useMemo, useState } from "react";

type Props = {
  games: Game[];
  members: Member[];
  ruleMastersByGame: Map<string, string[]>;
};

export function GameRecommendPanel({
  games,
  members,
  ruleMastersByGame,
}: Props) {
  const [playerCount, setPlayerCount] = useState<string>("4");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [onlySelectedCanRule, setOnlySelectedCanRule] = useState(false);
  const [preferBeginner, setPreferBeginner] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const n = Number(playerCount);
  const validN = Number.isFinite(n) && n >= 1;

  const recommended = useMemo(() => {
    if (!Number.isFinite(n) || n < 1) return [];
    let list = games.filter((g) => canAccommodatePlayerCount(g, n));

    const selectedMembers = members.filter((m) => selectedIds.has(m.id));
    if (onlySelectedCanRule && selectedMembers.length > 0) {
      list = list.filter((g) =>
        selectedMembers.some((m) =>
          m.ruleMasterGames.some((rm) => rm.trim() === g.name.trim()),
        ),
      );
    }

    const sorted = [...list].sort((a, b) => {
      if (preferBeginner) {
        if (a.beginnerFriendly !== b.beginnerFriendly) {
          return a.beginnerFriendly ? -1 : 1;
        }
      }
      const da = a.difficulty ?? 99;
      const db = b.difficulty ?? 99;
      if (da !== db) return da - db;
      return a.name.localeCompare(b.name, "ko");
    });
    return sorted;
  }, [
    games,
    n,
    members,
    selectedIds,
    onlySelectedCanRule,
    preferBeginner,
  ]);

  function toggleMember(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="rounded-xl border border-violet-200/80 bg-violet-50/40 p-4 shadow-sm sm:p-5">
      <h2 className="text-base font-semibold text-amber-950 sm:text-lg">게임 추천</h2>
      <p className="mt-1 text-sm text-amber-900/65">
        인원 수에 맞는 게임을 골라 보세요. 같이 할 사람을 고르면 그중 누가 룰을
        설명할 수 있는지도 함께 볼 수 있어요.
      </p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-amber-900/70">플레이 인원</span>
          <input
            type="number"
            min={1}
            value={playerCount}
            onChange={(e) => setPlayerCount(e.target.value)}
            className="w-28 rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950"
          />
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-900/85">
          <input
            type="checkbox"
            checked={preferBeginner}
            onChange={(e) => setPreferBeginner(e.target.checked)}
            className="rounded border-amber-900/30"
          />
          입문용 우선 정렬
        </label>

        <button
          type="button"
          onClick={() => setShowResults(true)}
          disabled={!validN}
          className="rounded-full bg-violet-800 px-5 py-2 text-sm font-medium text-white hover:bg-violet-900 disabled:opacity-50"
        >
          추천 보기
        </button>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-amber-900/80">
          같이 할 사람 (선택)
        </p>
        {members.length === 0 && (
          <p className="mt-2 text-sm text-amber-800/70">
            아직 등록된 회원이 없습니다. 로그인 후 이용할 수 있어요.
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {members.map((m) => (
            <label
              key={m.id}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-amber-900/15 bg-white/80 px-3 py-1.5 text-sm text-amber-950 has-[:checked]:border-violet-400 has-[:checked]:bg-violet-100/60"
            >
              <input
                type="checkbox"
                checked={selectedIds.has(m.id)}
                onChange={() => toggleMember(m.id)}
                className="rounded border-amber-900/30"
              />
              {m.displayName}
            </label>
          ))}
        </div>
        {selectedIds.size > 0 && (
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-amber-900/85">
            <input
              type="checkbox"
              checked={onlySelectedCanRule}
              onChange={(e) => setOnlySelectedCanRule(e.target.checked)}
              className="rounded border-amber-900/30"
            />
            선택한 사람만 룰마스터 가능한 게임만 보기
          </label>
        )}
      </div>

      {showResults && validN && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-amber-900/10 bg-white/90">
          <p className="border-b border-amber-900/10 bg-violet-100/40 px-3 py-2 text-sm text-amber-900">
            조건에 맞는 게임 <strong>{recommended.length}</strong>개
            {onlySelectedCanRule && selectedIds.size > 0 && (
              <span className="text-amber-800/80">
                {" "}
                (선택 인원 중 룰 설명 가능한 것만)
              </span>
            )}
          </p>
          {recommended.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-amber-800/70">
              조건에 맞는 게임이 없어요. 인원 수를 바꾸거나 필터를 끄고 다시
              시도해 보세요.
            </p>
          ) : (
            <>
              <ul className="space-y-3 p-3 md:hidden" role="list">
                {recommended.slice(0, 80).map((g, rowIndex) => {
                  const rms = ruleMastersByGame.get(g.name) ?? [];
                  const n = rowIndex + 1;
                  return (
                    <li
                      key={g.id}
                      className="rounded-lg border border-amber-900/10 bg-white/90 p-3"
                    >
                      <p className="font-medium text-amber-950">
                        <span className="mr-2 tabular-nums text-amber-800/55">
                          {n}.
                        </span>
                        {g.name}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-amber-900/90">
                        <span>난이도 {g.difficulty ?? "—"}</span>
                        <span className="text-amber-800/80">{g.genre}</span>
                        <span>{formatMinPlayers(g)}</span>
                        <span>최대 {formatMaxPlayers(g)}</span>
                      </div>
                      <div className="mt-2 text-sm">
                        {g.beginnerFriendly ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-900">
                            입문
                          </span>
                        ) : (
                          <span className="text-amber-800/60">—</span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-amber-900/90">
                        <span className="text-amber-900/55">룰마스터: </span>
                        {rms.length ? rms.join(", ") : "—"}
                      </p>
                    </li>
                  );
                })}
              </ul>
              <table className="hidden w-full min-w-[820px] text-left text-sm md:table">
                <thead>
                  <tr className="border-b border-amber-900/10 bg-amber-50/80 text-amber-950">
                    <th className="w-12 px-2 py-2 text-center font-medium tabular-nums text-amber-900/70">
                      번호
                    </th>
                    <th className="px-3 py-2 font-medium">게임명</th>
                    <th className="px-3 py-2 font-medium">난이도</th>
                    <th className="px-3 py-2 font-medium">장르</th>
                    <th className="px-3 py-2 font-medium">인원(최소)</th>
                    <th className="px-3 py-2 font-medium">인원(최대)</th>
                    <th className="px-3 py-2 font-medium">입문</th>
                    <th className="px-3 py-2 font-medium">룰마스터 가능</th>
                  </tr>
                </thead>
                <tbody>
                  {recommended.slice(0, 80).map((g, rowIndex) => {
                    const rms = ruleMastersByGame.get(g.name) ?? [];
                    const n = rowIndex + 1;
                    return (
                      <tr
                        key={g.id}
                        className="border-b border-amber-900/5 odd:bg-amber-50/20"
                      >
                        <td className="px-2 py-2 text-center tabular-nums text-amber-800/75">
                          {n}
                        </td>
                        <td className="px-3 py-2 font-medium text-amber-950">
                          {g.name}
                        </td>
                        <td className="px-3 py-2 text-amber-900/90">
                          {g.difficulty ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-amber-900/90">{g.genre}</td>
                        <td className="px-3 py-2 text-amber-800/80">
                          {formatMinPlayers(g)}
                        </td>
                        <td className="px-3 py-2 text-amber-800/80">
                          {formatMaxPlayers(g)}
                        </td>
                        <td className="px-3 py-2">
                          {g.beginnerFriendly ? (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-900">
                              입문
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="max-w-[220px] px-3 py-2 text-amber-900/90">
                          {rms.length ? rms.join(", ") : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
          {recommended.length > 80 && (
            <p className="border-t border-amber-900/10 px-3 py-2 text-xs text-amber-800/70">
              상위 80개만 표시했습니다. 목록을 줄이려면 게임 목록 페이지에서
              장르·난이도로 걸러 보세요.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
